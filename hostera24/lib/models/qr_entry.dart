import 'package:hostera24/config/web_config.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/utils/datetime_format.dart';

class QrEntry {
  const QrEntry({
    required this.id,
    required this.cod,
    this.firmaDescription,
    this.clientDescription,
    this.pretRedus,
    required this.createdAt,
    this.numarScanari = 0,
    this.schedule = const QrSchedule(),
  });

  final int id;
  final String cod;
  final String? firmaDescription;
  final String? clientDescription;
  final String? pretRedus;
  final DateTime createdAt;
  final int numarScanari;
  final QrSchedule schedule;

  bool get isScannableNow => schedule.isActive;

  factory QrEntry.fromJson(Map<String, dynamic> json) {
    final zileRaw = json['programareZile'];
    List<int>? zile;
    if (zileRaw is List) {
      zile = zileRaw.map((e) => (e as num).toInt()).toList();
    }

    return QrEntry(
      id: json['id'] as int,
      cod: json['cod'] as String,
      firmaDescription: json['numePostareFirme'] as String?,
      clientDescription: json['numePostareClienti'] as String?,
      pretRedus: json['pretRedus'] as String?,
      createdAt: parseApiDateTime(json['creatLa'] as String),
      numarScanari: json['numarScanari'] as int? ?? 0,
      schedule: QrSchedule.fromEntryFields(
        programareTip: json['programareTip'] as String?,
        programareDeLa: json['programareDeLa'] as String?,
        programarePanaLa: json['programarePanaLa'] as String?,
        programareZile: zile,
      ),
    );
  }

  /// URL encodat în codul QR (pagina publică Next.js).
  String get payload => WebConfig.codQrPath(cod);

  QrEntry copyWith({
    int? id,
    String? cod,
    String? firmaDescription,
    String? clientDescription,
    String? pretRedus,
    DateTime? createdAt,
    int? numarScanari,
    QrSchedule? schedule,
  }) {
    return QrEntry(
      id: id ?? this.id,
      cod: cod ?? this.cod,
      firmaDescription: firmaDescription ?? this.firmaDescription,
      clientDescription: clientDescription ?? this.clientDescription,
      pretRedus: pretRedus ?? this.pretRedus,
      createdAt: createdAt ?? this.createdAt,
      numarScanari: numarScanari ?? this.numarScanari,
      schedule: schedule ?? this.schedule,
    );
  }
}
