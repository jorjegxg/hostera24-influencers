import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_scan.dart';
import 'package:hostera24/models/scan_result.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/repositories/qr_repository.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/widgets/error_snackbar.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class ScanQrScreen extends StatefulWidget {
  const ScanQrScreen({super.key});

  @override
  State<ScanQrScreen> createState() => _ScanQrScreenState();
}

class _ScanQrScreenState extends State<ScanQrScreen> {
  MobileScannerController? _scannerController;

  ScanResult? _lastResult;
  bool _isProcessing = false;
  bool _isScanning = false;

  @override
  void dispose() {
    _scannerController?.dispose();
    super.dispose();
  }

  Future<void> _startScanning() async {
    setState(() {
      _lastResult = null;
      _isScanning = true;
      _scannerController = MobileScannerController(
        detectionSpeed: DetectionSpeed.noDuplicates,
        facing: CameraFacing.back,
      );
    });
  }

  Future<void> _stopScanning() async {
    await _scannerController?.stop();
    _scannerController?.dispose();
    setState(() {
      _scannerController = null;
      _isScanning = false;
    });
  }

  Future<void> _onBarcode(String raw) async {
    if (_isProcessing) return;

    setState(() => _isProcessing = true);

    try {
      final result = await QrRepository().scanCodQr(raw);
      if (!mounted) return;
      await _scannerController?.stop();
      setState(() {
        _lastResult = result;
        _isScanning = false;
        _scannerController?.dispose();
        _scannerController = null;
      });
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) {
        showErrorSnackBar(
          context,
          'Eroare la scanare. Verifică rețeaua și că backend-ul rulează. ($e)',
        );
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  Future<void> _scanAgain() async {
    await _startScanning();
  }

  Future<void> _backToHome() async {
    await _stopScanning();
    setState(() => _lastResult = null);
  }

  @override
  Widget build(BuildContext context) {
    if (_lastResult != null) {
      return _ScanResultPanel(
        result: _lastResult!,
        onScanAgain: _scanAgain,
        onBack: _backToHome,
      );
    }

    if (!_isScanning) {
      return _ScanLanding(onStart: _startScanning);
    }

    return Column(
      children: [
        Expanded(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  MobileScanner(
                    controller: _scannerController!,
                    onDetect: (capture) {
                      if (_isProcessing) return;
                      for (final barcode in capture.barcodes) {
                        final raw = barcode.rawValue;
                        if (raw != null && raw.isNotEmpty) {
                          _onBarcode(raw);
                          return;
                        }
                      }
                    },
                  ),
                  if (_isProcessing)
                    Container(
                      color: Colors.black38,
                      child: const Center(
                        child: CircularProgressIndicator(color: Colors.white),
                      ),
                    ),
                  Positioned(
                    left: 12,
                    right: 12,
                    bottom: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        'Îndreaptă camera spre codul QR',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white, fontSize: 13),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
          child: OutlinedButton(
            onPressed: _isProcessing ? null : _stopScanning,
            child: const Text('Anulează'),
          ),
        ),
      ],
    );
  }
}

class _ScanLanding extends StatelessWidget {
  const _ScanLanding({required this.onStart});

  final VoidCallback onStart;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                color: AppColors.accent.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(
                Icons.qr_code_scanner,
                size: 48,
                color: AppColors.accent,
              ),
            ),
            const SizedBox(height: 28),
            Text(
              'Verifică un cod QR',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            const Text(
              'Scanează codurile create de firma ta și vezi mesajul intern sau confirmă că îți aparțin.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textSecondary,
                height: 1.45,
              ),
            ),
            const SizedBox(height: 36),
            FilledButton.icon(
              onPressed: onStart,
              icon: const Icon(Icons.qr_code_scanner),
              label: const Text('Scanează cod QR'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 52),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ScanResultPanel extends StatefulWidget {
  const _ScanResultPanel({
    required this.result,
    required this.onScanAgain,
    required this.onBack,
  });

  final ScanResult result;
  final VoidCallback onScanAgain;
  final VoidCallback onBack;

  @override
  State<_ScanResultPanel> createState() => _ScanResultPanelState();
}

class _ScanResultPanelState extends State<_ScanResultPanel>
    with SingleTickerProviderStateMixin {
  static const _successHoldDuration = Duration(milliseconds: 500);

  AnimationController? _successController;
  Animation<double>? _checkScale;
  Animation<double>? _checkOpacity;
  Animation<double>? _ringScale;

  bool _showOwnDetails = false;

  ScanResult get result => widget.result;

  @override
  void initState() {
    super.initState();
    if (result.isOwn) {
      _successController = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 850),
      );
      _checkScale = CurvedAnimation(
        parent: _successController!,
        curve: const Interval(0.15, 1, curve: Curves.elasticOut),
      );
      _checkOpacity = CurvedAnimation(
        parent: _successController!,
        curve: const Interval(0, 0.45, curve: Curves.easeOut),
      );
      _ringScale = CurvedAnimation(
        parent: _successController!,
        curve: const Interval(0, 0.55, curve: Curves.easeOutCubic),
      );
      _successController!.forward().then((_) async {
        await Future<void>.delayed(_successHoldDuration);
        if (mounted) setState(() => _showOwnDetails = true);
      });
    } else {
      _showOwnDetails = true;
    }
  }

  @override
  void dispose() {
    _successController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (result.isOwn && !_showOwnDetails) {
      return _OwnScanSuccessAnimation(
        scale: _checkScale!,
        opacity: _checkOpacity!,
        ringScale: _ringScale!,
      );
    }

    return AnimatedOpacity(
      opacity: _showOwnDetails ? 1 : 0,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeOut,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
        children: [
          if (result.queuedOffline) ...[
            Card(
              color: AppColors.accent.withValues(alpha: 0.08),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_upload_outlined, color: AppColors.accent),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        result.isQueued
                            ? 'Scan salvat local. Se trimite la server când ai internet.'
                            : 'Scan salvat local (codul tău). Numărul de scanări se actualizează după sincronizare.',
                        style: const TextStyle(height: 1.35),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
          if (result.isOwn) ..._ownDetailCards() else if (result.status == ScanStatus.other) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Cod valid, altă firmă',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Codul ${result.cod ?? ''} există în Hostera24, dar nu aparține contului tău.',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      height: 1.35,
                    ),
                  ),
                  if (result.pretRedus != null &&
                      result.pretRedus!.trim().isNotEmpty) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.sell_outlined,
                      label: 'Preț redus',
                      text: result.pretRedus!,
                      highlighted: true,
                    ),
                  ],
                  if (result.numePostareClienti != null &&
                      result.numePostareClienti!.trim().isNotEmpty) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.person_outline,
                      label: 'Mesaj pentru client',
                      text: result.numePostareClienti!,
                    ),
                  ],
                ],
              ),
            ),
          ),
        ] else if (result.isUnavailable) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.event_busy_outlined, color: AppColors.error),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          result.cod != null
                              ? 'Cod ${result.cod} — inactiv acum'
                              : 'Cod inactiv acum',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          result.mesajProgramare ??
                              'Acest cod nu poate fi scanat în acest moment.',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            height: 1.35,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ] else if (result.isQueued) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(Icons.schedule, color: AppColors.accent),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      result.cod != null
                          ? 'Cod ${result.cod} — scan salvat, așteaptă sincronizare.'
                          : 'Scan salvat local. Conectează-te la internet pentru validare.',
                      style: const TextStyle(height: 1.35),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ] else ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(Icons.error_outline, color: AppColors.error),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Cod QR necunoscut sau invalid.',
                      style: TextStyle(height: 1.35),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: widget.onScanAgain,
            icon: const Icon(Icons.qr_code_scanner),
            label: const Text('Scanează alt cod'),
          ),
          const SizedBox(height: 10),
          OutlinedButton(
            onPressed: widget.onBack,
            child: const Text('Înapoi'),
          ),
        ],
      ),
    );
  }

  List<Widget> _ownDetailCards() {
    return [
      Card(
        color: AppColors.accent.withValues(alpha: 0.08),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(Icons.verified, color: AppColors.accent),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Codul tău — ${result.cod ?? ''}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.accent,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Acest cod QR este valid.',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        height: 1.35,
                      ),
                    ),
                    if (result.numarScanari != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        scanariCountLabel(result.numarScanari!),
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          color: AppColors.accent,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      if (result.pretRedus != null && result.pretRedus!.trim().isNotEmpty) ...[
        const SizedBox(height: 12),
        _InfoCard(
          icon: Icons.sell_outlined,
          label: 'Preț redus',
          text: result.pretRedus!,
          highlighted: true,
        ),
      ],
      if (result.numePostareFirme != null &&
          result.numePostareFirme!.trim().isNotEmpty) ...[
        const SizedBox(height: 12),
        _InfoCard(
          icon: Icons.business_outlined,
          label: 'Mesaj pentru firmă (intern)',
          text: result.numePostareFirme!,
          highlighted:
              result.pretRedus == null || result.pretRedus!.trim().isEmpty,
        ),
      ],
    ];
  }
}

