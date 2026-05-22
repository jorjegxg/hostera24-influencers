import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/models/qr_scan.dart';
import 'package:hostera24/screens/add_qr_screen.dart';
import 'package:hostera24/screens/qr_stats_screen.dart';
import 'package:hostera24/repositories/qr_repository.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/widgets/error_snackbar.dart';
import 'package:hostera24/widgets/qr_entry_card.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';

class QrCreatorScreen extends StatefulWidget {
  const QrCreatorScreen({super.key});

  @override
  State<QrCreatorScreen> createState() => _QrCreatorScreenState();
}

class _QrCreatorScreenState extends State<QrCreatorScreen> {
  final _repo = QrRepository();
  final List<QrEntry> _entries = [];
  bool _isLoading = true;
  bool _fromCache = false;

  @override
  void initState() {
    super.initState();
    _loadEntries();
  }

  Future<void> _loadEntries() async {
    setState(() => _isLoading = true);
    try {
      final entries = await _repo.fetchCoduriQr();
      if (!mounted) return;
      setState(() {
        _entries
          ..clear()
          ..addAll(entries);
        _fromCache = !NetworkService.instance.isOnline;
      });
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare la încărcare: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _openAddScreen() async {
    try {
      NetworkService.instance.requireOnline(
        'Crearea unui cod QR necesită internet.',
      );
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
      return;
    }

    final entry = await Navigator.of(context).push<QrEntry>(
      MaterialPageRoute<QrEntry>(
        builder: (_) => const AddQrScreen(),
      ),
    );

    if (!mounted || entry == null) return;

    setState(() => _entries.insert(0, entry));

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Cod QR generat cu succes')),
    );
  }

  Future<void> _openEditScreen(QrEntry entry) async {
    try {
      NetworkService.instance.requireOnline(
        'Editarea codului QR necesită internet.',
      );
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
      return;
    }

    final updated = await Navigator.of(context).push<QrEntry>(
      MaterialPageRoute<QrEntry>(
        builder: (_) => AddQrScreen(entry: entry),
      ),
    );

    if (!mounted || updated == null) return;

    setState(() {
      final index = _entries.indexWhere((e) => e.id == updated.id);
      if (index >= 0) _entries[index] = updated;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Cod QR actualizat')),
    );
  }

  Future<bool> _confirmDelete(QrEntry entry) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Ștergi codul QR?'),
        content: Text(
          'Codul ${entry.cod} va fi marcat ca șters și nu va mai apărea în listă.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Anulează'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: FilledButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Șterge'),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  Future<void> _deleteEntry(QrEntry entry) async {
    final confirmed = await _confirmDelete(entry);
    if (!confirmed || !mounted) return;

    try {
      await _repo.deleteCodQr(entry.id);
      if (!mounted) return;
      setState(() => _entries.removeWhere((e) => e.id == entry.id));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cod QR șters')),
      );
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare la ștergere: $e');
    }
  }

  void _showQrPreview(QrEntry entry) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.88,
        minChildSize: 0.45,
        maxChildSize: 0.92,
        expand: false,
        builder: (context, scrollController) => _QrPreviewSheet(
          entry: entry,
          scrollController: scrollController,
          onEdit: () {
            Navigator.of(context).pop();
            _openEditScreen(entry);
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        _isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _loadEntries,
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 88),
                  children: [
                  if (_fromCache)
                    const Padding(
                      padding: EdgeInsets.only(bottom: 12),
                      child: _CacheHint(),
                    ),
                  if (_entries.isEmpty)
                    const _EmptyState()
                  else ...[
                    Row(
                      children: [
                        Text(
                          'Coduri generate',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${_entries.length}',
                            style: const TextStyle(
                              color: AppColors.accent,
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ..._entries.map(
                      (entry) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: QrEntryCard(
                          entry: entry,
                          onTap: () => _showQrPreview(entry),
                          onEdit: () => _openEditScreen(entry),
                          onDelete: () => _deleteEntry(entry),
                        ),
                      ),
                    ),
                  ],
                  ],
                ),
              ),
        Positioned(
          right: 20,
          bottom: 16,
          child: FloatingActionButton.extended(
            onPressed: _isLoading || !NetworkService.instance.isOnline
                ? null
                : _openAddScreen,
            backgroundColor: AppColors.accent,
            foregroundColor: Colors.white,
            icon: const Icon(Icons.add),
            label: const Text('Cod QR nou'),
          ),
        ),
      ],
    );
  }
}

