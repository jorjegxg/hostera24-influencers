import 'dart:io';

import 'package:hostera24/config/root_env.dart';

abstract final class ApiConfig {
  /// URL backend NestJS (din `.env` rădăcină sau --dart-define).
  static String get baseUrl {
    final fromFile = RootEnv.get('API_BASE_URL');
    if (fromFile.isNotEmpty) return fromFile;
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }
}
