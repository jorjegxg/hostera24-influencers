import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/repositories/qr_repository.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/widgets/error_snackbar.dart';

class AddQrScreen extends StatefulWidget {
  const AddQrScreen({super.key, this.entry});

  /// Dacă e setat, ecranul funcționează în mod editare.
  final QrEntry? entry;

  @override
  State<AddQrScreen> createState() => _AddQrScreenState();
}

class _AddQrScreenState extends State<AddQrScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _firmaController;
  late final TextEditingController _clientController;
  late final TextEditingController _pretController;
  bool _isSubmitting = false;

  bool get _isEditing => widget.entry != null;

  @override
  void initState() {
    super.initState();
    _firmaController = TextEditingController(
      text: widget.entry?.firmaDescription ?? '',
    );
    _clientController = TextEditingController(
      text: widget.entry?.clientDescription ?? '',
    );
    _pretController = TextEditingController(
      text: widget.entry?.pretRedus ?? '',
    );
  }

  @override
  void dispose() {
    _firmaController.dispose();
    _clientController.dispose();
    _pretController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _isSubmitting) return;

    setState(() => _isSubmitting = true);

    final pretRedus = _pretController.text.trim();

    try {
      final QrEntry entry;
      if (_isEditing) {
        entry = await QrRepository().updateCodQr(
          id: widget.entry!.id,
          numePostareClienti: _clientController.text,
          numePostareFirme: _firmaController.text,
          pretRedus: pretRedus.isEmpty ? null : pretRedus,
        );
      } else {
        entry = await QrRepository().createCodQr(
          numePostareClienti: _clientController.text,
          numePostareFirme: _firmaController.text,
          pretRedus: pretRedus.isEmpty ? null : pretRedus,
        );
      }

      if (!mounted) return;
      Navigator.of(context).pop<QrEntry>(entry);
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare neașteptată: $e');
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Editează cod QR' : 'Cod QR nou'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    if (_isEditing) ...[
                      Text(
                        widget.entry!.cod,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.accent,
                          letterSpacing: 0.4,
                        ),
                      ),
                      const SizedBox(height: 12),
                    ],
                    Text(
                      'Date cod QR',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _isEditing
                          ? 'Modifică detaliile postării. Codul QR rămâne același.'
                          : 'Completează ce ai nevoie: texte opționale și preț redus. Codul unic se generează automat.',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _firmaController,
                      maxLines: 3,
                      textCapitalization: TextCapitalization.sentences,
                      autofocus: !_isEditing,
                      enabled: !_isSubmitting,
                      decoration: const InputDecoration(
                        labelText: 'Nume postare (firmă) — opțional',
                        hintText: 'Ex: Campanie Instagram martie',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 48),
                          child: Icon(Icons.business_outlined),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _clientController,
                      maxLines: 3,
                      textCapitalization: TextCapitalization.sentences,
                      enabled: !_isSubmitting,
                      decoration: const InputDecoration(
                        labelText: 'Nume postare (client) — opțional',
                        hintText: 'Ex: Urmărește-ne pe Instagram',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 48),
                          child: Icon(Icons.person_outline),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _pretController,
                      maxLines: 2,
                      textCapitalization: TextCapitalization.sentences,
                      textInputAction: TextInputAction.done,
                      enabled: !_isSubmitting,
                      onFieldSubmitted: (_) => _submit(),
                      decoration: const InputDecoration(
                        labelText: 'Mesaj preț redus — opțional',
                        hintText: 'Ex: Cafea la 15,99 lei',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 24),
                          child: Icon(Icons.sell_outlined),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    FilledButton.icon(
                      onPressed: _isSubmitting ? null : _submit,
                      icon: _isSubmitting
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : Icon(_isEditing ? Icons.save_outlined : Icons.qr_code),
                      label: Text(
                        _isSubmitting
                            ? 'Se salvează...'
                            : (_isEditing ? 'Salvează modificările' : 'Generează cod QR'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
