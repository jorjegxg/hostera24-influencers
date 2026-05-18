import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/auth_service.dart';
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
  }

  @override
  void dispose() {
    _firmaController.dispose();
    _clientController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _isSubmitting) return;

    setState(() => _isSubmitting = true);

    try {
      final QrEntry entry;
      if (_isEditing) {
        entry = await AuthService.instance.api.updateCodQr(
          id: widget.entry!.id,
          numePostareClienti: _clientController.text.trim(),
          numePostareFirme: _firmaController.text.trim(),
        );
      } else {
        entry = await AuthService.instance.api.createCodQr(
          numePostareClienti: _clientController.text.trim(),
          numePostareFirme: _firmaController.text.trim(),
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
                          ? 'Modifică textele postării. Codul QR rămâne același.'
                          : 'Nume intern (firmă) și textul afișat clientului. Codul unic se generează automat pe server.',
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
                        labelText: 'Nume postare (firmă)',
                        hintText: 'Ex: Campanie Instagram martie',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 48),
                          child: Icon(Icons.business_outlined),
                        ),
                      ),
                      validator: (v) => v == null || v.trim().isEmpty
                          ? 'Completează numele pentru firmă'
                          : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _clientController,
                      maxLines: 3,
                      textCapitalization: TextCapitalization.sentences,
                      textInputAction: TextInputAction.done,
                      enabled: !_isSubmitting,
                      onFieldSubmitted: (_) => _submit(),
                      decoration: const InputDecoration(
                        labelText: 'Nume postare (client)',
                        hintText: 'Ex: Urmărește-ne pe Instagram',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 48),
                          child: Icon(Icons.person_outline),
                        ),
                      ),
                      validator: (v) => v == null || v.trim().isEmpty
                          ? 'Completează textul pentru client'
                          : null,
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
