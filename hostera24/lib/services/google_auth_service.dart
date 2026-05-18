import 'package:google_sign_in/google_sign_in.dart';
import 'package:hostera24/config/google_auth_config.dart';
import 'package:hostera24/services/api_exception.dart';

class GoogleAuthService {
  GoogleAuthService._();
  static final GoogleAuthService instance = GoogleAuthService._();

  bool _initialized = false;

  Future<void> ensureInitialized() async {
    if (_initialized || !GoogleAuthConfig.isConfigured) return;
    await GoogleSignIn.instance.initialize(
      serverClientId: GoogleAuthConfig.webClientId,
    );
    _initialized = true;
  }

  Future<String> signInForIdToken() async {
    if (!GoogleAuthConfig.isConfigured) {
      throw ApiException(
        'Google Sign-In nu e configurat. Rulează cu:\n'
        '--dart-define=GOOGLE_WEB_CLIENT_ID=ID_TAU_WEB.apps.googleusercontent.com',
      );
    }

    await ensureInitialized();

    try {
      final account = await GoogleSignIn.instance.authenticate(
        scopeHint: const ['email', 'profile'],
      );
      final idToken = account.authentication.idToken;
      if (idToken == null || idToken.isEmpty) {
        throw ApiException('Nu s-a primit token de la Google');
      }
      return idToken;
    } on GoogleSignInException catch (e) {
      if (e.code == GoogleSignInExceptionCode.canceled) {
        throw ApiException('Autentificare Google anulată');
      }
      throw ApiException('Autentificare Google eșuată: ${e.description ?? e.code.name}');
    }
  }

  Future<void> signOut() async {
    if (!_initialized) return;
    await GoogleSignIn.instance.signOut();
  }
}
