package com.getora.storage

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable

/**
 * UI State for Photo Upload Workflow
 */
sealed interface PhotoUploadUiState {
    object Idle : PhotoUploadUiState
    data class Uploading(val progress: Float, val statusMessage: String) : PhotoUploadUiState
    data class Success(val uploadedUrl: String, val storagePath: String) : PhotoUploadUiState
    data class Error(val errorMessage: String, val errorType: StorageErrorType) : PhotoUploadUiState
}

@Serializable
data class ProfilePhotoUpdate(
    val profile_image_url: String
)

@Serializable
data class ProductImageInsert(
    val product_id: String,
    val storage_path: String,
    val image_url: String,
    val is_primary: Boolean = false,
    val sort_order: Int = 0
)

@Serializable
data class DeliveryDocumentUpdate(
    val document_image_url: String,
    val document_storage_path: String
)

enum class ShopImageType {
    LOGO, COVER, GENERAL
}

/**
 * StoragePhotoViewModel
 * Handles photo uploads and automatic database record updates for:
 * - Customer Avatar / Profile
 * - Retailer Shop Images
 * - Product Multi-Images (`product_images`)
 * - Delivery Partner ID / Documents
 */
class StoragePhotoViewModel(
    private val supabase: SupabaseClient,
    private val storageManager: GetoraStorageManager
) : ViewModel() {

    private val _uiState = MutableStateFlow<PhotoUploadUiState>(PhotoUploadUiState.Idle)
    val uiState: StateFlow<PhotoUploadUiState> = _uiState.asStateFlow()

    /**
     * Upload Customer / Retailer / Rider Avatar
     */
    fun uploadProfileAvatar(
        context: Context,
        imageUri: Uri,
        userId: String,
        bucket: GetoraStorageBucket = GetoraStorageBucket.CUSTOMER_IMAGES,
        currentAvatarPath: String? = null
    ) {
        viewModelScope.launch {
            storageManager.uploadImageUri(
                context = context,
                uri = imageUri,
                bucket = bucket,
                userId = userId
            ).collect { result ->
                when (result) {
                    is StorageResult.Loading -> {
                        _uiState.value = PhotoUploadUiState.Uploading(result.progress, result.message)
                    }
                    is StorageResult.Error -> {
                        _uiState.value = PhotoUploadUiState.Error(result.message, result.error)
                    }
                    is StorageResult.Success -> {
                        val publicUrl = result.data.publicUrl ?: ""
                        // Update public.profiles table
                        try {
                            supabase.from("profiles").update(
                                ProfilePhotoUpdate(profile_image_url = publicUrl)
                            ) {
                                filter {
                                    eq("id", userId)
                                }
                            }

                            // Clean up old avatar if replacement successful
                            currentAvatarPath?.let { oldPath ->
                                if (oldPath.isNotEmpty() && oldPath != result.data.storagePath) {
                                    storageManager.deleteImage(bucket, oldPath).collect {}
                                }
                            }

                            _uiState.value = PhotoUploadUiState.Success(publicUrl, result.data.storagePath)
                        } catch (e: Exception) {
                            _uiState.value = PhotoUploadUiState.Error(
                                "Image uploaded but database update failed: ${e.localizedMessage}",
                                StorageErrorType.ServerError
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     * Upload and update Retailer Shop images (Logo/Cover)
     */
    fun uploadShopImage(
        context: Context,
        imageUri: Uri,
        userId: String,
        retailerId: String,
        imageType: ShopImageType,
        currentImagePath: String? = null
    ) {
        viewModelScope.launch {
            val bucket = GetoraStorageBucket.SHOP_IMAGES
            storageManager.uploadImageUri(
                context = context,
                uri = imageUri,
                bucket = bucket,
                userId = userId
            ).collect { result ->
                when (result) {
                    is StorageResult.Loading -> {
                        _uiState.value = PhotoUploadUiState.Uploading(result.progress, result.message)
                    }
                    is StorageResult.Error -> {
                        _uiState.value = PhotoUploadUiState.Error(result.message, result.error)
                    }
                    is StorageResult.Success -> {
                        val publicUrl = result.data.publicUrl ?: ""
                        try {
                            // Use buildJsonObject for partial updates to avoid nulling other fields
                            val updateData = buildJsonObject {
                                when (imageType) {
                                    ShopImageType.LOGO -> {
                                        put("logo_url", publicUrl)
                                        put("logo_storage_path", result.data.storagePath)
                                    }
                                    ShopImageType.COVER -> {
                                        put("cover_image_url", publicUrl)
                                        put("cover_storage_path", result.data.storagePath)
                                    }
                                    ShopImageType.GENERAL -> {
                                        put("shop_image_url", publicUrl)
                                        put("shop_image_storage_path", result.data.storagePath)
                                    }
                                }
                            }

                            supabase.from("retailers").update(updateData) {
                                filter {
                                    eq("id", retailerId)
                                }
                            }

                            // Clean up old image if replacement successful
                            currentImagePath?.let { oldPath ->
                                if (oldPath.isNotEmpty() && oldPath != result.data.storagePath) {
                                    storageManager.deleteImage(bucket, oldPath).collect {}
                                }
                            }

                            _uiState.value = PhotoUploadUiState.Success(publicUrl, result.data.storagePath)
                        } catch (e: Exception) {
                            _uiState.value = PhotoUploadUiState.Error(
                                "Database update failed: ${e.localizedMessage}",
                                StorageErrorType.ServerError
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     * Upload and attach product image to public.product_images
     */
    fun uploadProductImage(
        context: Context,
        imageUri: Uri,
        userId: String,
        productId: String,
        isPrimary: Boolean = false,
        sortOrder: Int = 0
    ) {
        viewModelScope.launch {
            storageManager.uploadImageUri(
                context = context,
                uri = imageUri,
                bucket = GetoraStorageBucket.PRODUCT_IMAGES,
                userId = userId
            ).collect { result ->
                when (result) {
                    is StorageResult.Loading -> {
                        _uiState.value = PhotoUploadUiState.Uploading(result.progress, result.message)
                    }
                    is StorageResult.Error -> {
                        _uiState.value = PhotoUploadUiState.Error(result.message, result.error)
                    }
                    is StorageResult.Success -> {
                        val publicUrl = result.data.publicUrl ?: ""
                        try {
                            // Insert into public.product_images table
                            supabase.from("product_images").insert(
                                ProductImageInsert(
                                    product_id = productId,
                                    storage_path = result.data.storagePath,
                                    image_url = publicUrl,
                                    is_primary = isPrimary,
                                    sort_order = sortOrder
                                )
                            )
                            _uiState.value = PhotoUploadUiState.Success(publicUrl, result.data.storagePath)
                        } catch (e: Exception) {
                            _uiState.value = PhotoUploadUiState.Error(
                                "Database record insert failed: ${e.localizedMessage}",
                                StorageErrorType.ServerError
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     * Upload confidential Delivery Partner Verification Document (License / Aadhaar / RC)
     */
    fun uploadDeliveryDocument(
        context: Context,
        documentUri: Uri,
        riderUserId: String
    ) {
        viewModelScope.launch {
            storageManager.uploadImageUri(
                context = context,
                uri = documentUri,
                bucket = GetoraStorageBucket.DELIVERY_DOCUMENTS,
                userId = riderUserId,
                compress = false // Preserve document legibility
            ).collect { result ->
                when (result) {
                    is StorageResult.Loading -> {
                        _uiState.value = PhotoUploadUiState.Uploading(result.progress, result.message)
                    }
                    is StorageResult.Error -> {
                        _uiState.value = PhotoUploadUiState.Error(result.message, result.error)
                    }
                    is StorageResult.Success -> {
                        val storagePath = result.data.storagePath
                        try {
                            supabase.from("delivery_partners").update(
                                DeliveryDocumentUpdate(
                                    document_image_url = storagePath,
                                    document_storage_path = storagePath
                                )
                            ) {
                                filter {
                                    eq("id", riderUserId)
                                }
                            }
                            _uiState.value = PhotoUploadUiState.Success(storagePath, storagePath)
                        } catch (e: Exception) {
                            _uiState.value = PhotoUploadUiState.Error(
                                "Failed to update delivery partner document record: ${e.localizedMessage}",
                                StorageErrorType.ServerError
                            )
                        }
                    }
                }
            }
        }
    }

    /**
     * Upload Multiple Product Images at once (Sequential for stability)
     */
    fun uploadMultipleProductImages(
        context: Context,
        uris: List<Uri>,
        userId: String,
        productId: String
    ) {
        viewModelScope.launch {
            var processedCount = 0
            val total = uris.size

            uris.forEachIndexed { index, uri ->
                storageManager.uploadImageUri(
                    context = context,
                    uri = uri,
                    bucket = GetoraStorageBucket.PRODUCT_IMAGES,
                    userId = userId
                ).collect { result ->
                    when (result) {
                        is StorageResult.Loading -> {
                            _uiState.value = PhotoUploadUiState.Uploading(
                                progress = (processedCount.toFloat() / total) + (result.progress / total),
                                statusMessage = "Uploading image ${index + 1} of $total..."
                            )
                        }
                        is StorageResult.Success -> {
                            try {
                                supabase.from("product_images").insert(
                                    ProductImageInsert(
                                        product_id = productId,
                                        storage_path = result.data.storagePath,
                                        image_url = result.data.publicUrl ?: "",
                                        sort_order = index
                                    )
                                )
                            } catch (e: Exception) {
                                // Log and continue
                            } finally {
                                processedCount++
                            }
                        }
                        is StorageResult.Error -> {
                            processedCount++
                            // If all failed or finished
                        }
                        else -> Unit
                    }

                    if (processedCount == total) {
                        _uiState.value = PhotoUploadUiState.Idle
                    }
                }
            }
        }
    }

    /**
     * Delete a product image from both Storage and Database
     */
    fun deleteProductImage(
        productId: String,
        storagePath: String,
        imageId: String
    ) {
        viewModelScope.launch {
            _uiState.value = PhotoUploadUiState.Uploading(0.5f, "Deleting image...")
            storageManager.deleteImage(GetoraStorageBucket.PRODUCT_IMAGES, storagePath).collect { result ->
                if (result is StorageResult.Success) {
                    try {
                        supabase.from("product_images").delete {
                            filter {
                                eq("id", imageId)
                                eq("product_id", productId)
                            }
                        }
                        _uiState.value = PhotoUploadUiState.Idle
                    } catch (e: Exception) {
                        _uiState.value = PhotoUploadUiState.Error("DB update failed", StorageErrorType.ServerError)
                    }
                } else if (result is StorageResult.Error) {
                    _uiState.value = PhotoUploadUiState.Error(result.message, result.error)
                }
            }
        }
    }

    /**
     * Delete profile image and reset URL in database
     */
    fun deleteProfileImage(userId: String, storagePath: String) {
        viewModelScope.launch {
            storageManager.deleteImage(GetoraStorageBucket.CUSTOMER_IMAGES, storagePath).collect { result ->
                if (result is StorageResult.Success) {
                    try {
                        supabase.from("profiles").update(buildJsonObject { put("profile_image_url", "") }) {
                            filter {
                                eq("id", userId)
                            }
                        }
                        _uiState.value = PhotoUploadUiState.Idle
                    } catch (e: Exception) {}
                }
            }
        }
    }

    /**
     * Delete shop image (Logo or Cover) and reset URL in database
     */
    fun deleteShopImage(retailerId: String, storagePath: String, imageType: ShopImageType) {
        viewModelScope.launch {
            storageManager.deleteImage(GetoraStorageBucket.SHOP_IMAGES, storagePath).collect { result ->
                if (result is StorageResult.Success) {
                    try {
                        val field = if (imageType == ShopImageType.LOGO) "logo_url" else "cover_image_url"
                        val storageField = if (imageType == ShopImageType.LOGO) "logo_storage_path" else "cover_storage_path"

                        supabase.from("retailers").update(buildJsonObject {
                            put(field, "")
                            put(storageField, "")
                        }) {
                            filter {
                                eq("id", retailerId)
                            }
                        }
                        _uiState.value = PhotoUploadUiState.Idle
                    } catch (e: Exception) {}
                }
            }
        }
    }

    fun resetState() {
        _uiState.value = PhotoUploadUiState.Idle
    }

    companion object {
        fun provideFactory(
            supabase: SupabaseClient,
            storageManager: GetoraStorageManager
        ): androidx.lifecycle.ViewModelProvider.Factory = object : androidx.lifecycle.ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                return StoragePhotoViewModel(supabase, storageManager) as T
            }
        }
    }
}

