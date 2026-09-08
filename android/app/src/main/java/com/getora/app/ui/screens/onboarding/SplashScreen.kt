package com.getora.app.ui.screens.onboarding

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.getora.app.ui.theme.GetoraPrimaryGreen
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onNavigateNext: () -> Unit) {
    LaunchedEffect(Unit) {
        delay(2000)
        onNavigateNext()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Main Logo Text "GETORA" with Shopping Bag O
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "GET",
                    color = GetoraPrimaryGreen,
                    fontSize = 64.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-2).sp
                )
                
                // The 'O' with handle (Shopping Bag look)
                Box(
                    contentAlignment = Alignment.TopCenter,
                    modifier = Modifier.padding(horizontal = 2.dp)
                ) {
                    Canvas(modifier = Modifier
                        .size(52.dp)
                        .offset(y = (-18).dp)
                    ) {
                        drawArc(
                            color = GetoraPrimaryGreen,
                            startAngle = 180f,
                            sweepAngle = 180f,
                            useCenter = false,
                            style = Stroke(width = 4.dp.toPx(), cap = StrokeCap.Round)
                        )
                    }
                    Text(
                        text = "O",
                        color = GetoraPrimaryGreen,
                        fontSize = 64.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = (-2).sp
                    )
                }

                Text(
                    text = "RA",
                    color = GetoraPrimaryGreen,
                    fontSize = 64.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-2).sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Tagline: TAP. GET. FAST.
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(horizontal = 20.dp)
            ) {
                // Left Line
                Canvas(modifier = Modifier
                    .weight(1f)
                    .height(1.dp)
                ) {
                    drawLine(
                        color = GetoraPrimaryGreen.copy(alpha = 0.5f),
                        start = Offset(0f, 0f),
                        end = Offset(size.width, 0f),
                        strokeWidth = 1.dp.toPx()
                    )
                }

                Text(
                    text = buildAnnotatedString {
                        withStyle(style = SpanStyle(color = Color.White)) {
                            append("TAP. ")
                        }
                        withStyle(style = SpanStyle(color = GetoraPrimaryGreen)) {
                            append("GET. ")
                        }
                        withStyle(style = SpanStyle(color = Color.White)) {
                            append("FAST.")
                        }
                    },
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 12.dp),
                    letterSpacing = 1.sp
                )

                // Right Line
                Canvas(modifier = Modifier
                    .weight(1f)
                    .height(1.dp)
                ) {
                    drawLine(
                        color = GetoraPrimaryGreen.copy(alpha = 0.5f),
                        start = Offset(0f, 0f),
                        end = Offset(size.width, 0f),
                        strokeWidth = 1.dp.toPx()
                    )
                }
            }
        }
    }
}
