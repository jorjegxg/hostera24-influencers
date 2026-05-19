import 'dart:convert';

/// Extrage codul QR din payload-ul scanat (URL sau cod simplu).
String? extractCodFromPayload(String raw) {
  var trimmed = raw.trim();
  if (trimmed.isEmpty) return null;

  trimmed = trimmed.replaceAll(RegExp(r'[\u200B-\u200D\uFEFF]'), '');

  final fromUrl = RegExp(r'/coduri/([^/?#\s]+)', caseSensitive: false)
      .firstMatch(trimmed);
  if (fromUrl != null) {
    final segment = Uri.decodeComponent(fromUrl.group(1)!);
    if (segment.isNotEmpty) return segment.trim();
  }

  if (trimmed.startsWith('{')) {
    try {
      final parsed = jsonDecode(trimmed) as Map<String, dynamic>;
      final cod = parsed['cod'];
      if (cod is String && cod.trim().isNotEmpty) return cod.trim();
    } catch (_) {
      return null;
    }
  }

  if (RegExp(r'^H24-[A-F0-9]+$', caseSensitive: false).hasMatch(trimmed)) {
    return trimmed.toUpperCase();
  }

  if (RegExp(r'^[A-Z0-9][A-Z0-9-]+$', caseSensitive: false).hasMatch(trimmed)) {
    return trimmed.toUpperCase();
  }

  return null;
}
