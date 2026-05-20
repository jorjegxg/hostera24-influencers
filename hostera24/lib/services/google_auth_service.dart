import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:hostera24/firebase/firebase_bootstrap.dart';
import 'package:hostera24/services/api_exception.dart';

class GoogleAuthService {
  GoogleAuthService._();
  static final GoogleAuthService instance = GoogleAuthService._();

  var _googleInitialized = false;

  Future<void> _ensureGoogleSignInReady() async {
    if (_googleInitialized) return;

    final webClientId = FirebaseBootstrap.webClientId;
    await GoogleSignIn.instance.initialize(
      serverClientId: webClientId.isNotEmpty ? webClientId : null,
    );
    _googleInitialized = true;
  }

  Future<String> signInAndGetIdToken() async {
    if (!FirebaseBootstrap.isConfigured) {
      throw ApiException(
        'Firebase nu este configurat. Completează variabilele FIREBASE_* în .env',
      );
    }

    await _ensureGoogleSignInReady();

    final GoogleSignInAccount googleUser;
    try {
      googleUser = await GoogleSignIn.instance.authenticate();
    } on GoogleSignInException catch (e) {
      if (e.code == GoogleSignInExceptionCode.canceled) {
        throw ApiException('Autentificare Google anulată');
      }
      throw ApiException('Autentificare Google eșuată: ${e.description ?? e.code}');
    }

    final googleAuth = googleUser.authentication;
    final credential = GoogleAuthProvider.credential(
      idToken: googleAuth.idToken,
    );

    final userCredential =
        await FirebaseAuth.instance.signInWithCredential(credential);
    final idToken = await userCredential.user?.getIdToken(true);

    if (idToken == null || idToken.isEmpty) {
      throw ApiException('Nu am putut obține token-ul Firebase');
    }

    return idToken;
  }

  Future<void> signOut() async {
    await FirebaseAuth.instance.signOut();
    if (_googleInitialized) {
      await GoogleSignIn.instance.signOut();
    }
  }
}
