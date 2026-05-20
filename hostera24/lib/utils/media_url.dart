import 'package:hostera24/config/api_config.dart';

/// Logo-uri salvate pe server folosesc /uploads/... — aliniem host-ul la API_BASE_URL.
String? resolveUploadsMediaUrl(String? url) {
  if (url == null || url.trim().isEmpty) return null;

  final trimmed = url.trim();
  final idx = trimmed.indexOf('/uploads/');
  if (idx < 0) return trimmed;

  final suffix = trimmed.substring(idx + '/uploads'.length);
  final base = ApiConfig.baseUrl.replaceAll(RegExp(r'/+$'), '');
  return '$base/uploads$suffix';
}
