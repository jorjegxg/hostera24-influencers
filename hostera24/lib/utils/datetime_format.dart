/// Afișare ore în fusul orar fix GMT+2 (EET).
const Duration kGmtPlus2Offset = Duration(hours: 2);

/// Parsează timestamp-ul API ca UTC (Nest/MySQL trimit de obicei ISO UTC).
DateTime parseApiDateTime(String value) {
  final trimmed = value.trim();
  final hasOffset = trimmed.endsWith('Z') ||
      RegExp(r'[+-]\d{2}:\d{2}$').hasMatch(trimmed);
  final normalized = hasOffset ? trimmed : '${trimmed}Z';
  return DateTime.parse(normalized).toUtc();
}

DateTime toGmtPlus2(DateTime value) {
  final utc = value.isUtc ? value : value.toUtc();
  return utc.add(kGmtPlus2Offset);
}

/// Format: dd.MM.yyyy HH:mm (GMT+2)
String formatDateTimeGmtPlus2(DateTime value) {
  final d = toGmtPlus2(value);
  final day = d.day.toString().padLeft(2, '0');
  final month = d.month.toString().padLeft(2, '0');
  final year = d.year;
  final hour = d.hour.toString().padLeft(2, '0');
  final minute = d.minute.toString().padLeft(2, '0');
  return '$day.$month.$year $hour:$minute';
}
