import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  final VoidCallback onComplete;

  const SplashScreen({super.key, required this.onComplete});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _particleController;
  late AnimationController _entranceController;
  late AnimationController _pulseController;
  
  final String _appName = "SNS ERP";

  @override
  void initState() {
    super.initState();
    _particleController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..forward();

    _entranceController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 500 + (_appName.length * 150)),
    )..forward();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    Future.delayed(const Duration(seconds: 5), widget.onComplete);
  }

  @override
  void dispose() {
    _particleController.dispose();
    _entranceController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.mainGradient),
        child: Stack(
          children: [
            // Background Particles
            IgnorePointer(
              child: AnimatedBuilder(
                animation: _particleController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: ParticlePainter(progress: _particleController.value),
                    child: Container(),
                  );
                },
              ),
            ),
            
            // Staggered App Name
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildStaggeredText(),
                  const SizedBox(height: 16),
                  // Animated underline
                  AnimatedBuilder(
                    animation: _entranceController,
                    builder: (context, child) {
                      return Container(
                        width: _entranceController.value * 250,
                        height: 2,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.transparent,
                              AppColors.primaryOrange,
                              AppColors.accentOrange,
                              Colors.transparent,
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStaggeredText() {
    return AnimatedBuilder(
      animation: Listenable.merge([_entranceController, _pulseController]),
      builder: (context, child) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(_appName.length, (index) {
            final start = (index * 0.1);
            final end = start + 0.4;
            final letterAnimation = CurvedAnimation(
              parent: _entranceController,
              curve: Interval(start.clamp(0.0, 1.0), end.clamp(0.0, 1.0), curve: Curves.easeOut),
            );

            return Transform.translate(
              offset: Offset(0, 20 * (1 - letterAnimation.value)),
              child: Opacity(
                opacity: letterAnimation.value,
                child: Text(
                  _appName[index],
                  style: TextStyle(
                    fontSize: 72,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: _appName[index] == ' ' ? 20 : 2,
                    shadows: [
                      Shadow(
                        color: AppColors.primaryOrange.withOpacity(_pulseController.value * 0.8),
                        blurRadius: 10 + (_pulseController.value * 20),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }
}

class ParticlePainter extends CustomPainter {
  final double progress;
  final int particleCount = 30;

  ParticlePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()..style = PaintingStyle.fill;

    for (int i = 0; i < particleCount; i++) {
      double particleDelay = i * 0.02;
      double particleProgress = (progress - particleDelay).clamp(0, 1);
      
      if (particleProgress <= 0 || particleProgress >= 1) continue;

      double angle = (i / particleCount) * math.pi * 2;
      double spiralAngle = angle + (particleProgress * math.pi * 2);
      double radius = (1 - particleProgress) * 250;
      
      double x = center.dx + math.cos(spiralAngle) * radius;
      double y = center.dy + math.sin(spiralAngle) * radius;

      paint.color = AppColors.primaryOrange.withOpacity((1 - particleProgress).clamp(0, 1));
      canvas.drawCircle(Offset(x, y), 4 * (1 - particleProgress), paint);
    }
  }

  @override
  bool shouldRepaint(covariant ParticlePainter oldDelegate) => oldDelegate.progress != progress;
}
