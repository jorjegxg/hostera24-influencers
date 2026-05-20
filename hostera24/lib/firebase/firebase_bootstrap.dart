import 'package:firebase_core/firebase_core.dart';
import 'package:hostera24/config/root_env.dart';
import 'package:hostera24/firebase/firebase_google_config.dart';
import 'package:hostera24/firebase_options.dart';

/// Inițializare Firebase (FlutterFire + opțional override din `.env`).
abstract final class FirebaseBootstrap {
  static var _initialized = false;

  static bool get isConfigured {
    if (!DefaultFirebaseOptions.isPlaceholder) {
      return DefaultFirebaseOptions.android.projectId.isNotEmpty;
    }
    RootEnv.load();
    return RootEnv.get('FIREBASE_PROJECT_ID').isNotEmpty &&
        RootEnv.get('FIREBASE_API_KEY').isNotEmpty &&
        RootEnv.get('FIREBASE_APP_ID').isNotEmpty;
  }

  static Future<void> initialize() async {
    if (_initialized || !isConfigured) return;

    final options = DefaultFirebaseOptions.isPlaceholder
        ? _optionsFromEnv()
        : DefaultFirebaseOptions.currentPlatform;

    await Firebase.initializeApp(options: options);
    _initialized = true;
  }

  static FirebaseOptions _optionsFromEnv() {
    return FirebaseOptions(
      apiKey: RootEnv.get('FIREBASE_API_KEY'),
      appId: RootEnv.get('FIREBASE_APP_ID'),
      messagingSenderId: RootEnv.get('FIREBASE_MESSAGING_SENDER_ID'),
      projectId: RootEnv.get('FIREBASE_PROJECT_ID'),
      storageBucket: RootEnv.get('FIREBASE_STORAGE_BUCKET'),
      iosClientId: RootEnv.get('FIREBASE_IOS_CLIENT_ID'),
      iosBundleId: RootEnv.get('FIREBASE_IOS_BUNDLE_ID'),
      androidClientId: RootEnv.get('FIREBASE_ANDROID_CLIENT_ID'),
    );
  }

  /// OAuth 2.0 Web Client ID — `.env` sau valoarea din `google-services.json`.
  static String get webClientId {
    RootEnv.load();
    final fromEnv = RootEnv.get('FIREBASE_WEB_CLIENT_ID');
    if (fromEnv.isNotEmpty) return fromEnv;
    return FirebaseGoogleConfig.webClientId;
  }

  /// Firebase + Web Client ID gata pentru Google Sign-In.
  static bool get isGoogleSignInReady => isConfigured && webClientId.isNotEmpty;
}
