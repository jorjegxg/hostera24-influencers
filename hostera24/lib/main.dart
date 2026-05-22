import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hostera24/config/api_config.dart';
import 'package:hostera24/config/web_config.dart';
import 'package:hostera24/config/root_env.dart';
import 'package:hostera24/firebase/firebase_bootstrap.dart';
import 'package:hostera24/screens/login_screen.dart';
import 'package:hostera24/screens/home_shell.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/services/sync_service.dart';
import 'package:hostera24/theme/app_theme.dart';
import 'package:hostera24/utils/datetime_format.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  ensureTimezonesInitialized();
  RootEnv.load();
  if (kDebugMode) {
    debugPrint('[Hostera24] API: ${ApiConfig.baseUrl}');
    debugPrint('[Hostera24] Web: ${WebConfig.baseUrl}');
  }
  await FirebaseBootstrap.initialize();
  await NetworkService.instance.initialize();
  SyncService.instance.initialize();
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
    if (AuthService.instance.isLoggedIn) {
      await SyncService.instance.syncPendingScans();
    }
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
