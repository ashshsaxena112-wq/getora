package com.getora.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.getora.app.ui.navigation.GetoraNavGraph
import com.getora.app.ui.theme.GetoraTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GetoraTheme(darkTheme = true) {
                Surface(modifier = Modifier.fillMaxSize()) {
                    val navController = rememberNavController()
                    GetoraNavGraph(navController = navController)
                }
            }
        }
    }
}
