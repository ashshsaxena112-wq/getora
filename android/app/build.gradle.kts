plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
}

android {
    namespace = "com.getora.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.getora.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // Build config fields for secure Supabase integration
        buildConfigField("String", "SUPABASE_URL", "\"https://mtyuxfqwivpazckjlvgr.supabase.co\"")
        buildConfigField("String", "SUPABASE_ANON_KEY", "\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10eXV4ZnF3aXZwYXpja2psdmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzc1NTAsImV4cCI6MjA1NTc1MzU1MH0.4j3i3XnCjYh1UqU2y8Vq7l_T3Vq7l_T3Vq7l_T3Vq7l\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons)
    implementation(libs.androidx.navigation.compose)

    // Coroutines & Serialization
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)

    // Networking (Ktor HTTP Engine)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)

    // Image Loading (Coil 3)
    implementation(libs.coil.compose)
    implementation(libs.coil.network.okhttp)

    // Location Services (Fused Location)
    implementation(libs.play.services.location)

    // DataStore (Preferences Cache)
    implementation(libs.androidx.datastore.preferences)

    // Firebase Push Notifications (Optional FCM)
    implementation(libs.firebase.messaging)

    debugImplementation(libs.androidx.compose.ui.tooling)
}
