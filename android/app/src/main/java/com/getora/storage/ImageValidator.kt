package com.getora.storage

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.webkit.MimeTypeMap
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.util.Locale

/**
 * Image Validator & Pre-processing Utility
 * Validates formats (JPG, JPEG, PNG, WEBP), checks size thresholds, and compresses images safely.
 */
object ImageValidator {

    private val ALLOWED_IMAGE_EXTENSIONS = setOf("jpg", "jpeg", "png", "webp")
    private val ALLOWED_DOCUMENT_EXTENSIONS = setOf("jpg", "jpeg", "png", "webp", "pdf")

    /**
     * Validates file size and format against target bucket rules
     */
    fun validateImage(
        fileBytes: ByteArray,
        mimeType: String,
        bucket: GetoraStorageBucket
    ): StorageResult.Error? {
        val normalizedMime = mimeType.lowercase(Locale.ROOT).trim()

        // 1. Validate MIME Type
        if (!bucket.allowedMimeTypes.contains(normalizedMime)) {
            return StorageResult.Error(
                error = StorageErrorType.InvalidFileType,
                message = "Invalid format '$mimeType'. Allowed: ${bucket.allowedMimeTypes.joinToString()}"
            )
        }

        // 2. Validate File Size
        if (fileBytes.size > bucket.maxSizeBytes) {
            val maxMb = bucket.maxSizeBytes / (1024 * 1024)
            val actualMb = fileBytes.size.toDouble() / (1024 * 1024)
            return StorageResult.Error(
                error = StorageErrorType.FileTooLarge,
                message = "File is too large (%.2f MB). Maximum allowed size is %d MB.".format(actualMb, maxMb)
            )
        }

        return null
    }

    /**
     * Resolves MIME type from Android Uri
     */
    fun getMimeType(context: Context, uri: Uri): String {
        return context.contentResolver.getType(uri) ?: run {
            val extension = MimeTypeMap.getFileExtensionFromUrl(uri.toString())
            if (!extension.isNullOrEmpty()) {
                MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.lowercase(Locale.ROOT))
            } else {
                null
            }
        } ?: "image/jpeg"
    }

    /**
     * Reads URI bytes into ByteArray with size safety
     */
    fun readUriBytes(context: Context, uri: Uri, maxBytesLimit: Long): ByteArray? {
        return try {
            val inputStream: InputStream? = context.contentResolver.openInputStream(uri)
            inputStream?.use { stream ->
                val buffer = ByteArrayOutputStream()
                val data = ByteArray(8192)
                var count: Int
                var totalBytes = 0L

                while (stream.read(data, 0, data.size).also { count = it } != -1) {
                    totalBytes += count
                    if (totalBytes > maxBytesLimit * 2) {
                        // Avoid OutOfMemoryError for extremely huge files
                        return null
                    }
                    buffer.write(data, 0, count)
                }
                buffer.toByteArray()
            }
        } catch (e: Exception) {
            null
        }
    }

    /**
     * Compresses bitmap to JPEG / WEBP with optimal quality (85%) and bounds scaling
     */
    fun compressBitmap(
        imageBytes: ByteArray,
        maxDimension: Int = 1920,
        quality: Int = 85
    ): ByteArray {
        return try {
            val options = BitmapFactory.Options().apply {
                inJustDecodeBounds = true
            }
            BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size, options)

            var sampleSize = 1
            while (options.outWidth / sampleSize > maxDimension || options.outHeight / sampleSize > maxDimension) {
                sampleSize *= 2
            }

            val decodeOptions = BitmapFactory.Options().apply {
                inSampleSize = sampleSize
            }
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size, decodeOptions)
                ?: return imageBytes

            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outputStream)
            bitmap.recycle()
            outputStream.toByteArray()
        } catch (e: Exception) {
            imageBytes
        }
    }

    /**
     * Resolves standard file extension from MIME type
     */
    fun getExtensionFromMime(mimeType: String): String {
        return when (mimeType.lowercase(Locale.ROOT)) {
            "image/png" -> "png"
            "image/webp" -> "webp"
            "application/pdf" -> "pdf"
            else -> "jpg"
        }
    }
}
