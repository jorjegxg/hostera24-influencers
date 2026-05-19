import 'dart:convert';

class QrEntry {
  const QrEntry({
    required this.id,
    required this.cod,
    this.firmaDescription,
    this.clientDescription,
    this.pretRedus,
    required this.createdAt,
  });

  final int id;
  final String cod;
  final String? firmaDescription;
  final String? clientDescription;
  final String? pretRedus;
  final DateTime createdAt;

  factory QrEntry.fromJson(Map<String, dynamic> json) {
    return QrEntry(
      id: json['id'] as int,
      cod: json['cod'] as String,
      firmaDescription: json['numePostareFirme'] as String?,
      clientDescription: json['numePostareClienti'] as String?,
      pretRedus: json['pretRedus'] as String?,
      createdAt: DateTime.parse(json['creatLa'] as String),
    );
  }

  String get payload {
    final map = <String, dynamic>{
      'cod': cod,
      'createdAt': createdAt.toIso8601String(),
    };
    if (firmaDescription != null) map['firma'] = firmaDescription;
    if (clientDescription != null) map['client'] = clientDescription;
    if (pretRedus != null) map['pretRedus'] = pretRedus;
    return jsonEncode(map);
  }

  QrEntry copyWith({
    int? id,
    String? cod,
    String? firmaDescription,
    String? clientDescription,
    String? pretRedus,
    DateTime? createdAt,
  }) {
    return QrEntry(
      id: id ?? this.id,
      cod: cod ?? this.cod,
      firmaDescription: firmaDescription ?? this.firmaDescription,
      clientDescription: clientDescription ?? this.clientDescription,
      pretRedus: pretRedus ?? this.pretRedus,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
