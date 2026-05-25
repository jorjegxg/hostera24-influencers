/// Formatare preț / reducere (lei) pentru afișare în UI.
String formatLei(double value) {
  final isWhole = value == value.truncateToDouble();
  final amount = isWhole
      ? value.toInt().toString()
      : value.toStringAsFixed(2).replaceAll('.', ',');
  return '$amount lei';
}

String? formatPretLabel(double? pret) {
  if (pret == null) return null;
  return formatLei(pret);
}

String? formatReducereLabel(double? reducere) {
  if (reducere == null || reducere <= 0) return null;
  return 'Reducere ${formatLei(reducere)}';
}

String? formatPretFinalLabel(double? pret, double? reducere) {
  if (pret == null) return null;
  if (reducere == null || reducere <= 0) return formatLei(pret);
  final finalPret = pret - reducere;
  if (finalPret <= 0) return formatLei(pret);
  return formatLei(finalPret);
}

double? parseOptionalLei(String raw) {
  final trimmed = raw.trim().replaceAll(',', '.');
  if (trimmed.isEmpty) return null;
  return double.tryParse(trimmed);
}
