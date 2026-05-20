import 'package:hostera24/data/local_store.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/services/network_service.dart';

class SyncService {
  SyncService._();
  static final SyncService instance = SyncService._();

  final LocalStore _store = LocalStore.instance;
  final NetworkService _network = NetworkService.instance;
  bool _syncing = false;

  void initialize() {
    _network.onlineStream.listen((online) {
      if (online) {
        syncPendingScans();
        _refreshQrCache();
      }
    });
  }

  Future<void> syncPendingScans() async {
    if (!_network.isOnline || _syncing) return;
    final firmaId = AuthService.instance.session?.firmaId;
    if (firmaId == null) return;

    _syncing = true;
    try {
      final pending = await _store.pendingScans(firmaId);
      final api = AuthService.instance.api;
      for (final row in pending) {
        final id = row['id'] as int;
        final payload = row['payload'] as String;
        try {
          await api.scanCodQr(payload);
          await _store.removeScanOutbox(id);
        } catch (_) {
          break;
        }
      }
    } finally {
      _syncing = false;
    }
  }

  Future<void> _refreshQrCache() async {
    if (!_network.isOnline) return;
    final firmaId = AuthService.instance.session?.firmaId;
    if (firmaId == null) return;
    try {
      final entries = await AuthService.instance.api.fetchCoduriQr();
      await _store.saveQrList(firmaId, entries);
    } catch (_) {}
  }

  Future<int> pendingScanCount() async {
    final firmaId = AuthService.instance.session?.firmaId;
    if (firmaId == null) return 0;
    return _store.pendingScanCount(firmaId);
  }
}
