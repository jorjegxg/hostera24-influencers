import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_scan_stats.dart';
import 'package:hostera24/repositories/qr_repository.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/utils/qr_scan_stats_builder.dart';

class QrStatsScreen extends StatefulWidget {
  const QrStatsScreen({super.key, required this.entry});

  final QrEntry entry;

  @override
  State<QrStatsScreen> createState() => _QrStatsScreenState();
}

class _QrStatsScreenState extends State<QrStatsScreen> {
  final _repo = QrRepository();
  bool _loading = true;
  QrScanStats? _stats;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final scanari = await _repo.fetchAllCodQrScanari(widget.entry.id);
      final reusite = scanari.where((s) => s.reusit).toList();
      if (!mounted) return;
      setState(() {
        _stats = buildQrScanStats(reusite);
        _loading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = 'Eroare: $e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBg,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Statistici'),
            Text(
              widget.entry.cod,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: _loading ? null : _load,
            icon: const Icon(Icons.refresh),
            tooltip: 'Reîncarcă',
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(_error!, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _load,
                child: const Text('Încearcă din nou'),
              ),
            ],
          ),
        ),
      );
    }

    final stats = _stats!;
    if (stats.total == 0) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Text(
            'Nicio scanare încă.\nStatisticile vor apărea după primele scanări în magazin.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary, height: 1.5),
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          _SummaryGrid(stats: stats),
          const SizedBox(height: 16),
          _StatsCard(
            title: 'Scanări pe oră',
            subtitle: stats.peakHour != null
                ? 'Vârf: ${formatHourLabel(stats.peakHour!)}'
                : null,
            child: SizedBox(
              height: 220,
              child: _HourlyBarChart(stats: stats),
            ),
          ),
          const SizedBox(height: 16),
          _StatsCard(
            title: 'Scanări pe zi a săptămânii',
            subtitle: stats.peakWeekday != null
                ? 'Vârf: ${QrScanStats.weekdayLabels[stats.peakWeekday!]}'
                : null,
            child: SizedBox(
              height: 200,
              child: _WeekdayBarChart(stats: stats),
            ),
          ),
          const SizedBox(height: 16),
          _StatsCard(
            title: 'Ultimele 14 zile',
            subtitle: 'Scanări pe zi (calendaristic)',
            child: SizedBox(
              height: 220,
              child: _DailyBarChart(stats: stats),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryGrid extends StatelessWidget {
  const _SummaryGrid({required this.stats});

  final QrScanStats stats;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 1.55,
      children: [
        _SummaryTile(label: 'Total', value: '${stats.total}'),
        _SummaryTile(label: 'Azi', value: '${stats.today}'),
        _SummaryTile(label: 'Ultimele 7 zile', value: '${stats.last7Days}'),
        _SummaryTile(label: 'Ultimele 30 zile', value: '${stats.last30Days}'),
      ],
    );
  }
}

class _SummaryTile extends StatelessWidget {
  const _SummaryTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.accent,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatsCard extends StatelessWidget {
  const _StatsCard({
    required this.title,
    this.subtitle,
    required this.child,
  });

  final String title;
  final String? subtitle;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
            const SizedBox(height: 16),
            child,
          ],
        ),
      ),
    );
  }
}

class _HourlyBarChart extends StatelessWidget {
  const _HourlyBarChart({required this.stats});

  final QrScanStats stats;

  @override
  Widget build(BuildContext context) {
    return _BarChartBase(
      values: stats.byHour,
      maxY: stats.maxHourly,
      bottomLabels: (i) => i % 3 == 0 ? formatHourLabel(i) : '',
    );
  }
}

class _WeekdayBarChart extends StatelessWidget {
  const _WeekdayBarChart({required this.stats});

  final QrScanStats stats;

  @override
  Widget build(BuildContext context) {
    return _BarChartBase(
      values: stats.byWeekday,
      maxY: stats.maxWeekday,
      bottomLabels: (i) => QrScanStats.weekdayLabels[i],
    );
  }
}

class _DailyBarChart extends StatelessWidget {
  const _DailyBarChart({required this.stats});

  final QrScanStats stats;

  @override
  Widget build(BuildContext context) {
    final days = stats.last14DaysSorted;
    final values = days.map((e) => e.value).toList();
    final maxY = values.isEmpty ? 0 : values.reduce((a, b) => a > b ? a : b);

    return _BarChartBase(
      values: values,
      maxY: maxY,
      bottomLabels: (i) {
        if (i >= days.length) return '';
        if (days.length <= 7 || i % 2 == 0) {
          return formatDateKeyShort(days[i].key);
        }
        return '';
      },
    );
  }
}

class _BarChartBase extends StatelessWidget {
  const _BarChartBase({
    required this.values,
    required this.maxY,
    required this.bottomLabels,
  });

  final List<int> values;
  final int maxY;
  final String Function(int index) bottomLabels;

  @override
  Widget build(BuildContext context) {
    final yMax = maxY == 0 ? 1.0 : maxY.toDouble() * 1.15;

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: yMax,
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: yMax > 5 ? (yMax / 4).ceilToDouble() : 1,
          getDrawingHorizontalLine: (value) => FlLine(
            color: AppColors.border.withValues(alpha: 0.6),
            strokeWidth: 1,
          ),
        ),
        titlesData: FlTitlesData(
          show: true,
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 28,
              getTitlesWidget: (value, meta) {
                if (value == meta.max || value < 0) {
                  return const SizedBox.shrink();
                }
                return Text(
                  value.toInt().toString(),
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppColors.textSecondary,
                  ),
                );
              },
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 28,
              getTitlesWidget: (value, meta) {
                final i = value.toInt();
                final label = bottomLabels(i);
                if (label.isEmpty) return const SizedBox.shrink();
                return Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    label,
                    style: const TextStyle(
                      fontSize: 9,
                      color: AppColors.textSecondary,
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        barGroups: [
          for (var i = 0; i < values.length; i++)
            BarChartGroupData(
              x: i,
              barRods: [
                BarChartRodData(
                  toY: values[i].toDouble(),
                  color: AppColors.accent,
                  width: values.length > 16 ? 8 : 14,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(4),
                  ),
                ),
              ],
            ),
        ],
      ),
      duration: const Duration(milliseconds: 350),
    );
  }
}
