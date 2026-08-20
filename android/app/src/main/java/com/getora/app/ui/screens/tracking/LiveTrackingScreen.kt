package com.getora.app.ui.screens.tracking

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.theme.GetoraPrimaryGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LiveTrackingScreen(
    orderId: String,
    repository: GetoraRepository,
    onNavigateHome: () -> Unit
) {
    val orders by repository.orders.collectAsState()
    val order = orders.find { it.id == orderId } ?: orders.firstOrNull()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Live Order Tracking", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateHome) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Home")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        if (order == null) {
            Box(modifier = Modifier.fillMaxSize().padding(paddingValues), contentAlignment = Alignment.Center) {
                Text("Order not found")
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // 1. Order Status Header
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .border(1.dp, GetoraPrimaryGreen.copy(alpha = 0.3f), RoundedCornerShape(16.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(order.orderNumber, fontWeight = FontWeight.ExtraBold, fontSize = 17.sp, color = GetoraPrimaryGreen)
                                    Text(order.placedAt, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                Surface(
                                    color = GetoraPrimaryGreen.copy(alpha = 0.15f),
                                    shape = RoundedCornerShape(50)
                                ) {
                                    Text(
                                        text = "⚡ ARRIVING IN ${order.estimatedDelivery.uppercase()}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = GetoraPrimaryGreen,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // 2. Dispatch Pipeline Timeline
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Text("Delivery Progress", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(16.dp))

                            TrackingStepItem("Order Placed & Confirmed", "Sent to ${order.storeName}", isCompleted = true, isCurrent = false)
                            TrackingStepItem("Store Packing Items", "Preparing for rider pickup", isCompleted = true, isCurrent = true)
                            TrackingStepItem("Rider Out for Delivery", "Assigned: ${order.riderName}", isCompleted = false, isCurrent = false)
                            TrackingStepItem("Delivered to Doorstep", "OTP verified delivery", isCompleted = false, isCurrent = false, isLast = true)
                        }
                    }
                }

                // 3. Driver & Store Contact Card
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
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(44.dp)
                                        .clip(CircleShape)
                                        .background(GetoraPrimaryGreen),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.DeliveryDining, contentDescription = "Rider", tint = Color.White)
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(order.riderName ?: "Delivery Partner", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(order.riderPhone ?: "Local Rider", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }

                            Row {
                                IconButton(onClick = {}) {
                                    Icon(Icons.Default.Phone, contentDescription = "Call", tint = GetoraPrimaryGreen)
                                }
                                IconButton(onClick = {}) {
                                    Icon(Icons.Default.Chat, contentDescription = "Chat", tint = GetoraPrimaryGreen)
                                }
                            }
                        }
                    }
                }

                // 4. Ordered Items List
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Items in this Order", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            order.items.forEach { itm ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("${itm.productName} × ${itm.quantity}", fontSize = 13.sp)
                                    Text("₹${itm.totalPrice.toInt()}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                                }
                            }
                            Divider(modifier = Modifier.padding(vertical = 8.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Total Paid", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("₹${order.totalAmount.toInt()} (${order.paymentMethod})", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = GetoraPrimaryGreen)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TrackingStepItem(
    title: String,
    subtitle: String,
    isCompleted: Boolean,
    isCurrent: Boolean,
    isLast: Boolean = false
) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(22.dp)
                    .clip(CircleShape)
                    .background(
                        when {
                            isCompleted -> GetoraPrimaryGreen
                            isCurrent -> GetoraPrimaryGreen.copy(alpha = 0.3f)
                            else -> Color.Gray.copy(alpha = 0.3f)
                        }
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (isCompleted) {
                    Icon(Icons.Default.Check, contentDescription = "Done", tint = Color.White, modifier = Modifier.size(14.dp))
                }
            }
            if (!isLast) {
                Box(
                    modifier = Modifier
                        .width(2.dp)
                        .height(34.dp)
                        .background(if (isCompleted) GetoraPrimaryGreen else Color.Gray.copy(alpha = 0.3f))
                )
            }
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.padding(bottom = if (isLast) 0.dp else 18.dp)) {
            Text(title, fontWeight = if (isCurrent || isCompleted) FontWeight.Bold else FontWeight.Medium, fontSize = 13.5.sp)
            Text(subtitle, fontSize = 11.5.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
