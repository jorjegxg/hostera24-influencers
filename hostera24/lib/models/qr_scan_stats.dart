/// Statistici agregate pentru scanările unui cod QR.
class QrScanStats {
  const QrScanStats({
    required this.total,
    required this.today,
    required this.last7Days,
    required this.last30Days,
    required this.byHour,
    required this.byWeekday,
    required this.byDate,
    required this.peakHour,
    required this.peakWeekday,
  });

  final int total;
  final int today;
  final int last7Days;
  final int last30Days;

  /// Index 0–23 → număr scanări în acea oră (fus local).
  final List<int> byHour;

  /// Index 0 = luni … 6 = duminică.
  final List<int> byWeekday;

  /// Cheie yyyy-MM-dd (local) → număr scanări.
  final Map<String, int> byDate;

  final int? peakHour;
  final int? peakWeekday;

  static const weekdayLabels = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

  int get maxHourly => byHour.isEmpty ? 0 : byHour.reduce((a, b) => a > b ? a : b);

  int get maxWeekday =>
      byWeekday.isEmpty ? 0 : byWeekday.reduce((a, b) => a > b ? a : b);

  List<MapEntry<String, int>> get last14DaysSorted {
    final keys = byDate.keys.toList()..sort();
    if (keys.length <= 14) {
      return keys.map((k) => MapEntry(k, byDate[k]!)).toList();
    }
    return keys
        .sublist(keys.length - 14)
        .map((k) => MapEntry(k, byDate[k]!))
        .toList();
  }
}
