/// Tip programare scanare cod QR.
enum QrScheduleMode {
  /// Fără restricție — poate fi scanat oricând.
  none,

  /// Interval de date (inclusiv capetele).
  dateRange,

  /// Zile din săptămână (ISO: 1=luni … 7=duminică).
  weekdays,
}

/// Zile săptămână (ISO 8601) cu etichete în română.
const kQrWeekdays = <int, String>{
  1: 'Luni',
  2: 'Marți',
  3: 'Miercuri',
  4: 'Joi',
  5: 'Vineri',
  6: 'Sâmbătă',
  7: 'Duminică',
};

class QrSchedule {
  const QrSchedule({
    this.mode = QrScheduleMode.none,
    this.dateFrom,
    this.dateTo,
    this.weekdays = const [],
  });

  final QrScheduleMode mode;
  final DateTime? dateFrom;
  final DateTime? dateTo;
  final List<int> weekdays;

  factory QrSchedule.fromEntryFields({
    String? programareTip,
    String? programareDeLa,
    String? programarePanaLa,
    List<int>? programareZile,
  }) {
    if (programareTip == 'interval') {
      return QrSchedule(
        mode: QrScheduleMode.dateRange,
        dateFrom: _parseDateOnly(programareDeLa),
        dateTo: _parseDateOnly(programarePanaLa),
      );
    }
    if (programareTip == 'zile') {
      return QrSchedule(
        mode: QrScheduleMode.weekdays,
        weekdays: List<int>.from(programareZile ?? const []),
      );
    }
    return const QrSchedule();
  }

  Map<String, dynamic> toApiBody() {
    switch (mode) {
      case QrScheduleMode.none:
        return {'programareTip': null};
      case QrScheduleMode.dateRange:
        return {
          'programareTip': 'interval',
          'programareDeLa': _formatDateOnly(dateFrom),
          'programarePanaLa': _formatDateOnly(dateTo),
        };
      case QrScheduleMode.weekdays:
        return {
          'programareTip': 'zile',
          'programareZile': weekdays.toList()..sort(),
        };
    }
  }

  bool get isActive => isQrScannableNow(this);

  String get summaryLabel => formatQrScheduleSummary(this);

  QrSchedule copyWith({
    QrScheduleMode? mode,
    DateTime? dateFrom,
    DateTime? dateTo,
    List<int>? weekdays,
    bool clearDates = false,
  }) {
    return QrSchedule(
      mode: mode ?? this.mode,
      dateFrom: clearDates ? null : (dateFrom ?? this.dateFrom),
      dateTo: clearDates ? null : (dateTo ?? this.dateTo),
      weekdays: weekdays ?? this.weekdays,
    );
  }
}

bool isQrScannableNow(QrSchedule schedule, [DateTime? now]) {
  final local = (now ?? DateTime.now()).toLocal();

  switch (schedule.mode) {
    case QrScheduleMode.none:
      return true;
    case QrScheduleMode.dateRange:
      final from = schedule.dateFrom;
      final to = schedule.dateTo;
      if (from == null || to == null) return true;
      final today = DateTime(local.year, local.month, local.day);
      final start = DateTime(from.year, from.month, from.day);
      final end = DateTime(to.year, to.month, to.day);
      return !today.isBefore(start) && !today.isAfter(end);
    case QrScheduleMode.weekdays:
      if (schedule.weekdays.isEmpty) return true;
      return schedule.weekdays.contains(local.weekday);
  }
}

String formatQrScheduleSummary(QrSchedule schedule) {
  switch (schedule.mode) {
    case QrScheduleMode.none:
      return 'Oricând';
    case QrScheduleMode.dateRange:
      final from = schedule.dateFrom;
      final to = schedule.dateTo;
      if (from == null || to == null) return 'Interval de date';
      return 'De la ${_formatRo(from)} până la ${_formatRo(to)}';
    case QrScheduleMode.weekdays:
      if (schedule.weekdays.isEmpty) return 'Zile din săptămână';
      final sorted = schedule.weekdays.toList()..sort();
      final names = sorted
          .map((d) => kQrWeekdays[d] ?? '')
          .where((s) => s.isNotEmpty)
          .join(', ');
      return 'În fiecare $names';
  }
}

String? blockMessageForSchedule(QrSchedule schedule) {
  if (isQrScannableNow(schedule)) return null;
  switch (schedule.mode) {
    case QrScheduleMode.none:
      return null;
    case QrScheduleMode.dateRange:
      final from = schedule.dateFrom;
      final to = schedule.dateTo;
      if (from != null && to != null) {
        return 'Codul poate fi scanat doar între ${_formatRo(from)} și ${_formatRo(to)}.';
      }
      return 'Codul nu este activ în intervalul setat.';
    case QrScheduleMode.weekdays:
      final sorted = schedule.weekdays.toList()..sort();
      final labels = sorted
          .map((d) => kQrWeekdays[d]?.toLowerCase() ?? '')
          .where((s) => s.isNotEmpty)
          .join(', ');
      if (labels.isNotEmpty) {
        return 'Codul poate fi scanat doar în: $labels.';
      }
      return 'Codul nu este activ în zilele setate.';
  }
}

DateTime? _parseDateOnly(String? value) {
  if (value == null || value.trim().isEmpty) return null;
  final parts = value.trim().split('-');
  if (parts.length != 3) return null;
  final y = int.tryParse(parts[0]);
  final m = int.tryParse(parts[1]);
  final d = int.tryParse(parts[2]);
  if (y == null || m == null || d == null) return null;
  return DateTime(y, m, d);
}

String? _formatDateOnly(DateTime? value) {
  if (value == null) return null;
  final y = value.year.toString().padLeft(4, '0');
  final m = value.month.toString().padLeft(2, '0');
  final d = value.day.toString().padLeft(2, '0');
  return '$y-$m-$d';
}

String _formatRo(DateTime date) {
  final d = date.day.toString().padLeft(2, '0');
  final m = date.month.toString().padLeft(2, '0');
  return '$d.$m.${date.year}';
}
