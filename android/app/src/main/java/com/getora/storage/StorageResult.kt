package com.getora.storage

/**
 * Storage Result & State Model
 * Encapsulates success, progress, and granular error categories for UI rendering and error handling.
 */
sealed interface StorageResult<out T> {

    /**
     * Upload or operation in progress
     * @param progress Normalized progress between 0.0f and 1.0f
     */
    data class Loading(val progress: Float = 0f, val message: String = "Uploading...") : StorageResult<Nothing>

    /**
     * Operation succeeded
     * @param data Result payload
     */
    data class Success<out T>(val data: T) : StorageResult<T>

    /**
     * Operation failed
     * @param error Specific error type
     * @param message User-friendly error message
     * @param throwable Original exception if available
     */
    data class Error(
        val error: StorageErrorType,
        val message: String,
        val throwable: Throwable? = null
    ) : StorageResult<Nothing>
}

/**
 * Standard Storage Upload Response
 */
data class StorageUploadResponse(
    val bucket: GetoraStorageBucket,
    val storagePath: String,
    val publicUrl: String?,
    val fileSizeBytes: Long,
    val mimeType: String
)

/**
 * Categorized Storage Errors
 */
sealed interface StorageErrorType {
    object NetworkFailure : StorageErrorType
    object InvalidFileType : StorageErrorType
    object FileTooLarge : StorageErrorType
    object PermissionDenied : StorageErrorType
    object AuthenticationFailure : StorageErrorType
    object FileNotFound : StorageErrorType
    object UploadFailure : StorageErrorType
    object ServerError : StorageErrorType
    data class Unknown(val rawMessage: String) : StorageErrorType
}
