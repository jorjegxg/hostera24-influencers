import 'package:hostera24/config/web_config.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/utils/datetime_format.dart';

class QrEntry {
  const QrEntry({
    required this.id,
    required this.cod,
    this.firmaDescription,
    this.clientDescription,
    this.pret,
    this.reducere,
    required this.createdAt,
    this.numarScanari = 0,
    this.limitaScanari,
    this.scanariRamase,
    this.numarScanariRespinse = 0,
    this.schedule = const QrSchedule(),
  });

  final int id;
  final String cod;
  final String? firmaDescription;
  final String? clientDescription;
  final double? pret;
  final double? reducere;
  final DateTime createdAt;
  final int numarScanari;
  final int? limitaScanari;
  final int? scanariRamase;
  final int numarScanariRespinse;
  final QrSchedule schedule;

  bool get hasScanLimit => limitaScanari != null && limitaScanari! > 0;

  bool get isLimitReached =>
      hasScanLimit && numarScanari >= limitaScanari!;

  bool get isScannableNow => schedule.isActive && !isLimitReached;

  bool get canScanNow => isScannableNow;

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
      pret: _parseOptionalDouble(json['pret']),
      reducere: _parseOptionalDouble(json['reducere'] ?? json['pretRedus']),
      createdAt: parseApiDateTime(json['creatLa'] as String),
      numarScanari: json['numarScanari'] as int? ?? 0,
      limitaScanari: _parseOptionalInt(json['limitaScanari']),
      scanariRamase: _parseOptionalInt(json['scanariRamase']),
      numarScanariRespinse: json['numarScanariRespinse'] as int? ?? 0,
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
    double? pret,
    double? reducere,
    DateTime? createdAt,
    int? numarScanari,
    int? limitaScanari,
    int? scanariRamase,
    int? numarScanariRespinse,
    QrSchedule? schedule,
  }) {
    return QrEntry(
      id: id ?? this.id,
      cod: cod ?? this.cod,
      firmaDescription: firmaDescription ?? this.firmaDescription,
      clientDescription: clientDescription ?? this.clientDescription,
      pret: pret ?? this.pret,
      reducere: reducere ?? this.reducere,
      createdAt: createdAt ?? this.createdAt,
      numarScanari: numarScanari ?? this.numarScanari,
      limitaScanari: limitaScanari ?? this.limitaScanari,
      scanariRamase: scanariRamase ?? this.scanariRamase,
      numarScanariRespinse:
          numarScanariRespinse ?? this.numarScanariRespinse,
      schedule: schedule ?? this.schedule,
    );
  }
}

double? _parseOptionalDouble(Object? value) {
  if (value == null) return null;
  if (value is double) return value;
  if (value is int) return value.toDouble();
  if (value is num) return value.toDouble();
  if (value is String) {
    final trimmed = value.trim().replaceAll(',', '.');
    if (trimmed.isEmpty) return null;
    return double.tryParse(trimmed);
  }
  return null;
}

int? _parseOptionalInt(Object? value) {
  if (value == null) return null;
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String) return int.tryParse(value);
  return null;
}
