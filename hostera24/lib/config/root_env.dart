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
      _ => '',
    };
    if (fromDefine.isNotEmpty) return fromDefine;
    return _values[key] ?? defaultValue;
  }
}
