import 'package:hostera24/models/qr_entry.dart';

class QrEntryDetail {
  const QrEntryDetail({required this.entry});

  final QrEntry entry;

  int get numarScanari => entry.numarScanari;

  factory QrEntryDetail.fromJson(Map<String, dynamic> json) {
    return QrEntryDetail(entry: QrEntry.fromJson(json));
  }
}
