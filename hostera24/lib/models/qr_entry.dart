import 'dart:convert';

class QrEntry {
  const QrEntry({
    required this.id,
    required this.cod,
    required this.firmaDescription,
    required this.clientDescription,
    required this.createdAt,
  });

  final int id;
  final String cod;
  final String firmaDescription;
  final String clientDescription;
  final DateTime createdAt;

  factory QrEntry.fromJson(Map<String, dynamic> json) {
    return QrEntry(
      id: json['id'] as int,
      cod: json['cod'] as String,
      firmaDescription: json['numePostareFirme'] as String,
      clientDescription: json['numePostareClienti'] as String,
      createdAt: DateTime.parse(json['creatLa'] as String),
    );
  }

  String get payload => jsonEncode({
        'cod': cod,
        'firma': firmaDescription,
        'client': clientDescription,
        'createdAt': createdAt.toIso8601String(),
      });

  QrEntry copyWith({
    int? id,
    String? cod,
    String? firmaDescription,
    String? clientDescription,
    DateTime? createdAt,
  }) {
    return QrEntry(
      id: id ?? this.id,
      cod: cod ?? this.cod,
      firmaDescription: firmaDescription ?? this.firmaDescription,
      clientDescription: clientDescription ?? this.clientDescription,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
