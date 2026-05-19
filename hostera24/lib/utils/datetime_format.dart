/// Parsează timestamp-ul API ca instant UTC (ISO cu Z sau offset).
DateTime parseApiDateTime(String value) {
  final trimmed = value.trim();
  final hasOffset = trimmed.endsWith('Z') ||
      RegExp(r'[+-]\d{2}:\d{2}$').hasMatch(trimmed);
  final normalized = hasOffset ? trimmed : '${trimmed}Z';
  return DateTime.parse(normalized).toUtc();
}

/// Format: dd.MM.yyyy HH:mm în fusul orar local al dispozitivului.
String formatDateTimeLocal(DateTime value) {
  final local = value.toLocal();
  final day = local.day.toString().padLeft(2, '0');
  final month = local.month.toString().padLeft(2, '0');
  final year = local.year;
  final hour = local.hour.toString().padLeft(2, '0');
  final minute = local.minute.toString().padLeft(2, '0');
  return '$day.$month.$year $hour:$minute';
}