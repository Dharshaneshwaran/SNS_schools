import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primaryOrange = Color(0xFFFF6D00); // Vibrant Orange
  static const Color accentOrange = Color(0xFFFF9E22);
  static const Color deepOrange = Color(0xFFE65100);
  
  static const Color background = Color(0xFF0A0A0A); // Deep Obsidian
  static const Color surface = Color(0xFF121212); // Sleek Grey-Black
  static const Color surfaceLight = Color(0xFF1E1E1E);
  
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Colors.white70;
  static const Color textDisabled = Colors.white38;
  
  static const Color success = Color(0xFF388E3C);
  static const Color error = Color(0xFFD32F2F);

  static const LinearGradient mainGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [background, Color(0xFF1A1A1A)],
  );

  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryOrange, accentOrange],
  );
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: AppColors.primaryOrange,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryOrange,
        secondary: AppColors.accentOrange,
        surface: AppColors.surface,
        background: AppColors.background,
        error: AppColors.error,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
        displayMedium: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
        bodyLarge: const TextStyle(fontSize: 16, color: Colors.white),
        bodyMedium: const TextStyle(fontSize: 14, color: Colors.white70),
      ),
      cardTheme: CardTheme(
        color: AppColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Colors.white.withOpacity(0.05)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryOrange,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceLight,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.05)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primaryOrange, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.textDisabled),
      ),
    );
  }
}
