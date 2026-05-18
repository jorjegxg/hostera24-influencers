abstract final class GoogleAuthConfig {
  /// Client ID „Web application” — același ca GOOGLE_CLIENT_ID din backend .env
  static const webClientId = String.fromEnvironment('GOOGLE_WEB_CLIENT_ID');

  static bool get isConfigured => webClientId.isNotEmpty;
}
