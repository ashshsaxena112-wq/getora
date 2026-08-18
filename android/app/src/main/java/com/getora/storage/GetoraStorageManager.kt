package com.getora.storage

import android.content.Context
import android.net.Uri
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.exceptions.HttpRequestException
import io.github.jan.supabase.exceptions.RestException
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.storage.storage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import java.io.IOException
import java.util.UUID
import kotlin.time.Duration.Companion.seconds

/**
 * GETORA Storage Manager
 * Production-ready Android Storage client for Supabase Storage.
 *
 * Implements:
 * - uploadImage()
 * - deleteImage()
 * - replaceImage()
 * - getImageUrl()
 * - getSignedUrl()
 *
 * Features:
 * - Exponential backoff retry for network resiliency
 * - Client-side validation for MIME type and file size
 * - Safe filename generation: {userId}/{UUID}.{ext}
 * - Zero service-role key exposure (uses user's auth token)
 */
class GetoraStorageManager(
    private val supabase: SupabaseClient
) {

    private val storage: Storage get() = supabase.storage

    /**
     * Upload an image to Supabase Storage with validation and retry
     *
     * @param fileBytes Raw or compressed byte array
     * @param mimeType MIME type (e.g. "image/jpeg", "image/png", "image/webp")
     * @param bucket Target storage bucket
     * @param userId Authenticated user ID (used for folder isolation)
     * @param customFilename Optional custom filename
     * @param maxRetries Maximum retry attempts for transient network issues
     */
    fun uploadImage(
        fileBytes: ByteArray,
        mimeType: String,
        bucket: GetoraStorageBucket,
        userId: String,
        customFilename: String? = null,
        maxRetries: Int = 3
    ): Flow<StorageResult<StorageUploadResponse>> = flow {
        emit(StorageResult.Loading(0.1f, "Validating file..."))

        // 1. Validate File
        val validationError = ImageValidator.validateImage(fileBytes, mimeType, bucket)
        if (validationError != null) {
            emit(validationError)
            return@flow
        }

        // 2. Generate Unique File Path: userId/uuid.ext
        val extension = ImageValidator.getExtensionFromMime(mimeType)
        val fileName = customFilename ?: "${UUID.randomUUID()}.$extension"
        val storagePath = "$userId/$fileName"

        emit(StorageResult.Loading(0.3f, "Uploading to ${bucket.bucketName}..."))

        // 3. Upload with Exponential Backoff Retry
        var attempt = 0
        var lastException: Throwable? = null

        while (attempt < maxRetries) {
            try {
                attempt++
                val bucketApi = storage.from(bucket.bucketName)

                bucketApi.upload(
                    path = storagePath,
                    data = fileBytes,
                    upsert = true
                )

                // 4. Resolve Public URL for public buckets
                val publicUrl = if (bucket.isPublic) {
                    bucketApi.publicUrl(storagePath)
                } else {
                    null // Private bucket: use signed URL on demand
                }

                emit(StorageResult.Loading(1.0f, "Upload complete!"))
                emit(
                    StorageResult.Success(
                        StorageUploadResponse(
                            bucket = bucket,
                            storagePath = storagePath,
                            publicUrl = publicUrl,
                            fileSizeBytes = fileBytes.size.toLong(),
                            mimeType = mimeType
                        )
                    )
                )
                return@flow
            } catch (e: Exception) {
                lastException = e
                if (isNonRetryable(e)) {
                    emit(mapExceptionToError(e))
                    return@flow
                }
                if (attempt < maxRetries) {
                    val backoffDelay = (attempt * 1000L)
                    emit(StorageResult.Loading(0.3f, "Retrying upload (Attempt $attempt/$maxRetries)..."))
                    delay(backoffDelay)
                }
            }
        }

        emit(
            StorageResult.Error(
                error = StorageErrorType.UploadFailure,
                message = "Failed to upload image after $maxRetries attempts: ${lastException?.localizedMessage}",
                throwable = lastException
            )
        )
    }.flowOn(Dispatchers.IO)

    /**
     * Upload directly from Android Uri (Gallery / Camera selection)
     */
    fun uploadImageUri(
        context: Context,
        uri: Uri,
        bucket: GetoraStorageBucket,
        userId: String,
        compress: Boolean = true,
        maxRetries: Int = 3
    ): Flow<StorageResult<StorageUploadResponse>> = flow {
        emit(StorageResult.Loading(0.05f, "Reading image from device..."))

        val mimeType = ImageValidator.getMimeType(context, uri)
        val rawBytes = ImageValidator.readUriBytes(context, uri, bucket.maxSizeBytes)

        if (rawBytes == null) {
            emit(
                StorageResult.Error(
                    error = StorageErrorType.FileNotFound,
                    message = "Could not read file from selected URI or file exceeds memory limit."
                )
            )
            return@flow
        }

        val processedBytes = if (compress && mimeType.startsWith("image/")) {
            emit(StorageResult.Loading(0.15f, "Optimizing image..."))
            ImageValidator.compressBitmap(rawBytes)
        } else {
            rawBytes
        }

        // Delegate to uploadImage
        uploadImage(
            fileBytes = processedBytes,
            mimeType = mimeType,
            bucket = bucket,
            userId = userId,
            maxRetries = maxRetries
        ).collect { result ->
            emit(result)
        }
    }.flowOn(Dispatchers.IO)

    /**
     * Delete an image from Supabase Storage
     *
     * @param bucket Target storage bucket
     * @param storagePath The relative path of the file in the bucket (e.g. "userId/filename.jpg")
     */
    fun deleteImage(
        bucket: GetoraStorageBucket,
        storagePath: String,
        maxRetries: Int = 3
    ): Flow<StorageResult<Boolean>> = flow {
        emit(StorageResult.Loading(0.2f, "Deleting image..."))

        var attempt = 0
        var lastException: Throwable? = null

        while (attempt < maxRetries) {
            try {
                attempt++
                val bucketApi = storage.from(bucket.bucketName)
                bucketApi.delete(listOf(storagePath))
                emit(StorageResult.Success(true))
                return@flow
            } catch (e: Exception) {
                lastException = e
                if (isNonRetryable(e)) {
                    emit(mapExceptionToError(e))
                    return@flow
                }
                if (attempt < maxRetries) {
                    delay(attempt * 1000L)
                }
            }
        }

        emit(
            StorageResult.Error(
                error = StorageErrorType.ServerError,
                message = "Failed to delete file after $maxRetries attempts: ${lastException?.localizedMessage}",
                throwable = lastException
            )
        )
    }.flowOn(Dispatchers.IO)

    /**
     * Replace an existing image with a new one
     * Uploads the new image first and safely deletes the old image upon successful upload.
     */
    fun replaceImage(
        newFileBytes: ByteArray,
        mimeType: String,
        bucket: GetoraStorageBucket,
        oldStoragePath: String?,
        userId: String,
        maxRetries: Int = 3
    ): Flow<StorageResult<StorageUploadResponse>> = flow {
        emit(StorageResult.Loading(0.1f, "Replacing image..."))

        var newUploadResponse: StorageUploadResponse? = null

        // 1. Upload new image first
        uploadImage(
            fileBytes = newFileBytes,
            mimeType = mimeType,
            bucket = bucket,
            userId = userId,
            maxRetries = maxRetries
        ).collect { result ->
            when (result) {
                is StorageResult.Loading -> emit(result)
                is StorageResult.Error -> emit(result)
                is StorageResult.Success -> {
                    newUploadResponse = result.data
                }
            }
        }

        val upload = newUploadResponse
        if (upload != null) {
            // 2. Safely delete old image in background if path exists and differs
            if (!oldStoragePath.isNullOrBlank() && oldStoragePath != upload.storagePath) {
                try {
                    storage.from(bucket.bucketName).delete(listOf(oldStoragePath))
                } catch (ignored: Exception) {
                    // Suppress deletion error so user upload is not blocked
                }
            }
            emit(StorageResult.Success(upload))
        }
    }.flowOn(Dispatchers.IO)

    /**
     * Get public URL for a storage path in a public bucket
     */
    fun getImageUrl(bucket: GetoraStorageBucket, storagePath: String): String {
        return storage.from(bucket.bucketName).publicUrl(storagePath)
    }

    /**
     * Generate a temporary Signed URL for private buckets (e.g. delivery-documents)
     *
     * @param bucket Target bucket (e.g. DELIVERY_DOCUMENTS)
     * @param storagePath Path to file
     * @param expiresInSeconds Validity duration in seconds (default 3600 = 1 hour)
     */
    fun getSignedUrl(
        bucket: GetoraStorageBucket,
        storagePath: String,
        expiresInSeconds: Long = 3600
    ): Flow<StorageResult<String>> = flow {
        emit(StorageResult.Loading(0.2f, "Generating secure URL..."))
        try {
            val signedUrl = storage.from(bucket.bucketName).createSignedUrl(
                path = storagePath,
                expiresIn = expiresInSeconds.seconds
            )
            emit(StorageResult.Success(signedUrl))
        } catch (e: Exception) {
            emit(mapExceptionToError(e))
        }
    }.flowOn(Dispatchers.IO)

    // ==============================================================================
    // Error Handling & Classification
    // ==============================================================================

    private fun isNonRetryable(e: Throwable): Boolean {
        return when (e) {
            is RestException -> {
                val status = e.statusCode ?: 0
                status in 400..404 // Bad request, Unauthorized, Forbidden, Not Found
            }
            is IllegalArgumentException -> true
            else -> false
        }
    }

    private fun mapExceptionToError(e: Throwable): StorageResult.Error {
        return when (e) {
            is RestException -> {
                when (e.statusCode) {
                    401 -> StorageResult.Error(
                        error = StorageErrorType.AuthenticationFailure,
                        message = "Authentication required. Please login again.",
                        throwable = e
                    )
                    403 -> StorageResult.Error(
                        error = StorageErrorType.PermissionDenied,
                        message = "You don't have permission to modify this storage path.",
                        throwable = e
                    )
                    404 -> StorageResult.Error(
                        error = StorageErrorType.FileNotFound,
                        message = "The requested file or bucket was not found.",
                        throwable = e
                    )
                    413 -> StorageResult.Error(
                        error = StorageErrorType.FileTooLarge,
                        message = "The uploaded file exceeds the bucket limit.",
                        throwable = e
                    )
                    else -> StorageResult.Error(
                        error = StorageErrorType.ServerError,
                        message = "Supabase Storage Error (${e.statusCode}): ${e.message}",
                        throwable = e
                    )
                }
            }
            is HttpRequestException, is IOException -> {
                StorageResult.Error(
                    error = StorageErrorType.NetworkFailure,
                    message = "Network connection failed. Please check your internet connection.",
                    throwable = e
                )
            }
            else -> {
                StorageResult.Error(
                    error = StorageErrorType.Unknown(e.localizedMessage ?: "Unknown error"),
                    message = e.localizedMessage ?: "An unexpected error occurred during storage operation.",
                    throwable = e
                )
            }
        }
    }
}