class _CacheHint extends StatelessWidget {
  const _CacheHint();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.textSecondary.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: AppColors.textSecondary.withValues(alpha: 0.2),
        ),
      ),
      child: const Row(
        children: [
          Icon(Icons.offline_bolt_outlined, size: 18),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'Listă din cache (offline). Trage în jos când ai internet.',
              style: TextStyle(fontSize: 13, height: 1.3),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.accent.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(
              Icons.qr_code_2,
              size: 40,
              color: AppColors.accent,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Niciun cod QR încă',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Apasă butonul de mai jos pentru a crea primul cod QR.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary, height: 1.4),
          ),
        ],
      ),
    );
  }
}

class _QrPreviewSheet extends StatefulWidget {
  const _QrPreviewSheet({
    required this.entry,
    required this.scrollController,
    required this.onEdit,
  });

  final QrEntry entry;
  final ScrollController scrollController;
  final VoidCallback onEdit;

  @override
  State<_QrPreviewSheet> createState() => _QrPreviewSheetState();
}

class _QrPreviewSheetState extends State<_QrPreviewSheet> {
  static const _pageSize = 10;

  final List<QrScan> _scanari = [];
  bool _isLoading = true;
  bool _isLoadingMore = false;
  bool _hasMore = false;
  int _nextPage = 1;
  int _numarScanari = 0;

  QrEntry get entry => widget.entry;

  @override
  void initState() {
    super.initState();
    _numarScanari = entry.numarScanari;
    _loadInitial();
  }

