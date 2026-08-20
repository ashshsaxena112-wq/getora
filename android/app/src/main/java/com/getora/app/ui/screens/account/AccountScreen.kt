package com.getora.app.ui.screens.account

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.theme.GetoraPrimaryGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AccountScreen(
    repository: GetoraRepository,
    onNavigateToRetailer: () -> Unit,
    onNavigateToDelivery: () -> Unit,
    onNavigateToOrders: () -> Unit
) {
    val user by repository.currentUser.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Account", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Profile Card
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp)),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(GetoraPrimaryGreen),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("AS", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(user?.fullName ?: "Ashish Saxena", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(user?.phone ?: "+91 98971 23456", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("Agra, Uttar Pradesh", fontSize = 11.sp, color = GetoraPrimaryGreen)
                        }
                    }
                }
            }

            // Quick Navigation Items
            item {
                Text("Account & Orders", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }

            item {
                AccountActionRow(
                    icon = Icons.Default.ShoppingBag,
                    title = "Your Orders & History",
                    subtitle = "Track active orders and reorder items",
                    onClick = onNavigateToOrders
                )
            }

            item {
                AccountActionRow(
                    icon = Icons.Default.LocationOn,
                    title = "Saved Delivery Addresses",
                    subtitle = "Home, Office & custom locations",
                    onClick = {}
                )
            }

            // Partner Portals
            item {
                Text("Partner Portals", fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.padding(top = 10.dp))
            }

            item {
                AccountActionRow(
                    icon = Icons.Default.Storefront,
                    title = "Retailer Store Portal",
                    subtitle = "1-Click Master Product Catalog & Orders",
                    highlight = true,
                    onClick = onNavigateToRetailer
                )
            }

            item {
                AccountActionRow(
                    icon = Icons.Default.TwoWheeler,
                    title = "Delivery Partner Dashboard",
                    subtitle = "Pickup & delivery tasks with GPS",
                    onClick = onNavigateToDelivery
                )
            }

            // App info & Help
            item {
                Text("Support & Info", fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.padding(top = 10.dp))
            }

            item {
                AccountActionRow(
                    icon = Icons.Default.Headphones,
                    title = "24/7 Customer Support",
                    subtitle = "Help with orders, delivery & payments",
                    onClick = {}
                )
            }

            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "GETORA v1.0.0 (Native Android) • Made with ❤️ in India",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
fun AccountActionRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    highlight: Boolean = false,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .border(
                1.dp,
                if (highlight) GetoraPrimaryGreen.copy(alpha = 0.5f) else MaterialTheme.colorScheme.outline,
                RoundedCornerShape(12.dp)
            )
            .clickable { onClick() },
        color = if (highlight) GetoraPrimaryGreen.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = if (highlight) GetoraPrimaryGreen else MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 13.5.sp, color = MaterialTheme.colorScheme.onSurface)
                    Text(subtitle, fontSize = 11.5.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Icon(Icons.Default.ChevronRight, contentDescription = "Open", tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
