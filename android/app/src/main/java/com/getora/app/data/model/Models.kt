package com.getora.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Category(
    val id: String,
    val name: String,
    val slug: String? = null,
    val icon: String? = null,
    @SerialName("image_url") val imageUrl: String? = null,
    @SerialName("sort_order") val sortOrder: Int = 0
)

@Serializable
data class Product(
    val id: String,
    val name: String,
    val brand: String? = null,
    @SerialName("category_id") val categoryId: String? = null,
    @SerialName("category_name") val categoryName: String? = null,
    @SerialName("retailer_id") val retailerId: String? = null,
    @SerialName("store_id") val storeId: String? = null,
    @SerialName("store_name") val storeName: String? = null,
    @SerialName("master_product_id") val masterProductId: String? = null,
    val description: String? = null,
    val price: Double,
    @SerialName("selling_price") val sellingPrice: Double,
    @SerialName("stock_quantity") val stockQuantity: Int = 0,
    val unit: String = "1 pc",
    @SerialName("image_url") val imageUrl: String? = null,
    @SerialName("is_available") val isAvailable: Boolean = true,
    val rating: Double = 4.8,
    @SerialName("review_count") val reviewCount: Int = 12
)

@Serializable
data class MasterProduct(
    val id: String,
    val name: String,
    val brand: String,
    @SerialName("category_id") val categoryId: String,
    @SerialName("category_name") val categoryName: String,
    val description: String = "",
    @SerialName("suggested_price") val suggestedPrice: Double,
    @SerialName("suggested_selling_price") val suggestedSellingPrice: Double,
    val unit: String = "1 pc",
    @SerialName("image_url") val imageUrl: String,
    val sku: String? = null,
    @SerialName("is_popular") val isPopular: Boolean = false
)

@Serializable
data class Store(
    val id: String,
    @SerialName("shop_name") val shopName: String,
    @SerialName("owner_name") val ownerName: String = "",
    val phone: String? = null,
    val address: String = "",
    val city: String = "Agra",
    val rating: Double = 4.8,
    @SerialName("total_ratings") val totalRatings: Int = 89,
    @SerialName("is_open") val isOpen: Boolean = true,
    @SerialName("delivery_time") val deliveryTime: String = "15-25 mins",
    val distance: String = "1.2 km",
    @SerialName("image_url") val imageUrl: String? = null,
    val categories: List<String> = emptyList()
)

@Serializable
data class CartItem(
    val product: Product,
    var quantity: Int = 1,
    @SerialName("retailer_id") val retailerId: String,
    @SerialName("store_name") val storeName: String
) {
    val totalPrice: Double get() = product.sellingPrice * quantity
}

@Serializable
data class Address(
    val id: String,
    val type: String = "Home", // Home, Work, Other
    @SerialName("receiver_name") val receiverName: String,
    val phone: String,
    @SerialName("address_line") val addressLine: String,
    val city: String = "Agra",
    val pincode: String = "282001",
    @SerialName("is_default") val isDefault: Boolean = false
)

@Serializable
data class OrderItem(
    val id: String = "",
    @SerialName("product_id") val productId: String,
    @SerialName("product_name") val productName: String,
    val quantity: Int,
    @SerialName("unit_price") val unitPrice: Double,
    @SerialName("total_price") val totalPrice: Double,
    @SerialName("image_url") val imageUrl: String? = null
)

@Serializable
data class Order(
    val id: String,
    @SerialName("order_number") val orderNumber: String,
    @SerialName("store_name") val storeName: String,
    @SerialName("retailer_id") val retailerId: String,
    val items: List<OrderItem>,
    val subtotal: Double,
    @SerialName("delivery_fee") val deliveryFee: Double = 25.0,
    val discount: Double = 0.0,
    @SerialName("total_amount") val totalAmount: Double,
    @SerialName("payment_method") val paymentMethod: String = "COD",
    @SerialName("payment_status") val paymentStatus: String = "pending",
    @SerialName("order_status") val orderStatus: String = "placed",
    @SerialName("placed_at") val placedAt: String,
    @SerialName("delivery_address") val deliveryAddress: Address,
    @SerialName("estimated_delivery") val estimatedDelivery: String = "20 mins",
    @SerialName("rider_name") val riderName: String? = "Rahul Sharma",
    @SerialName("rider_phone") val riderPhone: String? = "+91 98765 43210"
)

@Serializable
data class ProductRequest(
    val id: String,
    @SerialName("retailer_id") val retailerId: String,
    @SerialName("retailer_name") val retailerName: String = "",
    val name: String,
    val brand: String? = null,
    @SerialName("category_id") val categoryId: String,
    @SerialName("category_name") val categoryName: String? = null,
    @SerialName("expected_price") val expectedPrice: Double? = null,
    val unit: String = "1 pc",
    val notes: String? = null,
    val status: String = "pending", // pending, approved, rejected
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class UserProfile(
    val id: String,
    val fullName: String,
    val phone: String,
    val email: String? = null,
    val role: String = "customer" // customer, retailer, delivery, admin
)

@Serializable
data class Coupon(
    val code: String,
    val discountAmount: Double,
    val minOrderAmount: Double,
    val description: String
)
