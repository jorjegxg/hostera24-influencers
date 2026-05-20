class FirmaProfile {
  const FirmaProfile({
    required this.id,
    required this.email,
    this.nume,
    this.telefon,
    this.descriere,
    this.website,
    this.logoUrl,
    this.creatLa,
  });

  final int id;
  final String email;
  final String? nume;
  final String? telefon;
  final String? descriere;
  final String? website;
  final String? logoUrl;
  final DateTime? creatLa;

  String get displayName =>
      (nume != null && nume!.trim().isNotEmpty) ? nume!.trim() : email;

  factory FirmaProfile.fromJson(Map<String, dynamic> json) {
    final creatLaRaw = json['creatLa'];
    return FirmaProfile(
      id: json['id'] as int,
      email: json['email'] as String,
      nume: json['nume'] as String?,
      telefon: json['telefon'] as String?,
      descriere: json['descriere'] as String?,
      website: json['website'] as String?,
      logoUrl: json['logoUrl'] as String?,
      creatLa: creatLaRaw is String ? DateTime.tryParse(creatLaRaw) : null,
    );
  }
}
