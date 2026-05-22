import 'dart:io';

import 'package:hostera24/config/root_env.dart';

abstract final class ApiConfig {
  /// URL backend NestJS (din `.env` rădăcină sau --dart-define).
  static const int defaultPort = 3022;

  static String get baseUrl {
    final fromEnv = RootEnv.get('API_BASE_URL');
    if (fromEnv.isNotEmpty) return fromEnv.replaceAll(RegExp(r'/+$'), '');
    if (Platform.isAndroid) return 'http://10.0.2.2:$defaultPort';
    return 'http://127.0.0.1:$defaultPort';
  }
}
