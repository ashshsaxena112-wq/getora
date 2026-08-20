package com.getora.app.services

import android.app.Notification
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.getora.app.GetoraApplication

class GetoraLocationTrackingService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification: Notification = NotificationCompat.Builder(this, GetoraApplication.ORDER_UPDATES_CHANNEL_ID)
            .setContentTitle("GETORA Delivery Active")
            .setContentText("Broadcasting live rider location for active order")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()

        startForeground(101, notification)
        return START_STICKY
    }
}
