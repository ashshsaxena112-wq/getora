package com.getora.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class GetoraApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                ORDER_UPDATES_CHANNEL_ID,
                "Order & Delivery Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Real-time updates when orders are placed, dispatched and delivered"
                enableVibration(true)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    companion object {
        const val ORDER_UPDATES_CHANNEL_ID = "getora_order_updates"
    }
}
