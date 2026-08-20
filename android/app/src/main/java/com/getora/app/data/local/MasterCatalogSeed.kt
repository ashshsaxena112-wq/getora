package com.getora.app.data.local

import com.getora.app.data.model.Category
import com.getora.app.data.model.MasterProduct
import com.getora.app.data.model.Product
import com.getora.app.data.model.Store

object MasterCatalogSeed {

    val categories = listOf(
        Category(id = "cat-electrical", name = "Electrical", slug = "electrical", sortOrder = 1),
        Category(id = "cat-hardware", name = "Hardware & Tools", slug = "hardware", sortOrder = 2),
        Category(id = "cat-electronics", name = "Electronics & Audio", slug = "electronics", sortOrder = 3),
        Category(id = "cat-mobile", name = "Mobile Accessories", slug = "mobile-accessories", sortOrder = 4),
        Category(id = "cat-stationery", name = "Stationery & Office", slug = "stationery", sortOrder = 5),
        Category(id = "cat-grocery", name = "Daily Essentials", slug = "grocery", sortOrder = 6),
        Category(id = "cat-home", name = "Home & Kitchen", slug = "home-kitchen", sortOrder = 7),
        Category(id = "cat-pet", name = "Pet Supplies", slug = "pet-supplies", sortOrder = 8),
        Category(id = "cat-personal", name = "Personal Care", slug = "personal-care", sortOrder = 9),
        Category(id = "cat-auto", name = "Auto Accessories", slug = "auto-accessories", sortOrder = 10)
    )

