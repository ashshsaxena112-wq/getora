package com.getora.app.ui.screens.checkout

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import com.getora.app.data.model.Address
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.theme.GetoraPrimaryGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckoutScreen(
    repository: GetoraRepository,
    onNavigateBack: () -> Unit,
    onOrderPlaced: (String) -> Unit
) {
    val savedAddresses by repository.savedAddresses.collectAsState()
    val selectedAddress by repository.selectedAddress.collectAsState()
    val total = repository.getCartTotal()

    var selectedPaymentMethod by remember { mutableStateOf("COD") } // "COD" or "UPI"
    var isPlacingOrder by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Checkout & Delivery", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background)
            )
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .padding(16.dp)
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Amount to Pay", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("₹${total.toInt()}", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = GetoraPrimaryGreen)
                    }
                    Button(
                        onClick = {
                            isPlacingOrder = true
                            val order = repository.placeOrder(selectedPaymentMethod)
                            isPlacingOrder = false
                            if (order != null) {
                                onOrderPlaced(order.id)
                            }
                        },
                        enabled = !isPlacingOrder && selectedAddress != null,
                        colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen),
                        shape = RoundedCornerShape(50),
                        contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
                    ) {
                        if (isPlacingOrder) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                        } else {
                            Text("Place Local Order ✓", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Delivery Address Selection
            item {
                Text("Select Delivery Address", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }

            items(savedAddresses) { addr ->
                val isSelected = selectedAddress?.id == addr.id
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .border(
                            1.5.dp,
                            if (isSelected) GetoraPrimaryGreen else MaterialTheme.colorScheme.outline,
                            RoundedCornerShape(12.dp)
                        )
                        .clickable { repository.setSelectedAddress(addr) },
                    color = if (isSelected) GetoraPrimaryGreen.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = isSelected,
                            onClick = { repository.setSelectedAddress(addr) },
                            colors = RadioButtonDefaults.colors(selectedColor = GetoraPrimaryGreen)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(addr.receiverName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = MaterialTheme.colorScheme.surfaceVariant,
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        text = addr.type.uppercase(),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                            Text(addr.addressLine, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("${addr.city} - ${addr.pincode} • Phone: ${addr.phone}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }

            // 2. Delivery ETA Box
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp)),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Bolt,
                            contentDescription = "Fast Delivery",
                            tint = GetoraPrimaryGreen,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("Fast Delivery from Local Shops", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("Estimated arrival: 15–25 minutes after store accepts", fontSize = 11.sp, color = GetoraPrimaryGreen)
                        }
                    }
                }
            }

            // 3. Payment Method
            item {
                Text("Select Payment Option", fontWeight = FontWeight.Bold, fontSize = 15.sp)
            }

            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .border(
                            1.5.dp,
                            if (selectedPaymentMethod == "COD") GetoraPrimaryGreen else MaterialTheme.colorScheme.outline,
                            RoundedCornerShape(12.dp)
                        )
                        .clickable { selectedPaymentMethod = "COD" },
                    color = if (selectedPaymentMethod == "COD") GetoraPrimaryGreen.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedPaymentMethod == "COD",
                            onClick = { selectedPaymentMethod = "COD" },
                            colors = RadioButtonDefaults.colors(selectedColor = GetoraPrimaryGreen)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text("Cash on Delivery (COD)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Pay cash or scan QR upon receiving package", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }

            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .border(
                            1.5.dp,
                            if (selectedPaymentMethod == "UPI") GetoraPrimaryGreen else MaterialTheme.colorScheme.outline,
                            RoundedCornerShape(12.dp)
                        )
                        .clickable { selectedPaymentMethod = "UPI" },
                    color = if (selectedPaymentMethod == "UPI") GetoraPrimaryGreen.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedPaymentMethod == "UPI",
                            onClick = { selectedPaymentMethod = "UPI" },
                            colors = RadioButtonDefaults.colors(selectedColor = GetoraPrimaryGreen)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text("Instant UPI / Online Payment", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Pay via Google Pay, PhonePe, Paytm, or BHIM", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}
