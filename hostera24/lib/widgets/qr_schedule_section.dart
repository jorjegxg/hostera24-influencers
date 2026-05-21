import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/theme/app_colors.dart';

/// Formular programare scanare: oricând / interval date / zile săptămână.
class QrScheduleSection extends StatelessWidget {
  const QrScheduleSection({
    super.key,
    required this.schedule,
    required this.onChanged,
    this.enabled = true,
  });

  final QrSchedule schedule;
  final ValueChanged<QrSchedule> onChanged;
  final bool enabled;

  Future<void> _pickDate(
    BuildContext context, {
    required bool isStart,
  }) async {
    final initial = isStart
        ? (schedule.dateFrom ?? DateTime.now())
        : (schedule.dateTo ?? schedule.dateFrom ?? DateTime.now());
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );
    if (picked == null) return;

    if (isStart) {
      onChanged(schedule.copyWith(dateFrom: picked));
    } else {
      onChanged(schedule.copyWith(dateTo: picked));
    }
  }

  void _setMode(QrScheduleMode mode) {
    if (mode == schedule.mode) return;
    switch (mode) {
      case QrScheduleMode.none:
        onChanged(const QrSchedule());
      case QrScheduleMode.dateRange:
        final now = DateTime.now();
        onChanged(
          QrSchedule(
            mode: QrScheduleMode.dateRange,
            dateFrom: DateTime(now.year, now.month, now.day),
            dateTo: DateTime(now.year, now.month, now.day),
          ),
        );
      case QrScheduleMode.weekdays:
        onChanged(
          const QrSchedule(
            mode: QrScheduleMode.weekdays,
            weekdays: [2],
          ),
        );
    }
  }

  void _toggleWeekday(int day) {
    final set = schedule.weekdays.toSet();
    if (set.contains(day)) {
      set.remove(day);
    } else {
      set.add(day);
    }
    onChanged(schedule.copyWith(weekdays: set.toList()..sort()));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Când poate fi scanat',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Opțional. Dacă nu setezi nimic, codul poate fi scanat oricând.',
          style: TextStyle(
            color: AppColors.textSecondary,
            fontSize: 13,
            height: 1.35,
          ),
        ),
        const SizedBox(height: 12),
        SegmentedButton<QrScheduleMode>(
          segments: const [
            ButtonSegment(
              value: QrScheduleMode.none,
              label: Text('Oricând'),
              icon: Icon(Icons.all_inclusive, size: 18),
            ),
            ButtonSegment(
              value: QrScheduleMode.dateRange,
              label: Text('Interval'),
              icon: Icon(Icons.date_range_outlined, size: 18),
            ),
            ButtonSegment(
              value: QrScheduleMode.weekdays,
              label: Text('Zile'),
              icon: Icon(Icons.calendar_view_week_outlined, size: 18),
            ),
          ],
          selected: {schedule.mode},
          onSelectionChanged: enabled
              ? (set) {
                  if (set.isNotEmpty) _setMode(set.first);
                }
              : null,
        ),
        if (schedule.mode == QrScheduleMode.dateRange) ...[
          const SizedBox(height: 16),
          _DateField(
            label: 'De la data de',
            date: schedule.dateFrom,
            enabled: enabled,
            onTap: () => _pickDate(context, isStart: true),
          ),
          const SizedBox(height: 12),
          _DateField(
            label: 'Până la data de',
            date: schedule.dateTo,
            enabled: enabled,
            onTap: () => _pickDate(context, isStart: false),
          ),
        ],
        if (schedule.mode == QrScheduleMode.weekdays) ...[
          const SizedBox(height: 16),
          const Text(
            'Selectează zilele (ex: în fiecare marți)',
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: kQrWeekdays.entries.map((entry) {
              final selected = schedule.weekdays.contains(entry.key);
              return FilterChip(
                label: Text(entry.value),
                selected: selected,
                onSelected: enabled ? (_) => _toggleWeekday(entry.key) : null,
                selectedColor: AppColors.accent.withValues(alpha: 0.2),
                checkmarkColor: AppColors.accent,
              );
            }).toList(),
          ),
        ],
        if (schedule.mode != QrScheduleMode.none) ...[
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(
                schedule.isActive
                    ? Icons.check_circle_outline
                    : Icons.schedule_outlined,
                size: 18,
                color: schedule.isActive
                    ? AppColors.accent
                    : AppColors.textSecondary,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  schedule.isActive
                      ? 'Activ acum: ${schedule.summaryLabel}'
                      : 'Inactiv acum: ${schedule.summaryLabel}',
                  style: TextStyle(
                    fontSize: 13,
                    color: schedule.isActive
                        ? AppColors.accent
                        : AppColors.textSecondary,
                    height: 1.3,
                  ),
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

class _DateField extends StatelessWidget {
  const _DateField({
    required this.label,
    required this.date,
    required this.onTap,
    required this.enabled,
  });

  final String label;
  final DateTime? date;
  final VoidCallback onTap;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final text = date != null
        ? '${date!.day.toString().padLeft(2, '0')}.${date!.month.toString().padLeft(2, '0')}.${date!.year}'
        : 'Alege data';

    return InkWell(
      onTap: enabled ? onTap : null,
      borderRadius: BorderRadius.circular(12),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: const Icon(Icons.event_outlined),
          suffixIcon: const Icon(Icons.chevron_right),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: date != null
                ? AppColors.textPrimary
                : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}
