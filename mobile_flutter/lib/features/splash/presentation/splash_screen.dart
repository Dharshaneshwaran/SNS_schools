import 'dart:math' as math;
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  final VoidCallback onFinish;
  const SplashScreen({required this.onFinish, super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  bool _disposed = false;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2600),
    );
    _ctrl.forward().then((_) {
      if (!_disposed) widget.onFinish();
    });
  }

  @override
  void dispose() {
    _disposed = true;
    _ctrl.dispose();
    super.dispose();
  }

  // Shorthand: evaluate a curve interval at the current controller value
  double _interval(double start, double end, [Curve curve = Curves.easeOut]) {
    return Interval(start, end, curve: curve).transform(_ctrl.value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: RepaintBoundary(
        child: AnimatedBuilder(
          animation: _ctrl,
          builder: (context, _) {
            // ── Final dissolve: everything rises and fades ──
            final dissolve = _interval(0.84, 1.0, Curves.easeIn);
            final riseUp = _interval(0.82, 1.0, Curves.easeInCubic);

            return Transform.translate(
              offset: Offset(0, -80 * riseUp),
              child: Opacity(
                opacity: (1.0 - dissolve).clamp(0.0, 1.0),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildIcon(),
                      const SizedBox(height: 32),
                      _buildLetterRow(),
                      const SizedBox(height: 16),
                      _buildUnderline(),
                      const SizedBox(height: 14),
                      _buildTagline(),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ───────────────────────────────────────────────
  // 1. Icon — elastic pop-in with breathing glow
  // ───────────────────────────────────────────────
  Widget _buildIcon() {
    final fade = _interval(0.0, 0.12);
    final scale = _interval(0.0, 0.28, Curves.elasticOut);
    final glow = _interval(0.15, 0.45, Curves.easeInOut);

    return Opacity(
      opacity: fade.clamp(0.0, 1.0),
      child: Transform.scale(
        scale: scale.clamp(0.01, 1.15),
        child: Container(
          width: 86,
          height: 86,
          decoration: BoxDecoration(
            color: const Color(0xFFFF7F50),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: Color.fromRGBO(255, 127, 80, 0.12 + glow * 0.28),
                blurRadius: 28 + glow * 24,
                spreadRadius: glow * 10,
              ),
            ],
          ),
          child: const Icon(Icons.school_rounded, color: Colors.white, size: 40),
        ),
      ),
    );
  }

  // ───────────────────────────────────────────────
  // 2. Letters — staggered slide-up with shimmer
  // ───────────────────────────────────────────────
  Widget _buildLetterRow() {
    const snsLetters = ['S', 'N', 'S'];
    const erpLetters = ['E', 'R', 'P'];

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // SNS — dark letters
        ...snsLetters.asMap().entries.map((e) {
          return _staggeredLetter(
            letter: e.value,
            index: e.key,
            color: const Color(0xFF1A1A1A),
          );
        }),
        const SizedBox(width: 12),
        // ERP — coral letters
        ...erpLetters.asMap().entries.map((e) {
          return _staggeredLetter(
            letter: e.value,
            index: e.key + 3, // offset for stagger timing
            color: const Color(0xFFFF7F50),
          );
        }),
      ],
    );
  }

  Widget _staggeredLetter({
    required String letter,
    required int index,
    required Color color,
  }) {
    // Each letter enters 40ms after the previous one
    final baseStart = 0.16 + index * 0.03;
    final baseEnd = baseStart + 0.14;

    final fade = _interval(baseStart, baseEnd);
    final slideUp = _interval(baseStart, baseEnd, Curves.easeOutCubic);

    // Shimmer: a brightness wave sweeps left→right across all letters
    final shimmerCenter = _interval(0.55, 0.75, Curves.linear);
    // Each letter has a slightly offset shimmer peak
    final letterPhase = index / 6.0;
    final shimmerDist = (shimmerCenter - letterPhase).abs();
    final shimmerIntensity = (1.0 - (shimmerDist * 5.0)).clamp(0.0, 1.0);
    // Smooth triangle wave
    final shimmerGlow = math.sin(shimmerIntensity * math.pi) * 0.45;

    final displayColor = Color.lerp(color, Colors.white, shimmerGlow) ?? color;

    return Opacity(
      opacity: fade.clamp(0.0, 1.0),
      child: Transform.translate(
        offset: Offset(0, 24 * (1.0 - slideUp)),
        child: Text(
          letter,
          style: TextStyle(
            color: displayColor,
            fontSize: 46,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            height: 1,
          ),
        ),
      ),
    );
  }

  // ───────────────────────────────────────────────
  // 3. Expanding gradient underline
  // ───────────────────────────────────────────────
  Widget _buildUnderline() {
    final expand = _interval(0.48, 0.62, Curves.easeOutCubic);

    return Container(
      width: 150 * expand,
      height: 3,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(2),
        gradient: const LinearGradient(
          colors: [Color(0xFFFF7F50), Color(0xFFFFBB99)],
        ),
      ),
    );
  }

  // ───────────────────────────────────────────────
  // 4. Tagline fade-in
  // ───────────────────────────────────────────────
  Widget _buildTagline() {
    final fade = _interval(0.54, 0.68);

    return Opacity(
      opacity: fade.clamp(0.0, 1.0),
      child: const Text(
        'Empowering Education',
        style: TextStyle(
          color: Color(0xFFAAAAAA),
          fontSize: 12,
          fontWeight: FontWeight.w400,
          letterSpacing: 2.8,
        ),
      ),
    );
  }
}
