package com.getora.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.screens.account.AccountScreen
import com.getora.app.ui.screens.cart.CartScreen
import com.getora.app.ui.screens.checkout.CheckoutScreen
import com.getora.app.ui.screens.delivery.DeliveryPartnerScreen
import com.getora.app.ui.screens.home.HomeScreen
import com.getora.app.ui.screens.retailer.RetailerDashboardScreen
import com.getora.app.ui.screens.search.SearchScreen
import com.getora.app.ui.screens.tracking.LiveTrackingScreen
import com.getora.app.ui.theme.GetoraPrimaryGreen

@Composable
fun GetoraNavGraph(
    navController: NavHostController,
    repository: GetoraRepository = GetoraRepository.instance
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val bottomBarRoutes = listOf(
        Screen.Home.route,
        Screen.Search.route,
        Screen.Cart.route,
        Screen.Account.route
    )

    Scaffold(
        bottomBar = {
            if (currentRoute in bottomBarRoutes) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface
                ) {
                    NavigationBarItem(
                        selected = currentRoute == Screen.Home.route,
                        onClick = { navController.navigate(Screen.Home.route) },
                        icon = { Icon(if (currentRoute == Screen.Home.route) Icons.Filled.Home else Icons.Outlined.Home, contentDescription = "Home") },
                        label = { Text("Home") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = GetoraPrimaryGreen,
                            selectedTextColor = GetoraPrimaryGreen,
                            indicatorColor = GetoraPrimaryGreen.copy(alpha = 0.15f)
                        )
                    )
                    NavigationBarItem(
                        selected = currentRoute == Screen.Search.route,
                        onClick = { navController.navigate(Screen.Search.route) },
                        icon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                        label = { Text("Search") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = GetoraPrimaryGreen,
                            selectedTextColor = GetoraPrimaryGreen,
                            indicatorColor = GetoraPrimaryGreen.copy(alpha = 0.15f)
                        )
                    )
                    NavigationBarItem(
                        selected = currentRoute == Screen.Cart.route,
                        onClick = { navController.navigate(Screen.Cart.route) },
                        icon = { Icon(if (currentRoute == Screen.Cart.route) Icons.Filled.ShoppingBag else Icons.Outlined.ShoppingBag, contentDescription = "Cart") },
                        label = { Text("Cart") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = GetoraPrimaryGreen,
                            selectedTextColor = GetoraPrimaryGreen,
                            indicatorColor = GetoraPrimaryGreen.copy(alpha = 0.15f)
                        )
                    )
                    NavigationBarItem(
                        selected = currentRoute == Screen.Account.route,
                        onClick = { navController.navigate(Screen.Account.route) },
                        icon = { Icon(if (currentRoute == Screen.Account.route) Icons.Filled.Person else Icons.Outlined.Person, contentDescription = "Account") },
                        label = { Text("Account") },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = GetoraPrimaryGreen,
                            selectedTextColor = GetoraPrimaryGreen,
                            indicatorColor = GetoraPrimaryGreen.copy(alpha = 0.15f)
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    repository = repository,
                    onNavigateToProduct = { /* Product details */ },
                    onNavigateToStore = { /* Store details */ },
                    onNavigateToCategory = { navController.navigate(Screen.Search.route) },
                    onNavigateToSearch = { navController.navigate(Screen.Search.route) },
                    onNavigateToCart = { navController.navigate(Screen.Cart.route) }
                )
            }

            composable(Screen.Search.route) {
                SearchScreen(
                    repository = repository,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToProduct = { /* Product details */ }
                )
            }

            composable(Screen.Cart.route) {
                CartScreen(
                    repository = repository,
                    onNavigateBack = { navController.popBackStack() },
                    onProceedToCheckout = { navController.navigate(Screen.Checkout.route) }
                )
            }

            composable(Screen.Checkout.route) {
                CheckoutScreen(
                    repository = repository,
                    onNavigateBack = { navController.popBackStack() },
                    onOrderPlaced = { orderId ->
                        navController.navigate(Screen.LiveTracking.createRoute(orderId)) {
                            popUpTo(Screen.Home.route)
                        }
                    }
                )
            }

            composable(Screen.LiveTracking.route) { backStackEntry ->
                val orderId = backStackEntry.arguments?.getString("orderId") ?: ""
                LiveTrackingScreen(
                    orderId = orderId,
                    repository = repository,
                    onNavigateHome = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Home.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Account.route) {
                AccountScreen(
                    repository = repository,
                    onNavigateToRetailer = { navController.navigate(Screen.RetailerDashboard.route) },
                    onNavigateToDelivery = { navController.navigate(Screen.DeliveryDashboard.route) },
                    onNavigateToOrders = { navController.navigate(Screen.Cart.route) }
                )
            }

            composable(Screen.RetailerDashboard.route) {
                RetailerDashboardScreen(
                    repository = repository,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(Screen.DeliveryDashboard.route) {
                DeliveryPartnerScreen(
                    repository = repository,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
