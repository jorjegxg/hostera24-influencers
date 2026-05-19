class ScanResult {
  const ScanResult({
    required this.status,
    this.cod,
    this.numePostareClienti,
    this.numePostareFirme,
    this.pretRedus,
  });

  final ScanStatus status;
  final String? cod;
  final String? numePostareClienti;
  final String? numePostareFirme;
  final String? pretRedus;

  bool get isOwn => status == ScanStatus.own;
  bool get isNotFound => status == ScanStatus.notFound;

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
      pretRedus: json['pretRedus'] as String?,
    );
  }
}

enum ScanStatus { own, other, notFound }
