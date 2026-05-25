import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/repositories/qr_repository.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/utils/price_format.dart';
import 'package:hostera24/widgets/error_snackbar.dart';
import 'package:hostera24/widgets/qr_schedule_section.dart';

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
  late final TextEditingController _reducereController;
  late final TextEditingController _limitaController;
  late QrSchedule _schedule;
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
      text: _initialAmountText(widget.entry?.pret),
    );
    _reducereController = TextEditingController(
      text: _initialAmountText(widget.entry?.reducere),
    );
    _limitaController = TextEditingController(
      text: widget.entry?.limitaScanari?.toString() ?? '',
    );
    _schedule = widget.entry?.schedule ?? const QrSchedule();
  }

  String _initialAmountText(double? value) {
    if (value == null) return '';
    if (value == value.truncateToDouble()) {
      return value.toInt().toString();
    }
    return value.toStringAsFixed(2).replaceAll('.', ',');
  }

  @override
  void dispose() {
    _firmaController.dispose();
    _clientController.dispose();
    _pretController.dispose();
    _reducereController.dispose();
    _limitaController.dispose();
    super.dispose();
  }

  int? _parseLimitaScanari() {
    final raw = _limitaController.text.trim();
    if (raw.isEmpty) return null;
    return int.tryParse(raw);
  }

  String? _validateAmount(String? value, {required String fieldLabel}) {
    final raw = value?.trim() ?? '';
    if (raw.isEmpty) return null;
    final parsed = parseOptionalLei(raw);
    if (parsed == null) {
      return 'Introdu un număr valid pentru $fieldLabel (ex. 24,99).';
    }
    if (parsed < 0) return '$fieldLabel trebuie să fie cel puțin 0.';
    if (parsed > 999999.99) return '$fieldLabel este prea mare.';
    return null;
  }

  String? _validateLimitaScanari() {
    final raw = _limitaController.text.trim();
    if (raw.isEmpty) return null;
    final value = int.tryParse(raw);
    if (value == null) return 'Introdu un număr întreg (ex. 50).';
    if (value < 1) return 'Limita trebuie să fie cel puțin 1.';
    if (value > 999999) return 'Limita este prea mare.';
    if (_isEditing &&
        widget.entry != null &&
        value < widget.entry!.numarScanari) {
      return 'Limita nu poate fi mai mică decât scanările deja înregistrate (${widget.entry!.numarScanari}).';
    }
    return null;
  }

  String? _validateSchedule() {
    if (_schedule.mode == QrScheduleMode.dateRange) {
      if (_schedule.dateFrom == null || _schedule.dateTo == null) {
        return 'Selectează ambele date pentru interval.';
      }
      final from = DateTime(
        _schedule.dateFrom!.year,
        _schedule.dateFrom!.month,
        _schedule.dateFrom!.day,
      );
      final to = DateTime(
        _schedule.dateTo!.year,
        _schedule.dateTo!.month,
        _schedule.dateTo!.day,
      );
      if (from.isAfter(to)) {
        return 'Data de început trebuie să fie înainte de data de sfârșit.';
      }
    }
    if (_schedule.mode == QrScheduleMode.weekdays &&
        _schedule.weekdays.isEmpty) {
      return 'Selectează cel puțin o zi din săptămână.';
    }
    return null;
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _isSubmitting) return;

    final scheduleError = _validateSchedule();
    if (scheduleError != null) {
      showErrorSnackBar(context, scheduleError);
      return;
    }

    final limitaError = _validateLimitaScanari();
    if (limitaError != null) {
      showErrorSnackBar(context, limitaError);
      return;
    }

    final pret = parseOptionalLei(_pretController.text);
    final reducere = parseOptionalLei(_reducereController.text);
    if (pret != null && reducere != null && reducere > pret) {
      showErrorSnackBar(
        context,
        'Reducerea nu poate fi mai mare decât prețul serviciului.',
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final limitaScanari = _parseLimitaScanari();
    final hadLimit = widget.entry?.hasScanLimit ?? false;
    final clearLimitaScanari =
        _isEditing && hadLimit && limitaScanari == null;

    try {
      final QrEntry entry;
      if (_isEditing) {
        entry = await QrRepository().updateCodQr(
          id: widget.entry!.id,
          numePostareClienti: _clientController.text,
          numePostareFirme: _firmaController.text,
          pret: pret,
          reducere: reducere,
          limitaScanari: limitaScanari,
          clearLimitaScanari: clearLimitaScanari,
          schedule: _schedule,
        );
      } else {
        entry = await QrRepository().createCodQr(
          numePostareClienti: _clientController.text,
          numePostareFirme: _firmaController.text,
          pret: pret,
          reducere: reducere,
          limitaScanari: limitaScanari,
          schedule: _schedule,
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
                          : 'Completează ce ai nevoie: texte opționale, preț serviciu și reducere în lei. Codul unic se generează automat.',
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
                        labelText: 'Descriere internă cod — opțional',
                        hintText: 'Ex: Popescu Ionut instagram 1',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 48),
                          child: Icon(Icons.description_outlined),
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
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(
                          RegExp(r'[0-9,.]'),
                        ),
                      ],
                      textInputAction: TextInputAction.next,
                      enabled: !_isSubmitting,
                      validator: (v) => _validateAmount(
                        v,
                        fieldLabel: 'prețul serviciului',
                      ),
                      decoration: const InputDecoration(
                        labelText: 'Preț serviciu / produs — opțional',
                        hintText: 'Ex: 24,99',
                        suffixText: 'lei',
                        prefixIcon: Icon(Icons.payments_outlined),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _reducereController,
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(
                          RegExp(r'[0-9,.]'),
                        ),
                      ],
                      textInputAction: TextInputAction.next,
                      enabled: !_isSubmitting,
                      validator: (v) => _validateAmount(
                        v,
                        fieldLabel: 'reducerea',
                      ),
                      decoration: const InputDecoration(
                        labelText: 'Reducere — opțional',
                        hintText: 'Ex: 5',
                        suffixText: 'lei',
                        prefixIcon: Icon(Icons.sell_outlined),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _limitaController,
                      keyboardType: TextInputType.number,
                      textInputAction: TextInputAction.done,
                      enabled: !_isSubmitting,
                      onFieldSubmitted: (_) => _submit(),
                      decoration: InputDecoration(
                        labelText: 'Limită scanări — opțional',
                        hintText: 'Ex: 50 (primii 50 clienți)',
                        prefixIcon: const Icon(Icons.people_outline),
                        helperText: _isEditing && widget.entry!.numarScanari > 0
                            ? 'Deja înregistrate: ${widget.entry!.numarScanari} scanări. Lasă gol pentru nelimitat.'
                            : 'Gol = nelimitat. La casă, scanarea se oprește automat la limită.',
                      ),
                    ),
                    const SizedBox(height: 24),
                    QrScheduleSection(
                      schedule: _schedule,
                      enabled: !_isSubmitting,
                      onChanged: (value) => setState(() => _schedule = value),
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
