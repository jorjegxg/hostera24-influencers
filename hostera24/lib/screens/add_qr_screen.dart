import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/theme/app_colors.dart';

class AddQrScreen extends StatefulWidget {
  const AddQrScreen({super.key});

  @override
  State<AddQrScreen> createState() => _AddQrScreenState();
}

class _AddQrScreenState extends State<AddQrScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firmaController = TextEditingController();
  final _clientController = TextEditingController();
  bool _isSubmitting = false;

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
      final entry = await AuthService.instance.api.createCodQr(
        numePostareClienti: _clientController.text.trim(),
        numePostareFirme: _firmaController.text.trim(),
      );

      if (!mounted) return;
      Navigator.of(context).pop<QrEntry>(entry);
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cod QR nou'),
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
                    Text(
                      'Date cod QR',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Nume intern (firmă) și textul afișat clientului. Codul unic se generează automat pe server.',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _firmaController,
                      maxLines: 3,
                      textCapitalization: TextCapitalization.sentences,
                      autofocus: true,
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
                          : const Icon(Icons.qr_code),
                      label: Text(_isSubmitting ? 'Se salvează...' : 'Generează cod QR'),
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
