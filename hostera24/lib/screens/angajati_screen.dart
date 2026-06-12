import 'package:flutter/material.dart';
import 'package:hostera24/models/angajat.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/widgets/error_snackbar.dart';

class AngajatiScreen extends StatefulWidget {
  const AngajatiScreen({super.key});

  @override
  State<AngajatiScreen> createState() => _AngajatiScreenState();
}

class _AngajatiScreenState extends State<AngajatiScreen> {
  List<Angajat> _angajati = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      NetworkService.instance.requireOnline(
        'Gestionarea angajaților necesită internet.',
      );
      final angajati = await AuthService.instance.api.fetchAngajati();
      if (!mounted) return;
      setState(() {
        _angajati = angajati;
        _isLoading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      showErrorSnackBar(context, e.message);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      showErrorSnackBar(context, 'Nu am putut încărca angajații: $e');
    }
  }

  Future<void> _showAddDialog() async {
    final added = await showDialog<bool>(
      context: context,
      builder: (_) => const _AddAngajatDialog(),
    );

    if (added == true) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Angajat adăugat. Se poate conecta acum cu Google în aplicație.',
          ),
        ),
      );
      await _load();
    }
  }

  Future<void> _confirmDelete(Angajat angajat) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Elimină angajatul?'),
        content: Text(
          '${angajat.displayName} nu va mai putea valida codurile firmei tale.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('Anulează'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text('Elimină'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      NetworkService.instance.requireOnline(
        'Eliminarea unui angajat necesită internet.',
      );
      await AuthService.instance.api.deleteAngajat(angajat.id);
      if (!mounted) return;
      setState(() {
        _angajati = _angajati.where((a) => a.id != angajat.id).toList();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Angajat eliminat')),
      );
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare la eliminare: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Angajați')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddDialog,
        icon: const Icon(Icons.person_add_alt),
        label: const Text('Adaugă angajat'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: _angajati.isEmpty
                  ? ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(24),
                      children: const [
                        SizedBox(height: 48),
                        Icon(
                          Icons.group_outlined,
                          size: 56,
                          color: AppColors.textSecondary,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Niciun angajat încă',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Adaugă angajați după email. Ei se conectează cu Google '
                          'și pot doar să valideze codurile prin scanare — '
                          'fără acces la lista codurilor sau statistici.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            height: 1.4,
                          ),
                        ),
                      ],
                    )
                  : ListView.separated(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 96),
                      itemCount: _angajati.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final angajat = _angajati[index];
                        return _AngajatTile(
                          angajat: angajat,
                          onDelete: () => _confirmDelete(angajat),
                        );
                      },
                    ),
            ),
    );
  }
}

class _AngajatTile extends StatelessWidget {
  const _AngajatTile({required this.angajat, required this.onDelete});

  final Angajat angajat;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: CircleAvatar(
          backgroundColor: AppColors.accent.withValues(alpha: 0.12),
          child: const Icon(Icons.badge_outlined, color: AppColors.accent),
        ),
        title: Text(
          angajat.displayName,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (angajat.nume != null && angajat.nume!.trim().isNotEmpty)
              Text(angajat.email),
            Text(
              angajat.activat
                  ? 'Activ — s-a conectat cu Google'
                  : 'În așteptare — nu s-a conectat încă',
              style: TextStyle(
                fontSize: 12,
                color: angajat.activat
                    ? Colors.green.shade700
                    : AppColors.textSecondary,
              ),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline, color: AppColors.error),
          tooltip: 'Elimină',
          onPressed: onDelete,
        ),
      ),
    );
  }
}

class _AddAngajatDialog extends StatefulWidget {
  const _AddAngajatDialog();

  @override
  State<_AddAngajatDialog> createState() => _AddAngajatDialogState();
}

class _AddAngajatDialogState extends State<_AddAngajatDialog> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _numeController = TextEditingController();
  bool _isSaving = false;

  @override
  void dispose() {
    _emailController.dispose();
    _numeController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _isSaving) return;
    setState(() => _isSaving = true);
    try {
      NetworkService.instance.requireOnline(
        'Adăugarea unui angajat necesită internet.',
      );
      await AuthService.instance.api.createAngajat(
        email: _emailController.text,
        nume: _numeController.text,
      );
      if (mounted) Navigator.of(context).pop(true);
    } on ApiException catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        showErrorSnackBar(context, e.message);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSaving = false);
        showErrorSnackBar(context, 'Eroare: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Adaugă angajat'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Introdu adresa de email Google a angajatului. '
              'Acesta se va conecta în aplicație cu Google și va putea doar să valideze coduri prin scanare.',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 13,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              autofocus: true,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(
                labelText: 'Email angajat',
                prefixIcon: Icon(Icons.email_outlined),
              ),
              validator: (value) {
                final v = value?.trim() ?? '';
                if (v.isEmpty) return 'Emailul este obligatoriu';
                if (!v.contains('@') || !v.contains('.')) {
                  return 'Email invalid';
                }
                return null;
              },
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _numeController,
              textInputAction: TextInputAction.done,
              onFieldSubmitted: (_) => _submit(),
              decoration: const InputDecoration(
                labelText: 'Nume (opțional)',
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSaving ? null : () => Navigator.of(context).pop(false),
          child: const Text('Anulează'),
        ),
        FilledButton(
          onPressed: _isSaving ? null : _submit,
          child: _isSaving
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Colors.white,
                  ),
                )
              : const Text('Adaugă'),
        ),
      ],
    );
  }
}
