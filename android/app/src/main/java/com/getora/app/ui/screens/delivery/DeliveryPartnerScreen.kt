package com.getora.app.ui.screens.delivery

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.theme.GetoraPrimaryGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeliveryPartnerScreen(
    repository: GetoraRepository,
    onNavigateBack: () -> Unit
) {
    val orders by repository.orders.collectAsState()
    var isOnline by remember { mutableStateOf(true) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Delivery Partner Portal", fontWeight = FontWeight.Bold) },
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
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Status & Availability Switch Card
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
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(10.dp)
                                        .clip(RoundedCornerShape(50))
                                        .background(if (isOnline) GetoraPrimaryGreen else Color.Red)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = if (isOnline) "ONLINE & READY FOR ORDERS" else "OFFLINE",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (isOnline) GetoraPrimaryGreen else Color.Red
                                )
                            }
                            Text("Rahul Sharma • Agra Zone", fontSize = 14.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 2.dp))
                            Text("Active GPS Tracking: Active", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }

                        Switch(
                            checked = isOnline,
                            onCheckedChange = { isOnline = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = GetoraPrimaryGreen)
                        )
                    }
                }
            }

            // Active Trips / Assigned Tasks
            item {
                Text("Assigned Delivery Tasks", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }

            if (orders.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.TwoWheeler, contentDescription = "No tasks", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("No active delivery assignments", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                        }
                    }
                }
            } else {
                items(orders) { ord ->
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(14.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(ord.orderNumber, fontWeight = FontWeight.ExtraBold, fontSize = 15.sp, color = GetoraPrimaryGreen)
                                Text("₹${ord.totalAmount.toInt()} (${ord.paymentMethod})", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("📍 Pickup: ${ord.storeName}", fontSize = 12.5.sp, fontWeight = FontWeight.SemiBold)
                            Text("🏠 Drop: ${ord.deliveryAddress.addressLine}, ${ord.deliveryAddress.city}", fontSize = 12.5.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(modifier = Modifier.height(12.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = {},
                                    colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen),
                                    shape = RoundedCornerShape(50),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("✓ Mark Picked Up", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                                Button(
                                    onClick = {},
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant, contentColor = MaterialTheme.colorScheme.onSurface),
                                    shape = RoundedCornerShape(50),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("🗺️ Navigate", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
