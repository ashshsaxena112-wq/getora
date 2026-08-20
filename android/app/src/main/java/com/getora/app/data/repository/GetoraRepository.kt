package com.getora.app.data.repository

import com.getora.app.data.local.MasterCatalogSeed
import com.getora.app.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.text.SimpleDateFormat
import java.util.*

class GetoraRepository {

    // 1. Catalog States
    private val _categories = MutableStateFlow<List<Category>>(MasterCatalogSeed.categories)
    val categories: StateFlow<List<Category>> = _categories.asStateFlow()

    private val _stores = MutableStateFlow<List<Store>>(MasterCatalogSeed.stores)
    val stores: StateFlow<List<Store>> = _stores.asStateFlow()

    private val _products = MutableStateFlow<List<Product>>(MasterCatalogSeed.sampleProducts)
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    private val _masterCatalog = MutableStateFlow<List<MasterProduct>>(MasterCatalogSeed.masterProducts)
    val masterCatalog: StateFlow<List<MasterProduct>> = _masterCatalog.asStateFlow()

    private val _productRequests = MutableStateFlow<List<ProductRequest>>(emptyList())
    val productRequests: StateFlow<List<ProductRequest>> = _productRequests.asStateFlow()

    // 2. Cart State
    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    private val _appliedCoupon = MutableStateFlow<Coupon?>(null)
    val appliedCoupon: StateFlow<Coupon?> = _appliedCoupon.asStateFlow()

    // 3. User & Location State
    private val _currentCity = MutableStateFlow("Agra, Uttar Pradesh")
    val currentCity: StateFlow<String> = _currentCity.asStateFlow()

    private val _savedAddresses = MutableStateFlow<List<Address>>(
        listOf(
            Address(
                id = "addr-1",
                type = "Home",
                receiverName = "Ashish Saxena",
                phone = "+91 98971 23456",
                addressLine = "Flat 402, Green Valley Apartments, Dayal Bagh",
                city = "Agra",
                pincode = "282005",
                isDefault = true
            ),
            Address(
                id = "addr-2",
                type = "Office",
                receiverName = "Ashish Saxena",
                phone = "+91 98971 23456",
                addressLine = "Tech Tower, Block B, Sanjay Place",
                city = "Agra",
                pincode = "282002",
                isDefault = false
            )
        )
    )
    val savedAddresses: StateFlow<List<Address>> = _savedAddresses.asStateFlow()

    private val _selectedAddress = MutableStateFlow<Address?>(_savedAddresses.value.firstOrNull())
    val selectedAddress: StateFlow<Address?> = _selectedAddress.asStateFlow()

    // 4. Orders State
    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()

    // 5. Auth State
    private val _currentUser = MutableStateFlow<UserProfile?>(
        UserProfile(
            id = "user-101",
            fullName = "Ashish Saxena",
            phone = "+91 98971 23456",
            email = "ashish@getora.in",
            role = "customer"
        )
    )
    val currentUser: StateFlow<UserProfile?> = _currentUser.asStateFlow()

    // --- CART METHODS ---

    fun addToCart(product: Product) {
        _cartItems.update { current ->
            val existing = current.find { it.product.id == product.id }
            if (existing != null) {
                current.map {
                    if (it.product.id == product.id) it.copy(quantity = it.quantity + 1) else it
                }
            } else {
                current + CartItem(
                    product = product,
                    quantity = 1,
                    retailerId = product.retailerId ?: "store-voltix",
                    storeName = product.storeName ?: "Voltix Electricals"
                )
            }
        }
    }

    fun updateCartQuantity(productId: String, delta: Int) {
        _cartItems.update { current ->
            current.mapNotNull { item ->
                if (item.product.id == productId) {
                    val newQty = item.quantity + delta
                    if (newQty > 0) item.copy(quantity = newQty) else null
                } else {
                    item
                }
            }
        }
    }

    fun removeFromCart(productId: String) {
        _cartItems.update { current ->
            current.filterNot { it.product.id == productId }
        }
    }

    fun clearCart() {
        _cartItems.value = emptyList()
        _appliedCoupon.value = null
    }

    fun applyCoupon(code: String): Boolean {
        return if (code.trim().uppercase() == "GETORA100") {
            _appliedCoupon.value = Coupon(
                code = "GETORA100",
                discountAmount = 100.0,
                minOrderAmount = 299.0,
                description = "Flat ₹100 OFF on your local order"
            )
            true
        } else {
            false
        }
    }

    fun removeCoupon() {
        _appliedCoupon.value = null
    }

