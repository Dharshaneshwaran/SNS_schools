import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_flutter/main.dart';

void main() {
  testWidgets('Login page renders', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('Login from Flutter'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
    expect(find.text('SNS ERP'), findsOneWidget);
  });
}
