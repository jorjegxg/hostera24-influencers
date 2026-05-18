import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/screens/add_qr_screen.dart';
import 'package:hostera24/screens/login_screen.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/widgets/error_snackbar.dart';
import 'package:hostera24/widgets/qr_entry_card.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QrCreatorScreen extends StatefulWidget {
  const QrCreatorScreen({super.key, required this.email});

  final String email;

  @override
  State<QrCreatorScreen> createState() => _QrCreatorScreenState();
}

class _QrCreatorScreenState extends State<QrCreatorScreen> {
  final List<QrEntry> _entries = [];
  QrEntry? _previewEntry;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadEntries();
  }

  Future<void> _loadEntries() async {
    setState(() => _isLoading = true);
    try {
      final entries = await AuthService.instance.api.fetchCoduriQr();
      if (!mounted) return;
      setState(() {
        _entries
          ..clear()
          ..addAll(entries);
        _previewEntry = entries.isNotEmpty ? entries.first : null;
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
    final entry = await Navigator.of(context).push<QrEntry>(
      MaterialPageRoute<QrEntry>(
        builder: (_) => const AddQrScreen(),
      ),
    );

    if (!mounted || entry == null) return;

    setState(() {
      _entries.insert(0, entry);
      _previewEntry = entry;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Cod QR generat cu succes')),
    );
  }

  Future<void> _openEditScreen(QrEntry entry) async {
    final updated = await Navigator.of(context).push<QrEntry>(
      MaterialPageRoute<QrEntry>(
        builder: (_) => AddQrScreen(entry: entry),
      ),
    );

    if (!mounted || updated == null) return;

    setState(() {
      final index = _entries.indexWhere((e) => e.id == updated.id);
      if (index >= 0) _entries[index] = updated;
      if (_previewEntry?.id == updated.id) _previewEntry = updated;
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
      await AuthService.instance.api.deleteCodQr(entry.id);
      if (!mounted) return;
      setState(() {
        _entries.removeWhere((e) => e.id == entry.id);
        if (_previewEntry?.id == entry.id) {
          _previewEntry = _entries.isNotEmpty ? _entries.first : null;
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cod QR șters')),
      );
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare la ștergere: $e');
    }
  }

  Future<void> _logout() async {
    await AuthService.instance.logout();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => const LoginScreen()),
      (_) => false,
    );
  }

  void _showQrPreview(QrEntry entry) {
    setState(() => _previewEntry = entry);
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _QrPreviewSheet(
        entry: entry,
        onEdit: () {
          Navigator.of(context).pop();
          _openEditScreen(entry);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Creator QR'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 4),
            child: Center(
              child: Text(
                widget.email,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ),
          IconButton(
            tooltip: 'Deconectare',
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isLoading ? null : _openAddScreen,
        backgroundColor: AppColors.accent,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Cod QR nou'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadEntries,
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 96),
                children: [
                  if (_previewEntry != null) ...[
                    _InlinePreview(entry: _previewEntry!),
                    const SizedBox(height: 24),
                  ],
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

class _InlinePreview extends StatelessWidget {
  const _InlinePreview({required this.entry});

  final QrEntry entry;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Text(
              'Previzualizare ultim cod',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              entry.cod,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.accent,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 16),
            _QrImage(data: entry.payload),
            const SizedBox(height: 16),
            _DescriptionRow(
              icon: Icons.business_outlined,
              label: 'Firmă',
              text: entry.firmaDescription,
            ),
            const SizedBox(height: 8),
            _DescriptionRow(
              icon: Icons.person_outline,
              label: 'Client',
              text: entry.clientDescription,
            ),
          ],
        ),
      ),
    );
  }
}

class _QrPreviewSheet extends StatelessWidget {
  const _QrPreviewSheet({required this.entry, required this.onEdit});

  final QrEntry entry;
  final VoidCallback onEdit;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        24,
        16,
        24,
        24 + MediaQuery.paddingOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            entry.cod,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.accent,
                ),
          ),
          const SizedBox(height: 20),
          _QrImage(data: entry.payload),
          const SizedBox(height: 20),
          _DescriptionRow(
            icon: Icons.business_outlined,
            label: 'Nume postare (firmă)',
            text: entry.firmaDescription,
          ),
          const SizedBox(height: 12),
          _DescriptionRow(
            icon: Icons.person_outline,
            label: 'Nume postare (client)',
            text: entry.clientDescription,
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onEdit,
                  icon: const Icon(Icons.edit_outlined),
                  label: const Text('Editează'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: entry.payload));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Conținut copiat în clipboard')),
                    );
                  },
                  icon: const Icon(Icons.copy_outlined),
                  label: const Text('Copiază'),
                ),
              ),
            ],
          ),
        ],
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
  final String text;

  @override
  Widget build(BuildContext context) {
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
              Text(text, style: const TextStyle(height: 1.35)),
            ],
          ),
        ),
      ],
    );
  }
}
