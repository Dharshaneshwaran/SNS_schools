import 'package:flutter/material.dart';

class TransportTab extends StatelessWidget {
  const TransportTab({super.key});

  @override
  Widget build(BuildContext context) {
    final busInfo = {
      'routeNo': 'Route 7B',
      'stops': ['SNS Academy', 'Saibaba Colony', 'Gandhipuram', 'RS Puram', 'Peelamedu'],
      'pickup': '7:45 AM',
      'drop': '4:30 PM',
      'busNo': 'TN 33 Z 9901',
      'driverName': 'Ramesh Kumar',
      'driverPhone': '+91 94440 12345',
      'license': 'TN 33 AB 5678'
    };

    final stops = busInfo['stops'] as List<String>;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // 1. Route Summary
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(busInfo['routeNo'] as String, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text('Bus No: ${busInfo['busNo']}', style: TextStyle(color: Colors.grey[600], fontSize: 14)),
                      ],
                    ),
                    const Icon(Icons.directions_bus, color: Color(0xFFFF7F50), size: 36),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFFFF7F50).withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                        child: Column(
                          children: [
                            const Text('Pick-up', style: TextStyle(color: Color(0xFFFF7F50), fontSize: 12, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(busInfo['pickup'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                        child: Column(
                          children: [
                            const Text('Drop-off', style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Text(busInfo['drop'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                const Text('ROUTE STOPS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
                const SizedBox(height: 12),
                ...List.generate(stops.length, (index) {
                  final stopName = stops[index];
                  final isFirst = index == 0;
                  final isLast = index == stops.length - 1;
                  Color dotColor = Colors.grey[400]!;
                  if (isFirst) dotColor = const Color(0xFFFF7F50);
                  if (isLast) dotColor = Colors.green;

                  return Row(
                    children: [
                      Column(
                        children: [
                          Icon(Icons.circle, size: 12, color: dotColor),
                          if (!isLast) Container(width: 2, height: 24, color: Colors.grey[300]),
                        ],
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          stopName + (isFirst ? ' (Start)' : isLast ? ' (School)' : ''),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: (isFirst || isLast) ? FontWeight.bold : FontWeight.normal,
                            color: isFirst ? const Color(0xFFFF7F50) : isLast ? Colors.green : Colors.black,
                          ),
                        ),
                      ),
                    ],
                  );
                }),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // 2. Driver Info
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Driver Information', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: const Color(0xFFFF7F50).withOpacity(0.1),
                      child: const Icon(Icons.person, color: Color(0xFFFF7F50)),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(busInfo['driverName'] as String, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text('License: ${busInfo['license']}', style: TextStyle(color: Colors.grey[600], fontSize: 13)),
                      ],
                    )
                  ],
                ),
                const Divider(height: 32),
                Row(
                  children: [
                    const Icon(Icons.phone, color: Color(0xFFFF7F50), size: 18),
                    const SizedBox(width: 8),
                    Text(busInfo['driverPhone'] as String, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
