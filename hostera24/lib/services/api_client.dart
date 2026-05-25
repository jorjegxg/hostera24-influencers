import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:hostera24/config/api_config.dart';
import 'package:hostera24/models/firma_profile.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/models/qr_entry_detail.dart';
import 'package:hostera24/models/qr_scan_page.dart';
import 'package:hostera24/models/scan_result.dart';
import 'package:hostera24/services/api_exception.dart';

class ApiClient {
  ApiClient({http.Client? httpClient}) : _http = httpClient ?? http.Client();

  final http.Client _http;
  String? _token;

  void setToken(String? token) => _token = token;

  Future<Map<String, dynamic>> login({
    required String email,
    required String parola,
  }) async {
    return _authRequest(
      path: '/auth/login',
      body: {'email': email.trim().toLowerCase(), 'parola': parola},
    );
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String parola,
  }) async {
    return _authRequest(
      path: '/auth/register',
      body: {'email': email.trim().toLowerCase(), 'parola': parola},
    );
  }

  Future<Map<String, dynamic>> loginWithGoogle({
    required String idToken,
  }) async {
    return _authRequest(
      path: '/auth/google',
      body: {'idToken': idToken},
    );
  }

  Future<Map<String, dynamic>> _authRequest({
    required String path,
    required Map<String, dynamic> body,
  }) async {
    final response = await _http.post(
      Uri.parse('${ApiConfig.baseUrl}$path'),
      headers: _jsonHeaders(),
      body: jsonEncode(body),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<List<QrEntry>> fetchCoduriQr() async {
    final response = await _http.get(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr'),
      headers: _authHeaders(),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      final list = jsonDecode(response.body) as List<dynamic>;
      return list
          .map((item) => QrEntry.fromJson(item as Map<String, dynamic>))
          .toList();
    }

    final data = _tryDecodeMap(response.body);
    throw ApiException(
      _messageFromBody(data),
      statusCode: response.statusCode,
    );
  }

  Future<QrEntryDetail> fetchCodQrDetail(int id) async {
    final response = await _http.get(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr/$id'),
      headers: _authHeaders(),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return QrEntryDetail.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<QrScanPage> fetchCodQrScanari(
    int id, {
    int page = 1,
    int limit = 10,
  }) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/coduri-qr/$id/scanari').replace(
      queryParameters: {
        'page': page.toString(),
        'limit': limit.toString(),
      },
    );

    final response = await _http.get(uri, headers: _authHeaders());

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return QrScanPage.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<ScanResult> scanCodQr(String payload) async {
    final response = await _http.post(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr/scan'),
      headers: _authHeaders(),
      body: jsonEncode({'payload': payload.trim()}),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return ScanResult.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<QrEntry> createCodQr({
    String? numePostareClienti,
    String? numePostareFirme,
    String? pret,
    String? pretRedus,
    int? limitaScanari,
    QrSchedule? schedule,
  }) async {
    final response = await _http.post(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr'),
      headers: _authHeaders(),
      body: jsonEncode(_codQrBody(
        numePostareClienti: numePostareClienti,
        numePostareFirme: numePostareFirme,
        pret: pret,
        pretRedus: pretRedus,
        limitaScanari: limitaScanari,
        schedule: schedule,
      )),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return QrEntry.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<QrEntry> updateCodQr({
    required int id,
    String? numePostareClienti,
    String? numePostareFirme,
    String? pret,
    String? pretRedus,
    int? limitaScanari,
    bool clearLimitaScanari = false,
    QrSchedule? schedule,
  }) async {
    final response = await _http.patch(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr/$id'),
      headers: _authHeaders(),
      body: jsonEncode(_codQrBody(
        numePostareClienti: numePostareClienti,
        numePostareFirme: numePostareFirme,
        pret: pret,
        pretRedus: pretRedus,
        limitaScanari: limitaScanari,
        clearLimitaScanari: clearLimitaScanari,
        schedule: schedule,
      )),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return QrEntry.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<FirmaProfile> fetchFirmaProfil() async {
    final response = await _http.get(
      Uri.parse('${ApiConfig.baseUrl}/firma/profil'),
      headers: _authHeaders(),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return FirmaProfile.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<FirmaProfile> updateFirmaProfil({
    String? nume,
    String? telefon,
    String? descriere,
    String? website,
    String? logoUrl,
  }) async {
    final response = await _http.patch(
      Uri.parse('${ApiConfig.baseUrl}/firma/profil'),
      headers: _authHeaders(),
      body: jsonEncode({
        if (nume != null) 'nume': nume.trim(),
        if (telefon != null) 'telefon': telefon.trim(),
        if (descriere != null) 'descriere': descriere.trim(),
        if (website != null) 'website': website.trim(),
        if (logoUrl != null) 'logoUrl': logoUrl.trim(),
      }),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return FirmaProfile.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<FirmaProfile> uploadFirmaLogo(String filePath) async {
    final file = File(filePath);
    if (!await file.exists()) {
      throw ApiException('Fișierul logo nu există');
    }

    final ext = filePath.split('.').last.toLowerCase();
    final mime = switch (ext) {
      'jpg' || 'jpeg' => 'jpeg',
      'png' => 'png',
      'webp' => 'webp',
      'gif' => 'gif',
      _ => throw ApiException('Format imagine neacceptat (JPEG, PNG, WebP, GIF)'),
    };

    final request = http.MultipartRequest(
      'POST',
      Uri.parse('${ApiConfig.baseUrl}/firma/profil/logo'),
    );
    final token = _token;
    if (token != null && token.isNotEmpty) {
      request.headers['Authorization'] = 'Bearer $token';
    }
    request.files.add(
      await http.MultipartFile.fromPath(
        'logo',
        filePath,
        contentType: MediaType('image', mime),
      ),
    );

    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return FirmaProfile.fromJson(data);
    }
    throw ApiException(_messageFromBody(data), statusCode: response.statusCode);
  }

  Future<void> deleteCodQr(int id) async {
    final response = await _http.delete(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr/$id'),
      headers: _authHeaders(),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) return;

    final data = _tryDecodeMap(response.body);
    throw ApiException(
      _messageFromBody(data),
      statusCode: response.statusCode,
    );
  }

  Map<String, dynamic> _codQrBody({
    String? numePostareClienti,
    String? numePostareFirme,
    String? pret,
    String? pretRedus,
    int? limitaScanari,
    bool clearLimitaScanari = false,
    QrSchedule? schedule,
  }) {
    final body = <String, dynamic>{
      'numePostareClienti': numePostareClienti?.trim(),
      'numePostareFirme': numePostareFirme?.trim(),
      'pret': pret?.trim(),
      'pretRedus': pretRedus?.trim(),
      if (schedule != null) ...schedule.toApiBody(),
    };
    if (clearLimitaScanari) {
      body['limitaScanari'] = null;
    } else if (limitaScanari != null) {
      body['limitaScanari'] = limitaScanari;
    }
    return body;
  }

  Map<String, String> _jsonHeaders() => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  Map<String, String> _authHeaders() {
    final headers = _jsonHeaders();
    if (_token != null && _token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Map<String, dynamic> _decodeMap(http.Response response) {
    if (response.body.isEmpty) return {};
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Map<String, dynamic>? _tryDecodeMap(String body) {
    if (body.isEmpty) return null;
    try {
      return jsonDecode(body) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  String _messageFromBody(Map<String, dynamic>? data) {
    if (data == null) return 'Eroare de rețea';
    final message = data['message'];
    if (message is String) return message;
    if (message is List) return message.join(', ');
    return 'Cerere eșuată';
  }
}