class _OwnScanSuccessAnimation extends StatelessWidget {
  const _OwnScanSuccessAnimation({
    required this.scale,
    required this.opacity,
    required this.ringScale,
  });

  final Animation<double> scale;
  final Animation<double> opacity;
  final Animation<double> ringScale;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: Listenable.merge([scale, opacity, ringScale]),
        builder: (context, _) {
          return Opacity(
            opacity: opacity.value,
            child: Transform.scale(
              scale: scale.value,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Transform.scale(
                        scale: ringScale.value,
                        child: Container(
                          width: 148,
                          height: 148,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.accent.withValues(alpha: 0.12),
                          ),
                        ),
                      ),
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: AppColors.accent,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.accent.withValues(alpha: 0.4),
                              blurRadius: 28,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.check_rounded,
                          size: 76,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),
                  Text(
                    'Cod valid!',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.accent,
                        ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Acest cod QR este valid.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 15,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.icon,
    required this.label,
    required this.text,
    this.highlighted = false,
  });

  final IconData icon;
  final String label;
  final String text;
  final bool highlighted;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: highlighted ? AppColors.surface : null,
      shape: highlighted
          ? RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: AppColors.accent.withValues(alpha: 0.4)),
            )
          : null,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: AppColors.accent, size: 22),
            const SizedBox(width: 12),
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
                  const SizedBox(height: 4),
                  Text(
                    text,
                    style: TextStyle(
                      height: 1.35,
                      fontWeight:
                          highlighted ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
