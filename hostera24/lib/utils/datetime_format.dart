import 'package:timezone/data/latest_all.dart' as tz_data;
import 'package:timezone/timezone.dart' as tz;

const _bucharest = 'Europe/Bucharest';

bool _timezonesReady = false;

/// Apelat o dată la pornirea app-ului (vezi [main.dart]).
void ensureTimezonesInitialized() {
  if (_timezonesReady) return;
  tz_data.initializeTimeZones();
  _timezonesReady = true;
}

tz.Location get _bucharestLocation {
  ensureTimezonesInitialized();
  return tz.getLocation(_bucharest);
}

/// Instant UTC → dată/oră în România (Europe/Bucharest).
DateTime toBucharest(DateTime value) {
  final utcMs = value.toUtc().millisecondsSinceEpoch;
  final ro = tz.TZDateTime.fromMillisecondsSinceEpoch(
    _bucharestLocation,
    utcMs,
  );
  return DateTime(ro.year, ro.month, ro.day, ro.hour, ro.minute, ro.second);
}

/// Parsează timestamp API (UTC Z, offset +03:00, sau fără offset = UTC).
DateTime parseApiDateTime(String value) {
  final trimmed = value.trim().replaceFirst(' ', 'T');
  final hasOffset = trimmed.endsWith('Z') ||
      RegExp(r'[+-]\d{2}:?\d{2}$').hasMatch(trimmed);
  if (hasOffset) {
    return DateTime.parse(trimmed).toUtc();
  }
  return DateTime.parse('${trimmed}Z').toUtc();
}

/// Format: dd.MM.yyyy HH:mm — ora României.
String formatDateTimeBucharest(DateTime value) {
  final ro = toBucharest(value);
  final day = ro.day.toString().padLeft(2, '0');
  final month = ro.month.toString().padLeft(2, '0');
  final year = ro.year;
  final hour = ro.hour.toString().padLeft(2, '0');
  final minute = ro.minute.toString().padLeft(2, '0');
  return '$day.$month.$year $hour:$minute';
}

/// Alias: afișare în fusul României.
String formatDateTimeLocal(DateTime value) => formatDateTimeBucharest(value);

/// „Acum” în calendarul României.
DateTime nowBucharest() => toBucharest(DateTime.now().toUtc());
