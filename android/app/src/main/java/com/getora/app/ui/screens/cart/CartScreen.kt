package com.getora.app.ui.screens.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.components.QuantityStepper
import com.getora.app.ui.theme.GetoraPrimaryGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    repository: GetoraRepository,
    onNavigateBack: () -> Unit,
    onProceedToCheckout: () -> Unit
) {
    val cartItems by repository.cartItems.collectAsState()
    val appliedCoupon by repository.appliedCoupon.collectAsState()
    var couponInput by remember { mutableStateOf("") }
    var couponError by remember { mutableStateOf<String?>(null) }

    val subtotal = repository.getCartSubtotal()
    val deliveryFee = 25.0
    val discount = appliedCoupon?.discountAmount ?: 0.0
    val total = repository.getCartTotal()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Your Shopping Bag", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            if (cartItems.isNotEmpty()) {
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
                            Text("Total to Pay", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("₹${total.toInt()}", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = GetoraPrimaryGreen)
                        }
                        Button(
                            onClick = onProceedToCheckout,
                            colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen),
                            shape = RoundedCornerShape(50),
                            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp)
                        ) {
                            Text("Proceed to Checkout →", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        if (cartItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.ShoppingBag,
                        contentDescription = "Empty",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Your cart is empty", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("Add items from local stores to order fast delivery", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onNavigateBack,
                        colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen),
                        shape = RoundedCornerShape(50)
                    ) {
                        Text("Browse Nearby Shops")
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Cart Items List
                items(cartItems) { item ->
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AsyncImage(
                                model = item.product.imageUrl,
                                contentDescription = item.product.name,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(56.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(item.product.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                                Text("Sold by ${item.storeName}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("₹${item.product.sellingPrice.toInt()}", fontSize = 14.sp, fontWeight = FontWeight.ExtraBold, color = GetoraPrimaryGreen)
                            }
                            QuantityStepper(
                                quantity = item.quantity,
                                onIncrement = { repository.updateCartQuantity(item.product.id, 1) },
                                onDecrement = { repository.updateCartQuantity(item.product.id, -1) }
                            )
                        }
                    }
                }

                // Coupon Code Box
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("Have a promo coupon?", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            if (appliedCoupon != null) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(GetoraPrimaryGreen.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                        .padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text("✓ Code ${appliedCoupon!!.code} Applied", fontWeight = FontWeight.Bold, color = GetoraPrimaryGreen, fontSize = 13.sp)
                                        Text("Saved ₹${appliedCoupon!!.discountAmount.toInt()} on this order", fontSize = 11.sp, color = GetoraPrimaryGreen)
                                    }
                                    IconButton(onClick = { repository.removeCoupon() }) {
                                        Icon(Icons.Default.Close, contentDescription = "Remove", tint = Color.Red)
                                    }
                                }
                            } else {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    OutlinedTextField(
                                        value = couponInput,
                                        onValueChange = { couponInput = it; couponError = null },
                                        placeholder = { Text("Try GETORA100", fontSize = 12.sp) },
                                        modifier = Modifier.weight(1f),
                                        shape = RoundedCornerShape(50),
                                        singleLine = true
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Button(
                                        onClick = {
                                            val ok = repository.applyCoupon(couponInput)
                                            if (!ok) couponError = "Invalid code. Try GETORA100"
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen),
                                        shape = RoundedCornerShape(50)
                                    ) {
                                        Text("APPLY", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    }
                                }
                                if (couponError != null) {
                                    Text(couponError!!, color = Color.Red, fontSize = 11.sp, modifier = Modifier.padding(top = 4.dp))
                                }
                            }
                        }
                    }
                }

                // Bill Summary
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp)),
                        color = MaterialTheme.colorScheme.surface
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Bill Summary", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Item Total", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("₹${subtotal.toInt()}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Delivery Partner Fee", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("₹${deliveryFee.toInt()}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            }
                            if (discount > 0) {
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Coupon Discount", fontSize = 13.sp, color = GetoraPrimaryGreen)
                                    Text("-₹${discount.toInt()}", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = GetoraPrimaryGreen)
                                }
                            }
                            Divider(modifier = Modifier.padding(vertical = 10.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Grand Total", fontSize = 15.sp, fontWeight = FontWeight.ExtraBold)
                                Text("₹${total.toInt()}", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = GetoraPrimaryGreen)
                            }
                        }
                    }
                }
            }
        }
    }
}
