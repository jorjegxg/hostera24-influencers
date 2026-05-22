import 'package:hostera24/utils/datetime_format.dart';

class QrScan {
  const QrScan({
    required this.id,
    required this.scanatLa,
    this.reusit = true,
  });

  final int id;
  final DateTime scanatLa;
  final bool reusit;

  factory QrScan.fromJson(Map<String, dynamic> json) {
    return QrScan(
      id: json['id'] as int,
      scanatLa: parseApiDateTime(json['scanatLa'] as String),
      reusit: json['reusit'] as bool? ?? true,
    );
  }

  String get formattedAt => formatDateTimeLocal(scanatLa);
}

String scanariCountLabel(int count) {
  if (count == 1) return '1 scanare';
  return '$count scanări';
}

String scanariCountLabelWithLimit(int count, int? limit) {
  if (limit == null || limit <= 0) return scanariCountLabel(count);
  return '$count / $limit';
}
