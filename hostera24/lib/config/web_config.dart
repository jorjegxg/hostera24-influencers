import 'dart:io';

import 'package:hostera24/config/root_env.dart';

abstract final class WebConfig {
  /// URL site public Next.js — link encodat în codurile QR.
  static String get baseUrl {
    final fromFile = RootEnv.get('WEB_BASE_URL');
    if (fromFile.isNotEmpty) {
      return fromFile.replaceAll(RegExp(r'/+$'), '');
    }
    if (Platform.isAndroid) return 'http://10.0.2.2:3023';
    return 'http://127.0.0.1:3023';
  }

  static String codQrPath(String cod) => '$baseUrl/coduri/$cod';
}
