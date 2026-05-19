import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_scan.dart';

class QrEntryDetail {
  const QrEntryDetail({
    required this.entry,
    required this.scanari,
  });

  final QrEntry entry;
  final List<QrScan> scanari;

  int get numarScanari => entry.numarScanari;

  factory QrEntryDetail.fromJson(Map<String, dynamic> json) {
    return QrEntryDetail(
      entry: QrEntry.fromJson(json),
      scanari: (json['scanari'] as List<dynamic>? ?? [])
          .map((item) => QrScan.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
