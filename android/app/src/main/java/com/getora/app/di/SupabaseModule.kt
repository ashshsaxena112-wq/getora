package com.getora.app.di

import com.getora.app.BuildConfig
import com.getora.storage.GetoraStorageManager
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.storage.Storage

/**
 * SupabaseModule
 *
 * Manual Dependency Injection provider for Supabase components.
 * In a larger project, this would be handled by Hilt or Koin.
 */
object SupabaseModule {

    val client: SupabaseClient by lazy {
        createSupabaseClient(
            supabaseUrl = BuildConfig.SUPABASE_URL,
            supabaseKey = BuildConfig.SUPABASE_ANON_KEY
        ) {
            install(Auth)
            install(Postgrest)
            install(Storage)
        }
    }

    val storageManager: GetoraStorageManager by lazy {
        GetoraStorageManager(client)
    }
}
