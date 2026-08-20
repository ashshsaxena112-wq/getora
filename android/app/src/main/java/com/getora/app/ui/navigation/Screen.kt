package com.getora.app.ui.navigation

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Search : Screen("search")
    object Categories : Screen("categories")
    object CategoryDetail : Screen("category/{categoryId}") {
        fun createRoute(categoryId: String) = "category/$categoryId"
    }
    object StoreDetail : Screen("store/{storeId}") {
        fun createRoute(storeId: String) = "store/$storeId"
    }
    object ProductDetail : Screen("product/{productId}") {
        fun createRoute(productId: String) = "product/$productId"
    }
    object Cart : Screen("cart")
    object Checkout : Screen("checkout")
    object Orders : Screen("orders")
    object LiveTracking : Screen("tracking/{orderId}") {
        fun createRoute(orderId: String) = "tracking/$orderId"
    }
    object RetailerDashboard : Screen("retailer")
    object DeliveryDashboard : Screen("delivery")
    object Account : Screen("account")
    object Support : Screen("support")
}