    val masterProducts = listOf(
        MasterProduct(
            id = "mp-elec-001",
            name = "Philips 9W B22 LED Warm/Cool Bulb",
            brand = "Philips",
            categoryId = "cat-electrical",
            categoryName = "Electrical",
            description = "Energy saving 9W LED bulb with 900 Lumens output. Long lifespan up to 15,000 hours.",
            suggestedPrice = 160.0,
            suggestedSellingPrice = 110.0,
            unit = "Pack of 1",
            imageUrl = "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&auto=format&fit=crop&q=80",
            sku = "PHI-LED-9W-B22",
            isPopular = true
        ),
        MasterProduct(
            id = "mp-elec-002",
            name = "Havells Life Line Plus 1.5 sq mm HRFR Wire (90m)",
            brand = "Havells",
            categoryId = "cat-electrical",
            categoryName = "Electrical",
            description = "High heat resistant flame retardant 100% pure copper electrical wire 90m roll.",
            suggestedPrice = 2450.0,
            suggestedSellingPrice = 1899.0,
            unit = "90m Roll",
            imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
            sku = "HAV-WIRE-15-90M",
            isPopular = true
        ),
        MasterProduct(
            id = "mp-elec-003",
            name = "Anchor by Panasonic Roma 6A 1-Way Switch",
            brand = "Anchor",
            categoryId = "cat-electrical",
            categoryName = "Electrical",
            description = "Modular 6A white switch with smooth rocker action. Fire-retardant polycarbonate.",
            suggestedPrice = 45.0,
            suggestedSellingPrice = 32.0,
            unit = "1 pc",
            imageUrl = "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80",
            sku = "ANC-ROMA-6A-SW"
        ),
        MasterProduct(
            id = "mp-hard-001",
            name = "Bosch GSB 500W Professional Impact Drill Machine",
            brand = "Bosch",
            categoryId = "cat-hardware",
            categoryName = "Hardware & Tools",
            description = "Powerful 500W forward/reverse impact drill suitable for concrete, masonry, wood and metal.",
            suggestedPrice = 4200.0,
            suggestedSellingPrice = 3199.0,
            unit = "Kit Box",
            imageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
            sku = "BOSCH-GSB-500W",
            isPopular = true
        ),
        MasterProduct(
            id = "mp-hard-002",
            name = "Fevicol SH Synthetic Resin Adhesive 1kg",
            brand = "Fevicol",
            categoryId = "cat-hardware",
            categoryName = "Hardware & Tools",
            description = "India's most trusted woodworking adhesive for wood, plywood, laminate, and MDF.",
            suggestedPrice = 320.0,
            suggestedSellingPrice = 275.0,
            unit = "1 kg Tub",
            imageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
            sku = "PID-FEV-SH-1KG"
        ),
        MasterProduct(
            id = "mp-audio-001",
            name = "boAt Bassheads 100 Wired Earphones with Mic",
            brand = "boAt",
            categoryId = "cat-electronics",
            categoryName = "Electronics & Audio",
            description = "Hawk inspired design with 10mm dynamic drivers for punchy bass and crystal clear calling.",
            suggestedPrice = 999.0,
            suggestedSellingPrice = 379.0,
            unit = "1 pc",
            imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
            sku = "BOAT-BH-100-BLK",
            isPopular = true
        ),
        MasterProduct(
            id = "mp-mob-001",
            name = "Anker PowerLine 60W Type-C to Type-C Fast Cable (1m)",
            brand = "Anker",
            categoryId = "cat-mobile",
            categoryName = "Mobile Accessories",
            description = "Braided nylon heavy duty 60W fast charging cable with 480Mbps data transfer speed.",
            suggestedPrice = 899.0,
            suggestedSellingPrice = 499.0,
            unit = "1m Cable",
            imageUrl = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
            sku = "ANK-TC-60W-1M"
        ),
        MasterProduct(
            id = "mp-groc-001",
            name = "Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)",
            brand = "Fortune",
            categoryId = "cat-grocery",
            categoryName = "Daily Essentials",
            description = "Enriched with Vitamins A & D, light and easy to digest healthy cooking oil.",
            suggestedPrice = 165.0,
            suggestedSellingPrice = 135.0,
            unit = "1 Litre",
            imageUrl = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
            sku = "FORT-SUN-1L",
            isPopular = true
        ),
        MasterProduct(
            id = "mp-groc-002",
            name = "Tata Salt Vaccum Evaporated Iodised Salt (1kg)",
            brand = "Tata",
            categoryId = "cat-grocery",
            categoryName = "Daily Essentials",
            description = "Desh Ka Namak - pure vacuum evaporated salt with essential iodine for health.",
            suggestedPrice = 30.0,
            suggestedSellingPrice = 28.0,
            unit = "1 kg Pack",
            imageUrl = "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80",
            sku = "TATA-SALT-1KG"
        )
    )

    val stores = listOf(
        Store(
            id = "store-voltix",
            shopName = "Voltix Electricals & Hardware",
            ownerName = "Ashish Saxena",
            phone = "+91 98971 23456",
            address = "Shop 14, Sanjay Place Commercial Complex",
            city = "Agra",
            rating = 4.9,
            totalRatings = 142,
            isOpen = true,
            deliveryTime = "15-20 mins",
            distance = "0.8 km",
            imageUrl = "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80",
            categories = listOf("Electrical", "Hardware & Tools", "Lighting")
        ),
        Store(
            id = "store-sharma-tools",
            shopName = "Sharma Tools & Hardware Mart",
            ownerName = "Rajesh Sharma",
            phone = "+91 94120 56789",
            address = "Opp. Civil Court, MG Road",
            city = "Agra",
            rating = 4.7,
            totalRatings = 98,
            isOpen = true,
            deliveryTime = "20-25 mins",
            distance = "1.5 km",
            imageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
            categories = listOf("Hardware & Tools", "Paints", "Plumbing")
        ),
        Store(
            id = "store-tech-hub",
            shopName = "TechHub Mobile & Audio World",
            ownerName = "Vikram Verma",
            phone = "+91 88002 99112",
            address = "Shop 4, Nehru Nagar Market",
            city = "Agra",
            rating = 4.8,
            totalRatings = 210,
            isOpen = true,
            deliveryTime = "12-18 mins",
            distance = "0.5 km",
            imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
            categories = listOf("Mobile Accessories", "Electronics & Audio")
        ),
        Store(
            id = "store-daily-fresh",
            shopName = "Daily Fresh Grocery & Provisions",
            ownerName = "Manoj Agarwal",
            phone = "+91 97190 44332",
            address = "Near St. John's Crossing",
            city = "Agra",
            rating = 4.6,
            totalRatings = 350,
            isOpen = true,
            deliveryTime = "15-20 mins",
            distance = "1.1 km",
            imageUrl = "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80",
            categories = listOf("Daily Essentials", "Home & Kitchen", "Personal Care")
        )
    )

