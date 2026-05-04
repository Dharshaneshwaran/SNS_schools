import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

final showSplashProvider = StateNotifierProvider<ShowSplashNotifier, bool>((ref) {
  return ShowSplashNotifier();
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.dark) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDark = prefs.getBool('isDarkMode') ?? true;
    state = isDark ? ThemeMode.dark : ThemeMode.light;
  }

  Future<void> toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDark = state == ThemeMode.dark;
    state = isDark ? ThemeMode.light : ThemeMode.dark;
    await prefs.setBool('isDarkMode', !isDark);
  }

  Future<void> setDarkMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    state = value ? ThemeMode.dark : ThemeMode.light;
    await prefs.setBool('isDarkMode', value);
  }
}

class ShowSplashNotifier extends StateNotifier<bool> {
  ShowSplashNotifier() : super(true) {
    _loadSplash();
  }

  Future<void> _loadSplash() async {
    final prefs = await SharedPreferences.getInstance();
    state = prefs.getBool('showSplash') ?? true;
  }

  Future<void> toggleSplash() async {
    final prefs = await SharedPreferences.getInstance();
    state = !state;
    await prefs.setBool('showSplash', state);
  }

  Future<void> setSplash(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    state = value;
    await prefs.setBool('showSplash', value);
  }
}
