package com.getora.app.ui.screens.search

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.components.PillSearchBar
import com.getora.app.ui.components.ProductCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    repository: GetoraRepository,
    onNavigateBack: () -> Unit,
    onNavigateToProduct: (String) -> Unit
) {
    val products by repository.products.collectAsState()
    val cartItems by repository.cartItems.collectAsState()
    var searchQuery by remember { mutableStateOf("") }

    val filteredProducts = remember(searchQuery, products) {
        if (searchQuery.isBlank()) emptyList()
        else products.filter {
            it.name.contains(searchQuery, ignoreCase = true) ||
                    it.brand?.contains(searchQuery, ignoreCase = true) == true ||
                    it.categoryName?.contains(searchQuery, ignoreCase = true) == true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    PillSearchBar(
                        query = searchQuery,
                        onQueryChange = { searchQuery = it },
                        placeholder = "Search products, brands, or shops…"
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        if (searchQuery.isBlank()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(56.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text("Search 10,000+ local products", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    Text("Type Philips bulb, Havells wire, Bosch drill, boAt…", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        } else if (filteredProducts.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text("No products found for \"$searchQuery\"", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredProducts) { prod ->
                    val inCart = cartItems.find { it.product.id == prod.id }?.quantity ?: 0
                    ProductCard(
                        product = prod,
                        inCartQuantity = inCart,
                        onAddToCart = { repository.addToCart(prod) },
                        onIncrement = { repository.updateCartQuantity(prod.id, 1) },
                        onDecrement = { repository.updateCartQuantity(prod.id, -1) },
                        onClick = { onNavigateToProduct(prod.id) }
                    )
                }
            }
        }
    }
}
