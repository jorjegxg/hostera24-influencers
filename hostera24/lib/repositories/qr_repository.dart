import 'package:hostera24/data/local_store.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_entry_detail.dart';
import 'package:hostera24/models/qr_scan_page.dart';
import 'package:hostera24/models/scan_result.dart';
import 'package:hostera24/services/api_client.dart';
import 'package:hostera24/services/api_exception.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/utils/qr_payload.dart';

class QrRepository {
  QrRepository({
    ApiClient? api,
    LocalStore? store,
    NetworkService? network,
  })  : _api = api ?? AuthService.instance.api,
        _store = store ?? LocalStore.instance,
        _network = network ?? NetworkService.instance;

  final ApiClient _api;
  final LocalStore _store;
  final NetworkService _network;

  int? get _firmaId => AuthService.instance.session?.firmaId;

  Future<List<QrEntry>> fetchCoduriQr() async {
    final firmaId = _requireFirmaId();

    if (_network.isOnline) {
      try {
        final entries = await _api.fetchCoduriQr();
        await _store.saveQrList(firmaId, entries);
        return entries;
      } on ApiException {
        rethrow;
      } catch (_) {
        final cached = await _store.loadQrList(firmaId);
        if (cached != null) return cached;
        throw ApiException(
          'Nu mă pot conecta la server. Verifică internetul.',
        );
      }
    }

    final cached = await _store.loadQrList(firmaId);
    if (cached != null) return cached;
    throw ApiException(
      'Ești offline și nu există coduri salvate pe telefon. '
      'Deschide lista când ai internet.',
    );
  }

  Future<QrEntryDetail> fetchCodQrDetail(int id) async {
    final entries = await fetchCoduriQr();
    for (final entry in entries) {
      if (entry.id == id) {
        return QrEntryDetail(entry: entry);
      }
    }
    throw ApiException('Codul QR nu a fost găsit în cache.');
  }

  Future<QrScanPage> fetchCodQrScanari(
    int id, {
    int page = 1,
    int limit = 10,
  }) async {
    _network.requireOnline('Istoricul scanărilor necesită internet.');
    return _api.fetchCodQrScanari(id, page: page, limit: limit);
  }

  Future<QrEntry> createCodQr({
    String? numePostareClienti,
    String? numePostareFirme,
    String? pretRedus,
    QrSchedule? schedule,
  }) async {
    _network.requireOnline('Crearea unui cod QR necesită internet.');
    final entry = await _api.createCodQr(
      numePostareClienti: numePostareClienti,
      numePostareFirme: numePostareFirme,
      pretRedus: pretRedus,
      schedule: schedule,
    );
    await _refreshCacheAfterMutation();
    return entry;
  }

  Future<QrEntry> updateCodQr({
    required int id,
    String? numePostareClienti,
    String? numePostareFirme,
    String? pretRedus,
    QrSchedule? schedule,
  }) async {
    _network.requireOnline('Editarea codului QR necesită internet.');
    final entry = await _api.updateCodQr(
      id: id,
      numePostareClienti: numePostareClienti,
      numePostareFirme: numePostareFirme,
      pretRedus: pretRedus,
      schedule: schedule,
    );
    await _refreshCacheAfterMutation();
    return entry;
  }

  Future<void> deleteCodQr(int id) async {
    _network.requireOnline('Ștergerea codului QR necesită internet.');
    await _api.deleteCodQr(id);
    await _refreshCacheAfterMutation();
  }

  Future<ScanResult> scanCodQr(String rawPayload) async {
    final firmaId = _requireFirmaId();
    final payload = rawPayload.trim();

    if (_network.isOnline) {
      return _api.scanCodQr(payload);
    }

    final cod = extractCodFromPayload(payload);
    final cached = await _store.loadQrList(firmaId);
    if (cod != null && cached != null) {
      for (final entry in cached) {
        if (entry.cod.toUpperCase() == cod.toUpperCase()) {
          if (!entry.isScannableNow) {
            return ScanResult(
              status: ScanStatus.unavailable,
              cod: entry.cod,
              mesajProgramare:
                  blockMessageForSchedule(entry.schedule) ??
                  'Codul nu poate fi scanat acum.',
            );
          }
          await _store.enqueueScan(firmaId: firmaId, payload: payload);
          return ScanResult(
            status: ScanStatus.own,
            cod: entry.cod,
            numePostareClienti: entry.clientDescription,
            numePostareFirme: entry.firmaDescription,
            pretRedus: entry.pretRedus,
            numarScanari: entry.numarScanari,
            queuedOffline: true,
          );
        }
      }
    }

    await _store.enqueueScan(firmaId: firmaId, payload: payload);
    return ScanResult(
      status: ScanStatus.queued,
      cod: cod,
      queuedOffline: true,
    );
  }

  Future<void> _refreshCacheAfterMutation() async {
    if (!_network.isOnline) return;
    final firmaId = _firmaId;
    if (firmaId == null) return;
    try {
      final entries = await _api.fetchCoduriQr();
      await _store.saveQrList(firmaId, entries);
    } catch (_) {
      // cache refresh best-effort
    }
  }

  int _requireFirmaId() {
    final id = _firmaId;
    if (id == null) {
      throw ApiException('Nu ești autentificat.');
    }
    return id;
  }
}
