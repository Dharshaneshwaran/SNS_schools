import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// Exact colors from frontend CSS variables
class AppColors {
  static const Color primary = Color(0xFFFF7F50);
  static const Color primaryLight = Color(0xFFFF9D7A);
  static const Color primaryDark = Color(0xFFE66A3E);
  static const Color accent = Color(0xFFFF7F50);
  static const Color accentSoft = Color(0x1AFF7F50); // rgba(255,127,80,0.1)
  static const Color accentStrong = Color(0xFFE66A3E);
  
  // Light theme - from :root
  static const Color background = Color(0xFFF8FAFC);
  static const Color foreground = Color(0xFF1E293B);
  static const Color card = Color(0xFFFFFFFF);
  static const Color cardForeground = Color(0xFF1E293B);
  static const Color secondary = Color(0xFFF1F5F9);
  static const Color secondaryForeground = Color(0xFF1E293B);
  static const Color muted = Color(0xFF64748B);
  static const Color mutedForeground = Color(0xFF94A3B8);
  static const Color border = Color(0xFFE2E8F0);
  static const Color input = Color(0xFFE2E8F0);
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF636E72);
  static const Color textMuted = Color(0xFF718096);
  static const Color surface = Color(0xFFF8FAFC);
  static const Color inputBg = Color(0xFFF1F5F9);
  static const Color error = Color(0xFFEF4444);
  static const Color errorBg = Color(0x1FEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color securityBg = Color(0x14FF7F50);
  static const Color securityBorder = Color(0x33FF7F50);
}

// Dark theme - from [data-theme='dark']
class DarkAppColors {
  static const Color primary = Color(0xFFFF6A00);
  static const Color primaryLight = Color(0xFFFF9D7A);
  static const Color primaryDark = Color(0xFFE66A3E);
  static const Color accent = Color(0xFFFF6A00);
  static const Color accentSoft = Color(0x4DFF6A00); // rgba(255,106,0,0.3)
  static const Color accentStrong = Color(0xFFE66A3E);
  
  static const Color background = Color(0xFF0B0B0B);
  static const Color foreground = Color(0xFFFFFFFF);
  static const Color card = Color(0xFF1A1A1A);
  static const Color cardForeground = Color(0xFFFFFFFF);
  static const Color secondary = Color(0xFF1A1A1A);
  static const Color secondaryForeground = Color(0xFFFFFFFF);
  static const Color muted = Color(0xFFA0A0A0);
  static const Color mutedForeground = Color(0xFFA0A0A0);
  static const Color border = Color(0x1AFFFFFF); // rgba(255,255,255,0.1)
  static const Color input = Color(0xFF2A2A2A);
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFA0A0A0);
  static const Color textMuted = Color(0xFF6B6B6B);
  static const Color surface = Color(0xFF1A1A1A);
  static const Color inputBg = Color(0xFF1E1E1E);
  static const Color error = Color(0xFFEF4444);
  static const Color errorBg = Color(0x1FEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color securityBg = Color(0x14FF6A00);
  static const Color securityBorder = Color(0x33FF6A00);
  static const Color cardShadow = Color(0x80000000); // 0 20px 50px rgba(0,0,0,0.5)
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: AppColors.primary,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.primaryDark,
        surface: AppColors.surface,
        error: AppColors.error,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(ThemeData.light().textTheme).copyWith(
        headlineLarge: GoogleFonts.poppins(fontSize: 26, fontWeight: FontWeight.w700, color: AppColors.textPrimary, letterSpacing: -0.5),
        headlineMedium: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w700, color: AppColors.textPrimary, letterSpacing: -0.5),
        headlineSmall: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
        bodyLarge: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
        bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
        bodySmall: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary),
        labelLarge: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary, letterSpacing: 0.5),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
          textStyle: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.8),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.inputBg,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.border)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.border)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppColors.primary, width: 1.5)),
        hintStyle: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 15, fontWeight: FontWeight.w500),
      ),
      cardTheme: CardThemeData(
        color: AppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: const BorderSide(color: AppColors.border)),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: DarkAppColors.primary,
      scaffoldBackgroundColor: DarkAppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: DarkAppColors.primary,
        secondary: DarkAppColors.primaryDark,
        surface: DarkAppColors.surface,
        error: DarkAppColors.error,
      ),
      textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme).copyWith(
        headlineLarge: GoogleFonts.poppins(fontSize: 26, fontWeight: FontWeight.w700, color: DarkAppColors.textPrimary, letterSpacing: -0.5),
        headlineMedium: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w700, color: DarkAppColors.textPrimary, letterSpacing: -0.5),
        headlineSmall: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700, color: DarkAppColors.textPrimary),
        bodyLarge: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500, color: DarkAppColors.textPrimary),
        bodyMedium: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: DarkAppColors.textSecondary),
        bodySmall: GoogleFonts.inter(fontSize: 13, color: DarkAppColors.textSecondary),
        labelLarge: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: DarkAppColors.textPrimary, letterSpacing: 0.5),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: DarkAppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 0,
          textStyle: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.8),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: DarkAppColors.inputBg,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: DarkAppColors.border)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: DarkAppColors.border)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: DarkAppColors.primary, width: 1.5)),
        hintStyle: GoogleFonts.inter(color: DarkAppColors.textMuted, fontSize: 15, fontWeight: FontWeight.w500),
      ),
      cardTheme: CardThemeData(
        color: DarkAppColors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: const BorderSide(color: DarkAppColors.border)),
      ),
    );
  }
}
