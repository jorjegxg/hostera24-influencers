import 'dart:io';

/// Încarcă variabile din `.env` la rădăcina monorepo-ului (`../.env`).
abstract final class RootEnv {
  static final Map<String, String> _values = {};
  static var _loaded = false;

  static void load() {
    if (_loaded) return;
    _loaded = true;

    for (final path in const ['../.env', '../../.env', '.env']) {
      final file = File(path);
      if (!file.existsSync()) continue;
      _parseLines(file.readAsLinesSync());
      return;
    }
  }

  static void _parseLines(List<String> lines) {
    for (final raw in lines) {
      final line = raw.trim();
      if (line.isEmpty || line.startsWith('#')) continue;
      final eq = line.indexOf('=');
      if (eq <= 0) continue;
      final key = line.substring(0, eq).trim();
      var value = line.substring(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      _values[key] = value;
    }
  }

  /// [key] din `.env`; `--dart-define=KEY=...` are prioritate dacă e setat.
  static String get(String key, {String defaultValue = ''}) {
    final fromDefine = switch (key) {
      'API_BASE_URL' => const String.fromEnvironment('API_BASE_URL'),
      'WEB_BASE_URL' => const String.fromEnvironment('WEB_BASE_URL'),
      'FIREBASE_API_KEY' => const String.fromEnvironment('FIREBASE_API_KEY'),
      'FIREBASE_APP_ID' => const String.fromEnvironment('FIREBASE_APP_ID'),
      'FIREBASE_MESSAGING_SENDER_ID' =>
        const String.fromEnvironment('FIREBASE_MESSAGING_SENDER_ID'),
      'FIREBASE_PROJECT_ID' => const String.fromEnvironment('FIREBASE_PROJECT_ID'),
      'FIREBASE_STORAGE_BUCKET' =>
        const String.fromEnvironment('FIREBASE_STORAGE_BUCKET'),
      'FIREBASE_WEB_CLIENT_ID' =>
        const String.fromEnvironment('FIREBASE_WEB_CLIENT_ID'),
      'FIREBASE_ANDROID_CLIENT_ID' =>
        const String.fromEnvironment('FIREBASE_ANDROID_CLIENT_ID'),
      'FIREBASE_IOS_CLIENT_ID' => const String.fromEnvironment('FIREBASE_IOS_CLIENT_ID'),
      'FIREBASE_IOS_BUNDLE_ID' =>
        const String.fromEnvironment('FIREBASE_IOS_BUNDLE_ID'),
      _ => '',
    };
    if (fromDefine.isNotEmpty) return fromDefine;
    return _values[key] ?? defaultValue;
  }
}