  Future<void> _loadInitial() async {
    try {
      final page = await QrRepository().fetchCodQrScanari(
        entry.id,
        page: 1,
        limit: _pageSize,
      );
      if (!mounted) return;
      setState(() {
        _numarScanari = page.total;
        _scanari
          ..clear()
          ..addAll(page.scanari);
        _hasMore = page.hasMore;
        _nextPage = 2;
        _isLoading = false;
      });
    } on ApiException catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        showErrorSnackBar(context, e.message);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        showErrorSnackBar(context, 'Eroare la încărcarea scanărilor: $e');
      }
    }
  }

  String _shareMessage() {
    final url = entry.payload;
    final client = entry.clientDescription?.trim();
    if (client != null && client.isNotEmpty) {
      return '$client\n\n$url';
    }
    return 'Scanează codul nostru QR:\n$url';
  }

  Future<void> _share() async {
    try {
      final validation = QrValidator.validate(
        data: entry.payload,
        version: QrVersions.auto,
        errorCorrectionLevel: QrErrorCorrectLevel.M,
      );
      if (validation.status != QrValidationStatus.valid) {
        if (mounted) {
          showErrorSnackBar(context, 'Nu s-a putut genera codul QR.');
        }
        return;
      }

      final painter = QrPainter.withQr(
        qr: validation.qrCode!,
        gapless: true,
        // ignore: deprecated_member_use — fundal alb necesar la export PNG
        emptyColor: Colors.white,
        eyeStyle: const QrEyeStyle(
          eyeShape: QrEyeShape.square,
          color: AppColors.textPrimary,
        ),
        dataModuleStyle: const QrDataModuleStyle(
          dataModuleShape: QrDataModuleShape.square,
          color: AppColors.textPrimary,
        ),
      );

      final imageData = await painter.toImageData(
        512,
        format: ui.ImageByteFormat.png,
      );
      if (imageData == null) {
        if (mounted) {
          showErrorSnackBar(context, 'Nu s-a putut crea imaginea.');
        }
        return;
      }

      final dir = await getTemporaryDirectory();
      final safeCod = entry.cod.replaceAll(RegExp(r'[^\w\-]'), '_');
      final file = File('${dir.path}/qr_$safeCod.png');
      await file.writeAsBytes(imageData.buffer.asUint8List());

      await Share.shareXFiles(
        [XFile(file.path, mimeType: 'image/png', name: 'qr_$safeCod.png')],
        text: _shareMessage(),
        subject: 'Cod QR ${entry.cod}',
      );
    } catch (e) {
      if (mounted) {
        showErrorSnackBar(context, 'Nu s-a putut partaja: $e');
      }
    }
  }

  void _copyLink() {
    Clipboard.setData(ClipboardData(text: entry.payload));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Link copiat în clipboard')),
    );
  }

  void _openStats() {
    try {
      NetworkService.instance.requireOnline(
        'Statisticile necesită internet.',
      );
    } on ApiException catch (e) {
      showErrorSnackBar(context, e.message);
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => QrStatsScreen(entry: entry),
      ),
    );
  }

  Future<void> _loadMore() async {
    if (_isLoadingMore || !_hasMore) return;

    setState(() => _isLoadingMore = true);

    try {
      final page = await QrRepository().fetchCodQrScanari(
        entry.id,
        page: _nextPage,
        limit: _pageSize,
      );
      if (!mounted) return;
      setState(() {
        _scanari.addAll(page.scanari);
        _hasMore = page.hasMore;
        _nextPage++;
        _isLoadingMore = false;
      });
    } on ApiException catch (e) {
      if (mounted) {
        setState(() => _isLoadingMore = false);
        showErrorSnackBar(context, e.message);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingMore = false);
        showErrorSnackBar(context, 'Eroare la încărcare: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.paddingOf(context).bottom;

    return Material(
      color: AppColors.surface,
      borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      clipBehavior: Clip.antiAlias,
      child: SingleChildScrollView(
        controller: widget.scrollController,
        padding: EdgeInsets.fromLTRB(24, 16, 24, 24 + bottomInset),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              entry.cod,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.accent,
                  ),
            ),
            const SizedBox(height: 20),
            _QrImage(data: entry.payload),
            const SizedBox(height: 20),
            if (entry.pretRedus != null && entry.pretRedus!.trim().isNotEmpty) ...[
              _DescriptionRow(
                icon: Icons.sell_outlined,
                label: 'Preț redus',
                text: entry.pretRedus,
              ),
              const SizedBox(height: 12),
            ],
            _DescriptionRow(
              icon: Icons.description_outlined,
              label: 'Descriere internă cod',
              text: entry.firmaDescription,
            ),
            const SizedBox(height: 12),
            _DescriptionRow(
              icon: Icons.person_outline,
              label: 'Nume postare (client)',
              text: entry.clientDescription,
            ),
            if (entry.schedule.mode != QrScheduleMode.none) ...[
              const SizedBox(height: 12),
              _DescriptionRow(
                icon: entry.isScannableNow
                    ? Icons.event_available_outlined
                    : Icons.event_busy_outlined,
                label: 'Program scanare',
                text: entry.schedule.summaryLabel,
              ),
            ],
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _openStats,
                icon: const Icon(Icons.bar_chart_rounded),
                label: const Text('Statistici și grafice'),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: widget.onEdit,
                    icon: const Icon(Icons.edit_outlined),
                    label: const Text('Editează'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: _share,
                    icon: const Icon(Icons.share_outlined),
                    label: const Text('Partajează'),
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.accent,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            _LinkCopyRow(url: entry.payload, onCopy: _copyLink),
            const SizedBox(height: 20),
            _ScanHistorySection(
              isLoading: _isLoading,
              isLoadingMore: _isLoadingMore,
              numarScanari: _numarScanari,
              limitaScanari: entry.limitaScanari,
              scanari: _scanari,
              hasMore: _hasMore,
              onLoadMore: _loadMore,
            ),
          ],
        ),
      ),
    );
  }
}

class _LinkCopyRow extends StatelessWidget {
  const _LinkCopyRow({required this.url, required this.onCopy});

