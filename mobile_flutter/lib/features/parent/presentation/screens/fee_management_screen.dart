import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class FeeManagementScreen extends StatelessWidget {
  const FeeManagementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fee Management'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: AppColors.orangeGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Outstanding Balance', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  SizedBox(height: 8),
                  Text('₹ 12,500', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Icon(Icons.calendar_today, color: Colors.white70, size: 14),
                      SizedBox(width: 8),
                      Text('Due Date: 15 Oct 2026', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            Text('Fee Breakdown', style: Theme.of(context).textTheme.displayMedium),
            const SizedBox(height: 16),
            _buildFeeItem('Tuition Fee', '₹ 25,000', true),
            _buildFeeItem('Transport Fee', '₹ 5,000', false),
            _buildFeeItem('Library Fee', '₹ 1,500', true),
            _buildFeeItem('Uniform & Books', '₹ 8,500', false),

            const SizedBox(height: 32),
            Text('Recent Payments', style: Theme.of(context).textTheme.displayMedium),
            const SizedBox(height: 16),
            _buildPaymentTile('15 Sep 2026', '₹ 10,000', 'Success'),
            _buildPaymentTile('10 Jul 2026', '₹ 15,000', 'Success'),
            
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Pay Online Now'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeeItem(String label, String amount, bool isPaid) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
            Row(
              children: [
                Text(amount, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(width: 12),
                Icon(
                  isPaid ? Icons.check_circle : Icons.error_outline,
                  color: isPaid ? AppColors.success : AppColors.error,
                  size: 16,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentTile(String date, String amount, String status) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(date, style: const TextStyle(fontWeight: FontWeight.bold)),
              const Text('Receipt #RCP-9021', style: TextStyle(color: Colors.white38, fontSize: 11)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(amount, style: const TextStyle(color: AppColors.success, fontWeight: FontWeight.bold)),
              Text(status, style: const TextStyle(color: AppColors.success, fontSize: 11)),
            ],
          ),
        ],
      ),
    );
  }
}
