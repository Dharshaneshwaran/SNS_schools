import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_flutter/app.dart';

void main() {
  testWidgets('App boots', (WidgetTester tester) async {
    await tester.pumpWidget(const SnsErpApp());

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
