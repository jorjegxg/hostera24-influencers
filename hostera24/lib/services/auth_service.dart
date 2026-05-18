import 'package:hostera24/services/api_client.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/google_auth_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthSession {
  const AuthSession({required this.token, required this.firmaId, required this.email});

  final String token;
  final int firmaId;
  final String email;
}

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  static const _tokenKey = 'auth_token';
  static const _firmaIdKey = 'firma_id';
  static const _emailKey = 'firma_email';

  final ApiClient api = ApiClient();
  AuthSession? _session;

  AuthSession? get session => _session;
  bool get isLoggedIn => _session != null;

  Future<void> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    final firmaId = prefs.getInt(_firmaIdKey);
    final email = prefs.getString(_emailKey);

    if (token == null || firmaId == null || email == null) {
      _session = null;
      api.setToken(null);
      return;
    }

    _session = AuthSession(token: token, firmaId: firmaId, email: email);
    api.setToken(token);
  }

  Future<AuthSession> login({
    required String email,
    required String parola,
  }) async {
    try {
      final data = await api.login(email: email, parola: parola);
      return _persistSession(data);
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException(
        'Nu mă pot conecta la server. Verifică că backend-ul rulează.',
      );
    }
  }

  Future<AuthSession> loginWithGoogle() async {
    try {
      final idToken = await GoogleAuthService.instance.signInForIdToken();
      final data = await api.loginWithGoogle(idToken: idToken);
      return _persistSession(data);
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException(
        'Nu mă pot conecta la server. Verifică că backend-ul rulează.',
      );
    }
  }

  Future<AuthSession> _persistSession(Map<String, dynamic> data) async {
    final token = data['accessToken'] as String;
    final firma = data['firma'] as Map<String, dynamic>;
    final session = AuthSession(
      token: token,
      firmaId: firma['id'] as int,
      email: firma['email'] as String,
    );

    _session = session;
    api.setToken(token);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setInt(_firmaIdKey, session.firmaId);
    await prefs.setString(_emailKey, session.email);

    return session;
  }

  Future<void> logout() async {
    await GoogleAuthService.instance.signOut();
    _session = null;
    api.setToken(null);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_firmaIdKey);
    await prefs.remove(_emailKey);
  }
}