    fun getCartSubtotal(): Double {
        return _cartItems.value.sumOf { it.totalPrice }
    }

    fun getCartTotal(): Double {
        val subtotal = getCartSubtotal()
        if (subtotal == 0.0) return 0.0
        val deliveryFee = 25.0
        val discount = _appliedCoupon.value?.let {
            if (subtotal >= it.minOrderAmount) it.discountAmount else 0.0
        } ?: 0.0
        return (subtotal + deliveryFee - discount).coerceAtLeast(0.0)
    }

    // --- CHECKOUT & ORDER METHODS ---

    fun placeOrder(paymentMethod: String = "COD"): Order? {
        val items = _cartItems.value
        if (items.isEmpty()) return null

        val address = _selectedAddress.value ?: _savedAddresses.value.first()
        val subtotal = getCartSubtotal()
        val discount = _appliedCoupon.value?.discountAmount ?: 0.0
        val total = getCartTotal()

        val newOrder = Order(
            id = "ord-${System.currentTimeMillis()}",
            orderNumber = "GET-${(100000..999999).random()}",
            storeName = items.first().storeName,
            retailerId = items.first().retailerId,
            items = items.map {
                OrderItem(
                    productId = it.product.id,
                    productName = it.product.name,
                    quantity = it.quantity,
                    unitPrice = it.product.sellingPrice,
                    totalPrice = it.totalPrice,
                    imageUrl = it.product.imageUrl
                )
            },
            subtotal = subtotal,
            deliveryFee = 25.0,
            discount = discount,
            totalAmount = total,
            paymentMethod = paymentMethod,
            paymentStatus = if (paymentMethod == "UPI") "paid" else "pending",
            orderStatus = "placed",
            placedAt = SimpleDateFormat("hh:mm a, dd MMM yyyy", Locale.getDefault()).format(Date()),
            deliveryAddress = address
        )

        _orders.update { listOf(newOrder) + it }
        clearCart()
        return newOrder
    }

    // --- RETAILER 1-CLICK MASTER CATALOG METHODS ---

    fun addMasterProductToShop(
        masterProduct: MasterProduct,
        sellingPrice: Double,
        mrp: Double,
        stock: Int,
        retailerId: String = "store-voltix",
        storeName: String = "Voltix Electricals & Hardware"
    ): Boolean {
        val existing = _products.value.find {
            it.retailerId == retailerId &&
                    (it.masterProductId == masterProduct.id || it.name.equals(masterProduct.name, ignoreCase = true))
        }

        if (existing != null) {
            // Update existing (Duplicate prevention)
            _products.update { current ->
                current.map {
                    if (it.id == existing.id) {
                        it.copy(sellingPrice = sellingPrice, price = mrp, stockQuantity = stock, isAvailable = true)
                    } else it
                }
            }
            return true
        }

        // Add new shop product
        val newShopProduct = Product(
            id = "prod-${System.currentTimeMillis()}",
            name = masterProduct.name,
            brand = masterProduct.brand,
            categoryId = masterProduct.categoryId,
            categoryName = masterProduct.categoryName,
            retailerId = retailerId,
            storeName = storeName,
            masterProductId = masterProduct.id,
            description = masterProduct.description,
            price = mrp,
            sellingPrice = sellingPrice,
            stockQuantity = stock,
            unit = masterProduct.unit,
            imageUrl = masterProduct.imageUrl,
            isAvailable = true
        )

        _products.update { listOf(newShopProduct) + it }
        return true
    }

    fun requestNewProduct(
        name: String,
        brand: String?,
        categoryId: String,
        categoryName: String,
        expectedPrice: Double?,
        unit: String,
        notes: String?,
        retailerId: String = "store-voltix"
    ) {
        val newReq = ProductRequest(
            id = "req-${System.currentTimeMillis()}",
            retailerId = retailerId,
            retailerName = "Voltix Electricals",
            name = name,
            brand = brand,
            categoryId = categoryId,
            categoryName = categoryName,
            expectedPrice = expectedPrice,
            unit = unit,
            notes = notes,
            status = "pending",
            createdAt = SimpleDateFormat("dd MMM yyyy", Locale.getDefault()).format(Date())
        )
        _productRequests.update { listOf(newReq) + it }
    }

    fun setLocation(city: String) {
        _currentCity.value = city
    }

    fun setSelectedAddress(address: Address) {
        _selectedAddress.value = address
    }

    companion object {
        val instance by lazy { GetoraRepository() }
    }
}
