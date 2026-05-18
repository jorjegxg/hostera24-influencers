import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hostera24/main.dart';

void main() {
  testWidgets('Login screen is shown on launch', (WidgetTester tester) async {
    await tester.pumpWidget(const Hostera24App());

    expect(find.text('Autentificare'), findsOneWidget);
    expect(find.text('Intră în cont'), findsOneWidget);
  });

  testWidgets('Can navigate to QR creator after login', (WidgetTester tester) async {
    await tester.pumpWidget(const Hostera24App());

    await tester.enterText(find.byType(TextFormField).at(0), 'admin');
    await tester.enterText(find.byType(TextFormField).at(1), 'parola');
    await tester.tap(find.text('Intră în cont'));
    await tester.pumpAndSettle();

    expect(find.text('Creator QR'), findsOneWidget);
    expect(find.text('Generează cod QR'), findsOneWidget);
  });
}
