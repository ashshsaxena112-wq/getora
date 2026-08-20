package com.getora.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = GetoraPrimaryGreen,
    onPrimary = GetoraDarkText,
    primaryContainer = GetoraDarkCard,
    onPrimaryContainer = GetoraPrimaryGreenLight,
    secondary = GetoraPrimaryGreenLight,
    background = GetoraDarkBg,
    onBackground = GetoraDarkText,
    surface = GetoraDarkCard,
    onSurface = GetoraDarkText,
    surfaceVariant = GetoraDarkElevated,
    onSurfaceVariant = GetoraDarkTextMuted,
    outline = GetoraDarkBorder
)

private val LightColorScheme = lightColorScheme(
    primary = GetoraPrimaryGreen,
    onPrimary = GetoraDarkText,
    primaryContainer = GetoraLightElevated,
    onPrimaryContainer = GetoraPrimaryGreenDark,
    secondary = GetoraPrimaryGreenDark,
    background = GetoraLightBg,
    onBackground = GetoraLightText,
    surface = GetoraLightCard,
    onSurface = GetoraLightText,
    surfaceVariant = GetoraLightInput,
    onSurfaceVariant = GetoraLightTextMuted,
    outline = GetoraLightBorder
)

@Composable
fun GetoraTheme(
    darkTheme: Boolean = true, // Default to GETORA's dark green aesthetic
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            window.navigationBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
