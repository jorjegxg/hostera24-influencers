import 'package:hostera24/utils/datetime_format.dart';

class QrScan {
  const QrScan({
    required this.id,
    required this.scanatLa,
  });

  final int id;
  final DateTime scanatLa;

  factory QrScan.fromJson(Map<String, dynamic> json) {
    return QrScan(
      id: json['id'] as int,
      scanatLa: parseApiDateTime(json['scanatLa'] as String),
    );
  }

  String get formattedAt => formatDateTimeGmtPlus2(scanatLa);
}

String scanariCountLabel(int count) {
  if (count == 1) return '1 scanare';
  return '$count scanări';
}
