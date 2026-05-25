class ScanResult {
  const ScanResult({
    required this.status,
    this.cod,
    this.numePostareClienti,
    this.numePostareFirme,
    this.pret,
    this.pretRedus,
    this.numarScanari,
    this.mesajProgramare,
    this.mesajLimita,
    this.limitaScanari,
    this.scanariRamase,
    this.numarScanariRespinse,
    this.inregistrat,
    this.queuedOffline = false,
  });

  final ScanStatus status;
  final String? cod;
  final String? numePostareClienti;
  final String? numePostareFirme;
  final String? pret;
  final String? pretRedus;
  final int? numarScanari;
  final String? mesajProgramare;
  final String? mesajLimita;
  final int? limitaScanari;
  final int? scanariRamase;
  final int? numarScanariRespinse;
  final bool? inregistrat;
  final bool queuedOffline;

  bool get isOwn => status == ScanStatus.own;
  bool get isNotFound => status == ScanStatus.notFound;
  bool get isQueued => status == ScanStatus.queued;
  bool get isUnavailable => status == ScanStatus.unavailable;
  bool get isExhausted => status == ScanStatus.exhausted;

  factory ScanResult.fromJson(Map<String, dynamic> json) {
    final statusRaw = json['status'] as String;
    return ScanResult(
      status: ScanStatus.values.firstWhere(
        (s) => s.name == statusRaw,
        orElse: () => ScanStatus.notFound,
      ),
      cod: json['cod'] as String?,
      numePostareClienti: json['numePostareClienti'] as String?,
      numePostareFirme: json['numePostareFirme'] as String?,
      pret: json['pret'] as String?,
      pretRedus: json['pretRedus'] as String?,
      numarScanari: _parseInt(json['numarScanari']),
      mesajProgramare: json['mesajProgramare'] as String?,
      mesajLimita: json['mesajLimita'] as String?,
      limitaScanari: _parseInt(json['limitaScanari']),
      scanariRamase: _parseInt(json['scanariRamase']),
      numarScanariRespinse: _parseInt(json['numarScanariRespinse']),
      inregistrat: json['inregistrat'] as bool?,
    );
  }
}

enum ScanStatus { own, other, notFound, queued, unavailable, exhausted }

int? _parseInt(Object? value) {
  if (value == null) return null;
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String) return int.tryParse(value);
  return null;
}
