class Angajat {
  const Angajat({
    required this.id,
    required this.email,
    this.nume,
    this.activat = false,
    this.creatLa,
  });

  final int id;
  final String email;
  final String? nume;

  /// true după ce angajatul s-a conectat prima dată cu Google.
  final bool activat;
  final DateTime? creatLa;

  factory Angajat.fromJson(Map<String, dynamic> json) {
    return Angajat(
      id: json['id'] as int,
      email: json['email'] as String,
      nume: json['nume'] as String?,
      activat: json['activat'] == true,
      creatLa: json['creatLa'] != null
          ? DateTime.tryParse(json['creatLa'] as String)
          : null,
    );
  }

  String get displayName =>
      (nume != null && nume!.trim().isNotEmpty) ? nume! : email;
}