    val sampleProducts = listOf(
        Product(
            id = "p-1",
            name = "Philips 9W B22 LED Bulb (Cool White)",
            brand = "Philips",
            categoryId = "cat-electrical",
            categoryName = "Electrical",
            retailerId = "store-voltix",
            storeName = "Voltix Electricals & Hardware",
            masterProductId = "mp-elec-001",
            description = "Original Philips 9W LED bulb with 1-year replacement warranty.",
            price = 160.0,
            sellingPrice = 110.0,
            stockQuantity = 45,
            unit = "Pack of 1",
            imageUrl = "https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&auto=format&fit=crop&q=80",
            rating = 4.9,
            reviewCount = 38
        ),
        Product(
            id = "p-2",
            name = "Havells 1.5 sq mm Copper Wire (90m Roll)",
            brand = "Havells",
            categoryId = "cat-electrical",
            categoryName = "Electrical",
            retailerId = "store-voltix",
            storeName = "Voltix Electricals & Hardware",
            masterProductId = "mp-elec-002",
            description = "Flame retardant 100% pure copper electrical wire.",
            price = 2450.0,
            sellingPrice = 1899.0,
            stockQuantity = 18,
            unit = "90m Roll",
            imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
            rating = 4.8,
            reviewCount = 24
        ),
        Product(
            id = "p-3",
            name = "Bosch 500W Professional Impact Drill Machine",
            brand = "Bosch",
            categoryId = "cat-hardware",
            categoryName = "Hardware & Tools",
            retailerId = "store-sharma-tools",
            storeName = "Sharma Tools & Hardware Mart",
            masterProductId = "mp-hard-001",
            description = "High performance drill for home DIY and professional repairs.",
            price = 4200.0,
            sellingPrice = 3199.0,
            stockQuantity = 8,
            unit = "Kit Box",
            imageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80",
            rating = 5.0,
            reviewCount = 42
        ),
        Product(
            id = "p-4",
            name = "boAt Bassheads 100 Wired Earphones with Mic",
            brand = "boAt",
            categoryId = "cat-electronics",
            categoryName = "Electronics & Audio",
            retailerId = "store-tech-hub",
            storeName = "TechHub Mobile & Audio World",
            masterProductId = "mp-audio-001",
            description = "Super extra bass earphones with inline HD microphone.",
            price = 999.0,
            sellingPrice = 379.0,
            stockQuantity = 22,
            unit = "1 pc",
            imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
            rating = 4.7,
            reviewCount = 65
        ),
        Product(
            id = "p-5",
            name = "Fortune Sunlite Sunflower Oil (1 Litre)",
            brand = "Fortune",
            categoryId = "cat-grocery",
            categoryName = "Daily Essentials",
            retailerId = "store-daily-fresh",
            storeName = "Daily Fresh Grocery & Provisions",
            masterProductId = "mp-groc-001",
            description = "Fresh stock refined sunflower cooking oil.",
            price = 165.0,
            sellingPrice = 135.0,
            stockQuantity = 50,
            unit = "1 Litre",
            imageUrl = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
            rating = 4.9,
            reviewCount = 89
        )
    )
}
