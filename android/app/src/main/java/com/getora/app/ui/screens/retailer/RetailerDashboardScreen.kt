package com.getora.app.ui.screens.retailer

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.getora.app.data.model.MasterProduct
import com.getora.app.data.repository.GetoraRepository
import com.getora.app.ui.components.CategoryChip
import com.getora.app.ui.components.PillSearchBar
import com.getora.app.ui.theme.GetoraPrimaryGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RetailerDashboardScreen(
    repository: GetoraRepository,
    onNavigateBack: () -> Unit
) {
    val masterCatalog by repository.masterCatalog.collectAsState()
    val shopProducts by repository.products.collectAsState()
    val categories by repository.categories.collectAsState()
    val productRequests by repository.productRequests.collectAsState()

    var activeTab by remember { mutableStateOf("catalog") } // "catalog", "inventory", "requests"
    var catalogSearch by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("all") }

    // 1-Click Add Modal State
    var selectedMasterProduct by remember { mutableStateOf<MasterProduct?>(null) }
    var sellingPriceInput by remember { mutableStateOf("") }
    var mrpInput by remember { mutableStateOf("") }
    var stockInput by remember { mutableStateOf("25") }

    // Request Product Modal State
    var showRequestDialog by remember { mutableStateOf(false) }
    var reqName by remember { mutableStateOf("") }
    var reqBrand by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Retailer Store Portal", fontWeight = FontWeight.Bold) },
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Tab Selector Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = activeTab == "catalog",
                    onClick = { activeTab = "catalog" },
                    label = { Text("⚡ Master Catalog (${masterCatalog.size})") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = GetoraPrimaryGreen,
                        selectedLabelColor = Color.White
                    )
                )
                FilterChip(
                    selected = activeTab == "inventory",
                    onClick = { activeTab = "inventory" },
                    label = { Text("My Shop (${shopProducts.size})") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = GetoraPrimaryGreen,
                        selectedLabelColor = Color.White
                    )
                )
                FilterChip(
                    selected = activeTab == "requests",
                    onClick = { activeTab = "requests" },
                    label = { Text("Requests (${productRequests.size})") },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = GetoraPrimaryGreen,
                        selectedLabelColor = Color.White
                    )
                )
            }

            // TAB 1: MASTER PRODUCT CATALOG (1-CLICK ADD)
            if (activeTab == "catalog") {
                Column(modifier = Modifier.fillMaxSize()) {
                    PillSearchBar(
                        query = catalogSearch,
                        onQueryChange = { catalogSearch = it },
                        placeholder = "Search master catalog (Philips, Havells, boAt…)",
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                    )

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(vertical = 6.dp)
                    ) {
                        items(categories) { cat ->
                            CategoryChip(
                                category = cat,
                                isSelected = selectedCategory == cat.id,
                                onClick = {
                                    selectedCategory = if (selectedCategory == cat.id) "all" else cat.id
                                }
                            )
                        }
                    }

                    val filteredCatalog = masterCatalog.filter { item ->
                        val matchCat = selectedCategory == "all" || item.categoryId == selectedCategory
                        val matchSearch = catalogSearch.isEmpty() ||
                                item.name.contains(catalogSearch, ignoreCase = true) ||
                                item.brand.contains(catalogSearch, ignoreCase = true)
                        matchCat && matchSearch
                    }

                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(filteredCatalog) { masterItem ->
                            val alreadyInShop = shopProducts.find {
                                it.masterProductId == masterItem.id || it.name.equals(masterItem.name, ignoreCase = true)
                            }

                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .border(
                                        1.dp,
                                        if (alreadyInShop != null) GetoraPrimaryGreen else MaterialTheme.colorScheme.outline,
                                        RoundedCornerShape(12.dp)
                                    ),
                                color = MaterialTheme.colorScheme.surface
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    AsyncImage(
                                        model = masterItem.imageUrl,
                                        contentDescription = masterItem.name,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(60.dp)
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(MaterialTheme.colorScheme.surfaceVariant)
                                    )
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(masterItem.brand, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = GetoraPrimaryGreen)
                                        Text(masterItem.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 2, overflow = TextOverflow.Ellipsis)
                                        Text("MRP: ₹${masterItem.suggestedPrice.toInt()} • Unit: ${masterItem.unit}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Button(
                                        onClick = {
                                            selectedMasterProduct = masterItem
                                            sellingPriceInput = (alreadyInShop?.sellingPrice ?: masterItem.suggestedSellingPrice).toInt().toString()
                                            mrpInput = (alreadyInShop?.price ?: masterItem.suggestedPrice).toInt().toString()
                                            stockInput = (alreadyInShop?.stockQuantity ?: 25).toString()
                                        },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (alreadyInShop != null) MaterialTheme.colorScheme.surfaceVariant else GetoraPrimaryGreen,
                                            contentColor = if (alreadyInShop != null) GetoraPrimaryGreen else Color.White
                                        ),
                                        shape = RoundedCornerShape(50),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        Text(
                                            text = if (alreadyInShop != null) "✓ Edit" else "+ Add",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // TAB 2: MY SHOP PRODUCTS
            if (activeTab == "inventory") {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(shopProducts) { prod ->
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
                                    model = prod.imageUrl,
                                    contentDescription = prod.name,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .size(54.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(prod.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                                    Text("Selling Price: ₹${prod.sellingPrice.toInt()}", fontSize = 12.sp, color = GetoraPrimaryGreen, fontWeight = FontWeight.Bold)
                                    Text("Available Stock: ${prod.stockQuantity} ${prod.unit}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                        }
                    }
                }
            }

            // TAB 3: REQUESTED PRODUCTS
            if (activeTab == "requests") {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Button(
                        onClick = { showRequestDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen),
                        shape = RoundedCornerShape(50),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("+ Request Missing Product from GETORA", fontWeight = FontWeight.Bold)
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (productRequests.isEmpty()) {
                        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text("No pending requests", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    } else {
                        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(productRequests) { req ->
                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(12.dp)),
                                    color = MaterialTheme.colorScheme.surface
                                ) {
                                    Column(modifier = Modifier.padding(14.dp)) {
                                        Text(req.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Text("Brand: ${req.brand ?: "Local"} • Category: ${req.categoryName}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        Text("Status: ⏳ Pending Admin Review", fontSize = 11.sp, color = Color(0xFFEAB308), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 1-Click "Add to Shop" Dialog Modal
        if (selectedMasterProduct != null) {
            AlertDialog(
                onDismissRequest = { selectedMasterProduct = null },
                title = { Text("List in Your Shop", fontWeight = FontWeight.Bold) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(selectedMasterProduct!!.name, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        OutlinedTextField(
                            value = sellingPriceInput,
                            onValueChange = { sellingPriceInput = it },
                            label = { Text("Your Selling Price (₹)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = mrpInput,
                            onValueChange = { mrpInput = it },
                            label = { Text("MRP Printed (₹)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = stockInput,
                            onValueChange = { stockInput = it },
                            label = { Text("Available Stock") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val sp = sellingPriceInput.toDoubleOrNull() ?: selectedMasterProduct!!.suggestedSellingPrice
                            val mrp = mrpInput.toDoubleOrNull() ?: selectedMasterProduct!!.suggestedPrice
                            val stock = stockInput.toIntOrNull() ?: 20

                            repository.addMasterProductToShop(
                                masterProduct = selectedMasterProduct!!,
                                sellingPrice = sp,
                                mrp = mrp,
                                stock = stock
                            )
                            selectedMasterProduct = null
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen)
                    ) {
                        Text("✓ Save to Shop", fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { selectedMasterProduct = null }) {
                        Text("Cancel")
                    }
                }
            )
        }

        // Request Product Dialog
        if (showRequestDialog) {
            AlertDialog(
                onDismissRequest = { showRequestDialog = false },
                title = { Text("Request New Product", fontWeight = FontWeight.Bold) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = reqName,
                            onValueChange = { reqName = it },
                            label = { Text("Product Name *") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = reqBrand,
                            onValueChange = { reqBrand = it },
                            label = { Text("Brand Name") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (reqName.isNotBlank()) {
                                repository.requestNewProduct(
                                    name = reqName.trim(),
                                    brand = reqBrand.trim(),
                                    categoryId = "cat-electrical",
                                    categoryName = "Electrical",
                                    expectedPrice = null,
                                    unit = "1 pc",
                                    notes = null
                                )
                                showRequestDialog = false
                                reqName = ""
                                reqBrand = ""
                                activeTab = "requests"
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GetoraPrimaryGreen)
                    ) {
                        Text("Submit Request")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showRequestDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}
