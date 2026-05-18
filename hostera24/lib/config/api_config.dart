import 'dart:io';

abstract final class ApiConfig {
  static const _fromEnv = String.fromEnvironment('API_BASE_URL');

  /// URL backend NestJS.
  /// - Emulator Android: `10.0.2.2` = localhost pe PC
  /// - Simulator iOS / desktop: `localhost`
  /// - Telefon fizic: `flutter run --dart-define=API_BASE_URL=http://IP_PC:3000`
  static String get baseUrl {
    if (_fromEnv.isNotEmpty) return _fromEnv;
    if (Platform.isAndroid) return 'http://10.0.2.2:3000';
    return 'http://localhost:3000';
  }
}
