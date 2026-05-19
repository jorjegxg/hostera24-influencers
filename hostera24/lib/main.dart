import 'package:flutter/material.dart';
import 'package:hostera24/screens/login_screen.dart';
import 'package:hostera24/screens/home_shell.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/theme/app_theme.dart';

void main() {
  runApp(const Hostera24App());
}

class Hostera24App extends StatefulWidget {
  const Hostera24App({super.key});

  @override
  State<Hostera24App> createState() => _Hostera24AppState();
}

class _Hostera24AppState extends State<Hostera24App> {
  Widget? _home;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await AuthService.instance.restoreSession();
    if (!mounted) return;
    setState(() {
      final session = AuthService.instance.session;
      _home = session != null
          ? HomeShell(email: session.email)
          : const LoginScreen();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hostera24 QR',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: _home ??
          const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          ),
    );
  }
}
