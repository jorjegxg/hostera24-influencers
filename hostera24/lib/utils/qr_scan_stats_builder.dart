import 'package:hostera24/models/qr_scan.dart';
import 'package:hostera24/models/qr_scan_stats.dart';

QrScanStats buildQrScanStats(List<QrScan> scanari) {
  final byHour = List<int>.filled(24, 0);
  final byWeekday = List<int>.filled(7, 0);
  final byDate = <String, int>{};

  final now = DateTime.now();
  final todayKey = _dateKey(now);
  final weekAgo = now.subtract(const Duration(days: 7));
  final monthAgo = now.subtract(const Duration(days: 30));

  var today = 0;
  var last7 = 0;
  var last30 = 0;

  for (final scan in scanari) {
    final local = scan.scanatLa.toLocal();
    final hour = local.hour;
    final weekday = local.weekday - 1;
    final dateKey = _dateKey(local);

    byHour[hour]++;
    byWeekday[weekday]++;
    byDate[dateKey] = (byDate[dateKey] ?? 0) + 1;

    if (dateKey == todayKey) today++;
    if (!local.isBefore(weekAgo)) last7++;
    if (!local.isBefore(monthAgo)) last30++;
  }

  return QrScanStats(
    total: scanari.length,
    today: today,
    last7Days: last7,
    last30Days: last30,
    byHour: byHour,
    byWeekday: byWeekday,
    byDate: byDate,
    peakHour: _peakIndex(byHour),
    peakWeekday: _peakIndex(byWeekday),
  );
}

String _dateKey(DateTime d) {
  final y = d.year.toString().padLeft(4, '0');
  final m = d.month.toString().padLeft(2, '0');
  final day = d.day.toString().padLeft(2, '0');
  return '$y-$m-$day';
}

int? _peakIndex(List<int> values) {
  if (values.every((v) => v == 0)) return null;
  var max = 0;
  var idx = 0;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
      idx = i;
    }
  }
  return idx;
}

String formatHourLabel(int hour) => '${hour.toString().padLeft(2, '0')}:00';

String formatDateKeyShort(String yyyyMmDd) {
  final parts = yyyyMmDd.split('-');
  if (parts.length != 3) return yyyyMmDd;
  return '${parts[2]}.${parts[1]}';
}
