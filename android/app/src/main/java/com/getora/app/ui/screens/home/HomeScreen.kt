package com.getora.app.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.getora.app.data.model.Product
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.components.*
import com.getora.app.ui.theme.*

@Composable
fun HomeScreen(
    repository: GetoraRepository,
    onNavigateToProduct: (String) -> Unit,
    onNavigateToStore: (String) -> Unit,
    onNavigateToCategory: (String) -> Unit,
    onNavigateToSearch: () -> Unit,
    onNavigateToCart: () -> Unit
) {
    val categories by repository.categories.collectAsState()
    val stores by repository.stores.collectAsState()
    val products by repository.products.collectAsState()
    val cartItems by repository.cartItems.collectAsState()
    val currentCity by repository.currentCity.collectAsState()

    var selectedCategoryId by remember { mutableStateOf("all") }

    Scaffold(
        topBar = {
            GetoraTopBar(
                currentLocation = currentCity,
                cartCount = cartItems.sumOf { it.quantity },
                onLocationClick = { /* Opens city picker */ },
                onCartClick = onNavigateToCart,
                onSearchClick = onNavigateToSearch
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            // 1. HERO BANNER WITH SEARCH
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    Color(0xFF0F3D22),
                                    Color(0xFF14532D)
                                )
                            )
                        )
                        .border(1.dp, Color(0x3322C55E), RoundedCornerShape(16.dp))
                        .padding(20.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                color = GetoraPrimaryGreen,
                                shape = RoundedCornerShape(50),
                                modifier = Modifier.padding(end = 8.dp)
                            ) {
                                Text(
                                    text = "15-25 MIN DELIVERY",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.Black,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Get Anything Fast\nfrom Local Shops",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White,
                            lineHeight = 26.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Electrical, Hardware, Electronics & Daily Essentials delivered from trusted stores near you.",
                            fontSize = 12.sp,
                            color = Color(0xFFD1FAE5),
                            lineHeight = 16.sp
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        PillSearchBar(
                            query = "",
                            onQueryChange = {},
                            onClick = onNavigateToSearch,
                            placeholder = "Search 10,000+ local products…"
                        )
                    }
                }
            }

            // 2. QUICK CATEGORIES RAIL
            item {
                Column(modifier = Modifier.padding(vertical = 6.dp)) {
                    Text(
                        text = "Explore Categories",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                    )
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(categories) { cat ->
                            CategoryChip(
                                category = cat,
                                isSelected = selectedCategoryId == cat.id,
                                onClick = {
                                    selectedCategoryId = cat.id
                                    onNavigateToCategory(cat.id)
                                }
                            )
                        }
                    }
                }
            }

            // 3. FLASH DISCOUNT COUPON STRIP (GETORA100)
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, GetoraPrimaryGreen.copy(alpha = 0.4f), RoundedCornerShape(12.dp)),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.LocalOffer,
                                contentDescription = "Coupon",
                                tint = GetoraPrimaryGreen,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Flat ₹100 OFF on First 3 Orders",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = "Use code GETORA100 at checkout",
                                    fontSize = 11.sp,
                                    color = GetoraPrimaryGreen
                                )
                            }
                        }
                    }
                }
            }

            // 4. NEARBY LOCAL STORES
            item {
                Column(modifier = Modifier.padding(top = 10.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Nearby Local Stores",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "${stores.size} Open Near You",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = GetoraPrimaryGreen
                        )
                    }

                    Column(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        stores.forEach { store ->
                            StoreCard(
                                store = store,
                                onClick = { onNavigateToStore(store.id) }
                            )
                        }
                    }
                }
            }

            // 5. POPULAR PRODUCTS GRID
            item {
                Column(modifier = Modifier.padding(top = 20.dp)) {
                    Text(
                        text = "Popular Products Near You",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                    )

                    // 2-Column Responsive Grid Layout
                    val productList = products.filter {
                        selectedCategoryId == "all" || it.categoryId == selectedCategoryId
                    }
                    val chunked = productList.chunked(2)

                    Column(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        chunked.forEach { rowItems ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                rowItems.forEach { prod ->
                                    val inCart = cartItems.find { it.product.id == prod.id }?.quantity ?: 0
                                    Box(modifier = Modifier.weight(1f)) {
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
                                if (rowItems.size == 1) {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
