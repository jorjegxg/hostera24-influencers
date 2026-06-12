import 'package:hostera24/data/local_store.dart';
import 'package:hostera24/services/api_client.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/google_auth_service.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/services/sync_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum UserRole { firma, angajat }

class AuthSession {
  const AuthSession({
    required this.token,
    required this.firmaId,
    required this.email,
    this.role = UserRole.firma,
    this.firmaNume,
  });

  final String token;

  /// ID-ul firmei (pentru angajați: firma la care lucrează).
  final int firmaId;
  final String email;
  final UserRole role;

  /// Numele firmei — afișat în profilul angajatului.
  final String? firmaNume;

  bool get isAngajat => role == UserRole.angajat;
}

class AuthService {
  AuthService._();
  static final AuthService instance = AuthService._();

  static const _tokenKey = 'auth_token';
  static const _firmaIdKey = 'firma_id';
  static const _emailKey = 'firma_email';
  static const _roleKey = 'auth_role';
  static const _firmaNumeKey = 'firma_nume';

  final ApiClient api = ApiClient();
  AuthSession? _session;

  AuthSession? get session => _session;
  bool get isLoggedIn => _session != null;

  Future<void> restoreSession() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    final firmaId = prefs.getInt(_firmaIdKey);
    final email = prefs.getString(_emailKey);
    final role = prefs.getString(_roleKey) == 'angajat'
        ? UserRole.angajat
        : UserRole.firma;
    final firmaNume = prefs.getString(_firmaNumeKey);

    if (token == null || firmaId == null || email == null) {
      _session = null;
      api.setToken(null);
      return;
    }

    _session = AuthSession(
      token: token,
      firmaId: firmaId,
      email: email,
      role: role,
      firmaNume: firmaNume,
    );
    api.setToken(token);
  }

  Future<AuthSession> login({
    required String email,
    required String parola,
  }) async {
    return _authenticate(
      () => api.login(email: email, parola: parola),
    );
  }

  Future<AuthSession> register({
    required String email,
    required String parola,
  }) async {
    return _authenticate(
      () => api.register(email: email, parola: parola),
    );
  }

  Future<AuthSession> signInWithGoogle() async {
    try {
      final idToken = await GoogleAuthService.instance.signInAndGetIdToken();
      return _authenticate(() => api.loginWithGoogle(idToken: idToken));
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Autentificare Google eșuată: $e');
    }
  }

  Future<AuthSession> _authenticate(
    Future<Map<String, dynamic>> Function() request,
  ) async {
    try {
      final data = await request();
      return _persistSession(data);
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
        'Nu mă pot conecta la server. Verifică că backend-ul rulează. ($e)',
      );
    }
  }

  Future<AuthSession> _persistSession(Map<String, dynamic> data) async {
    final token = data['accessToken'] as String;
    final role = data['role'] == 'angajat' ? UserRole.angajat : UserRole.firma;
    final firma = data['firma'] as Map<String, dynamic>;
    final angajat = data['angajat'] as Map<String, dynamic>?;
    final email = role == UserRole.angajat && angajat != null
        ? angajat['email'] as String
        : firma['email'] as String;
    final session = AuthSession(
      token: token,
      firmaId: firma['id'] as int,
      email: email,
      role: role,
      firmaNume: firma['nume'] as String?,
    );

    _session = session;
    api.setToken(token);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setInt(_firmaIdKey, session.firmaId);
    await prefs.setString(_emailKey, session.email);
    await prefs.setString(
      _roleKey,
      role == UserRole.angajat ? 'angajat' : 'firma',
    );
    if (session.firmaNume != null) {
      await prefs.setString(_firmaNumeKey, session.firmaNume!);
    } else {
      await prefs.remove(_firmaNumeKey);
    }

    if (NetworkService.instance.isOnline) {
      await SyncService.instance.syncPendingScans();
      // Angajații nu au acces la lista codurilor — nu o pot pune în cache.
      if (role == UserRole.firma) {
        try {
          final entries = await api.fetchCoduriQr();
          await LocalStore.instance.saveQrList(session.firmaId, entries);
        } catch (_) {}
      }
    }

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
    await prefs.remove(_roleKey);
    await prefs.remove(_firmaNumeKey);
  }
}
