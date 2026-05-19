import 'package:hostera24/models/qr_scan.dart';

class QrScanPage {
  const QrScanPage({
    required this.scanari,
    required this.total,
    required this.page,
    required this.hasMore,
  });

  final List<QrScan> scanari;
  final int total;
  final int page;
  final bool hasMore;

  factory QrScanPage.fromJson(Map<String, dynamic> json) {
    return QrScanPage(
      scanari: (json['scanari'] as List<dynamic>? ?? [])
          .map((item) => QrScan.fromJson(item as Map<String, dynamic>))
          .toList(),
      total: json['total'] as int? ?? 0,
      page: json['page'] as int? ?? 1,
      hasMore: json['hasMore'] as bool? ?? false,
    );
  }
}
