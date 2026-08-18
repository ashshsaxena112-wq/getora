package com.getora.storage

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.MutableStateFlow
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
data class ShopPhotoUpdate(
    val logo_url: String? = null,
    val cover_image_url: String? = null,
    val shop_image_url: String? = null
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
        currentAvatarPath: String? = null
    ) {
        viewModelScope.launch {
            storageManager.uploadImageUri(
                context = context,
                uri = imageUri,
                bucket = GetoraStorageBucket.CUSTOMER_IMAGES,
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
                            supabase.postgrest["profiles"].update(
                                ProfilePhotoUpdate(profile_image_url = publicUrl)
                            ) {
                                filter { eq("id", userId) }
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
                            supabase.postgrest["product_images"].insert(
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
                            supabase.postgrest["delivery_partners"].update(
                                DeliveryDocumentUpdate(
                                    document_image_url = storagePath,
                                    document_storage_path = storagePath
                                )
                            ) {
                                filter { eq("id", riderUserId) }
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

    fun resetState() {
        _uiState.value = PhotoUploadUiState.Idle
    }
}