  final String url;
  final VoidCallback onCopy;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.accent.withValues(alpha: 0.06),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onCopy,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 10, 4, 10),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  url,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    height: 1.35,
                    color: AppColors.accent,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              IconButton(
                onPressed: onCopy,
                tooltip: 'Copiază link',
                icon: const Icon(Icons.copy_outlined, color: AppColors.accent),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ScanHistorySection extends StatefulWidget {
  const _ScanHistorySection({
    required this.isLoading,
    required this.isLoadingMore,
    required this.numarScanari,
    this.limitaScanari,
    required this.scanari,
    required this.hasMore,
    required this.onLoadMore,
  });

  final bool isLoading;
  final bool isLoadingMore;
  final int numarScanari;
  final int? limitaScanari;
  final List<QrScan> scanari;
  final bool hasMore;
  final VoidCallback onLoadMore;

  @override
  State<_ScanHistorySection> createState() => _ScanHistorySectionState();
}

class _ScanHistorySectionState extends State<_ScanHistorySection> {
  bool _loadMoreScheduled = false;

  bool get _showFooter =>
      widget.hasMore || widget.isLoadingMore;

  int get _itemCount =>
      widget.scanari.length + (_showFooter ? 1 : 0);

  bool _handleScroll(ScrollNotification notification) {
    if (widget.isLoading ||
        widget.isLoadingMore ||
        !widget.hasMore ||
        _loadMoreScheduled) {
      return false;
    }

    if (notification.metrics.pixels >=
        notification.metrics.maxScrollExtent - 64) {
      _loadMoreScheduled = true;
      widget.onLoadMore();
    }
    return false;
  }

  @override
  void didUpdateWidget(covariant _ScanHistorySection oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!widget.isLoadingMore) {
      _loadMoreScheduled = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Icon(Icons.history, color: AppColors.accent, size: 22),
                const SizedBox(width: 10),
                Text(
                  scanariCountLabelWithLimit(
                    widget.numarScanari,
                    widget.limitaScanari,
                  ),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
                if (widget.isLoading) ...[
                  const Spacer(),
                  const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                ],
              ],
            ),
            if (!widget.isLoading) ...[
              const SizedBox(height: 12),
              if (widget.scanari.isEmpty)
                const Text(
                  'Nicio scanare încă',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontStyle: FontStyle.italic,
                  ),
                )
              else
                SizedBox(
                  height: 220,
                  child: NotificationListener<ScrollNotification>(
                    onNotification: _handleScroll,
                    child: ListView.builder(
                      primary: false,
                      physics: const AlwaysScrollableScrollPhysics(),
                      itemCount: _itemCount,
                      itemBuilder: (context, index) {
                        if (index >= widget.scanari.length) {
                          return const Padding(
                            padding: EdgeInsets.symmetric(vertical: 12),
                            child: Center(
                              child: SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                            ),
                          );
                        }

                        final scan = widget.scanari[index];
                        return Column(
                          children: [
                            if (index > 0) const Divider(height: 12),
                            Row(
                              children: [
                                Icon(
                                  Icons.qr_code_scanner,
                                  size: 18,
                                  color: AppColors.textSecondary.withValues(
                                    alpha: 0.8,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  scan.formattedAt,
                                  style: const TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }
}

class _QrImage extends StatelessWidget {
  const _QrImage({required this.data});

  final String data;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: QrImageView(
        data: data,
        version: QrVersions.auto,
        size: 200,
        backgroundColor: Colors.white,
        eyeStyle: const QrEyeStyle(
          eyeShape: QrEyeShape.square,
          color: AppColors.textPrimary,
        ),
        dataModuleStyle: const QrDataModuleStyle(
          dataModuleShape: QrDataModuleShape.square,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}

class _DescriptionRow extends StatelessWidget {
  const _DescriptionRow({
    required this.icon,
    required this.label,
    required this.text,
  });

  final IconData icon;
  final String label;
  final String? text;

  @override
  Widget build(BuildContext context) {
    final value = text?.trim();
    if (value == null || value.isEmpty) {
      return const SizedBox.shrink();
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: AppColors.accent),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 2),
              Text(value, style: const TextStyle(height: 1.35)),
            ],
          ),
        ),
      ],
    );
  }
}
