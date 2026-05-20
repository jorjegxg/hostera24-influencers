import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:hostera24/services/api_exception.dart';

class NetworkService {
  NetworkService._();
  static final NetworkService instance = NetworkService._();

  final Connectivity _connectivity = Connectivity();
  bool _isOnline = true;

  bool get isOnline => _isOnline;

  final StreamController<bool> _onlineController =
      StreamController<bool>.broadcast();

  Stream<bool> get onlineStream => _onlineController.stream;

  Future<void> initialize() async {
    final results = await _connectivity.checkConnectivity();
    _updateFromResults(results);
    _connectivity.onConnectivityChanged.listen(_updateFromResults);
  }

  void _updateFromResults(List<ConnectivityResult> results) {
    final online = results.any((r) => r != ConnectivityResult.none);
    if (online == _isOnline) return;
    _isOnline = online;
    _onlineController.add(online);
  }

  void requireOnline([String? message]) {
    if (_isOnline) return;
    throw ApiException(
      message ??
          'Această acțiune necesită internet. Conectează-te și încearcă din nou.',
    );
  }

  Future<bool> checkOnline() async {
    final results = await _connectivity.checkConnectivity();
    _updateFromResults(results);
    return _isOnline;
  }
}
