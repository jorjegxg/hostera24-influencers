import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:hostera24/models/firma_profile.dart';
import 'package:hostera24/screens/login_screen.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/utils/media_url.dart';
import 'package:hostera24/widgets/error_snackbar.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key, required this.email});

  final String email;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _numeController;
  late final TextEditingController _telefonController;
  late final TextEditingController _descriereController;
  late final TextEditingController _websiteController;

  FirmaProfile? _profile;
  bool _isLoading = true;
  bool _isSaving = false;
  bool _isUploadingLogo = false;

  @override
  void initState() {
    super.initState();
    _numeController = TextEditingController();
    _telefonController = TextEditingController();
    _descriereController = TextEditingController();
    _websiteController = TextEditingController();
    _loadProfile();
  }

  @override
  void dispose() {
    _numeController.dispose();
    _telefonController.dispose();
    _descriereController.dispose();
    _websiteController.dispose();
    super.dispose();
  }

  void _fillForm(FirmaProfile profile) {
    _numeController.text = profile.nume ?? '';
    _telefonController.text = profile.telefon ?? '';
    _descriereController.text = profile.descriere ?? '';
    _websiteController.text = profile.website ?? '';
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    try {
      NetworkService.instance.requireOnline(
        'Profilul necesită internet.',
      );
      final profile = await AuthService.instance.api.fetchFirmaProfil();
      if (!mounted) return;
      setState(() {
        _profile = profile;
        _fillForm(profile);
        _isLoading = false;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      showErrorSnackBar(context, e.message);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      showErrorSnackBar(context, 'Nu am putut încărca profilul: $e');
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate() || _isSaving) return;

    setState(() => _isSaving = true);
    try {
      NetworkService.instance.requireOnline(
        'Salvarea profilului necesită internet.',
      );
      final profile = await AuthService.instance.api.updateFirmaProfil(
        nume: _numeController.text,
        telefon: _telefonController.text,
        descriere: _descriereController.text,
        website: _websiteController.text,
      );
      if (!mounted) return;
      setState(() {
        _profile = profile;
        _fillForm(profile);
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Profil salvat')));
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare la salvare: $e');
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  Future<void> _pickAndUploadLogo() async {
    if (_isUploadingLogo) return;

    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1200,
      maxHeight: 1200,
      imageQuality: 85,
    );
    if (picked == null || !mounted) return;

    setState(() => _isUploadingLogo = true);
    try {
      NetworkService.instance.requireOnline(
        'Încărcarea logo-ului necesită internet.',
      );
      final profile = await AuthService.instance.api.uploadFirmaLogo(
        picked.path,
      );
      if (!mounted) return;
      setState(() {
        _profile = profile;
        _fillForm(profile);
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Logo actualizat')));
    } on ApiException catch (e) {
      if (mounted) showErrorSnackBar(context, e.message);
    } catch (e) {
      if (mounted) showErrorSnackBar(context, 'Eroare la upload logo: $e');
    } finally {
      if (mounted) setState(() => _isUploadingLogo = false);
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

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadProfile,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _ProfileHeader(
                email: _profile?.email ?? widget.email,
                displayName: _profile?.displayName ?? widget.email,
                logoUrl: _profile?.logoUrl,
                isUploadingLogo: _isUploadingLogo,
                onChangeLogo: _pickAndUploadLogo,
              ),
              const SizedBox(height: 28),
              Text(
                'Detalii firmă',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Aceste informații pot apărea la codurile QR publice (logo, descriere).',
                style: TextStyle(color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _numeController,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Nume firmă',
                  prefixIcon: Icon(Icons.business_outlined),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _telefonController,
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Telefon',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriereController,
                maxLines: 2,
                textInputAction: TextInputAction.newline,
                decoration: const InputDecoration(
                  labelText: 'Descriere',
                  alignLabelWithHint: true,
                  prefixIcon: Icon(Icons.info_outline),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _websiteController,
                keyboardType: TextInputType.url,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  labelText: 'Website',
                  hintText: 'ex. hostera24.com',
                  prefixIcon: Icon(Icons.language_outlined),
                ),
              ),
              const SizedBox(height: 28),
              FilledButton(
                onPressed: _isSaving ? null : _save,
                child: _isSaving
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Salvează profilul'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: _logout,
                icon: const Icon(Icons.logout),
                label: const Text('Deconectare'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.error,
                  side: BorderSide(
                    color: AppColors.error.withValues(alpha: 0.5),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({
    required this.email,
    required this.displayName,
    this.logoUrl,
    required this.onChangeLogo,
    this.isUploadingLogo = false,
  });

  final String email;
  final String displayName;
  final String? logoUrl;
  final VoidCallback onChangeLogo;
  final bool isUploadingLogo;

  @override
  Widget build(BuildContext context) {
    final resolvedLogo = resolveUploadsMediaUrl(logoUrl);
    final hasLogo = resolvedLogo != null && resolvedLogo.isNotEmpty;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: hasLogo
                    ? Image.network(
                        resolvedLogo,
                        width: 64,
                        height: 64,
                        fit: BoxFit.cover,
                        gaplessPlayback: true,
                        errorBuilder: (context, error, stackTrace) =>
                            _placeholderAvatar(),
                      )
                    : _placeholderAvatar(),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      displayName,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      email,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: isUploadingLogo ? null : onChangeLogo,
            icon: isUploadingLogo
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.photo_outlined),
            label: Text(hasLogo ? 'Schimbă logo' : 'Încarcă logo'),
          ),
        ],
      ),
    );
  }

  Widget _placeholderAvatar() {
    return Container(
      width: 64,
      height: 64,
      color: AppColors.accent.withValues(alpha: 0.12),
      child: const Icon(Icons.storefront, color: AppColors.accent, size: 32),
    );
  }
}
