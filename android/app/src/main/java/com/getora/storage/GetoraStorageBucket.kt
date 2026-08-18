package com.getora.storage

/**
 * GETORA Storage Buckets
 * Defines all Supabase Storage Buckets used in the GETORA multi-role marketplace.
 */
enum class GetoraStorageBucket(
    val bucketName: String,
    val isPublic: Boolean,
    val maxSizeBytes: Long,
    val allowedMimeTypes: Set<String>
) {
    CUSTOMER_IMAGES(
        bucketName = "customer-images",
        isPublic = true,
        maxSizeBytes = 5 * 1024 * 1024L, // 5 MB
        allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png", "image/webp")
    ),
    RETAILER_IMAGES(
        bucketName = "retailer-images",
        isPublic = true,
        maxSizeBytes = 5 * 1024 * 1024L, // 5 MB
        allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png", "image/webp")
    ),
    SHOP_IMAGES(
        bucketName = "shop-images",
        isPublic = true,
        maxSizeBytes = 10 * 1024 * 1024L, // 10 MB
        allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png", "image/webp")
    ),
    PRODUCT_IMAGES(
        bucketName = "product-images",
        isPublic = true,
        maxSizeBytes = 10 * 1024 * 1024L, // 10 MB
        allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png", "image/webp")
    ),
    DELIVERY_PARTNER_IMAGES(
        bucketName = "delivery-partner-images",
        isPublic = true,
        maxSizeBytes = 5 * 1024 * 1024L, // 5 MB
        allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png", "image/webp")
    ),
    DELIVERY_DOCUMENTS(
        bucketName = "delivery-documents",
        isPublic = false, // Strictly Private: Requires signed URLs or Authenticated Owner/Admin RLS
        maxSizeBytes = 10 * 1024 * 1024L, // 10 MB
        allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf")
    );

    companion object {
        fun fromBucketName(name: String): GetoraStorageBucket? {
            return values().firstOrNull { it.bucketName == name }
        }
    }
}
