import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:hostera24/config/api_config.dart';
import 'package:hostera24/models/qr_entry.dart';
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
    final response = await _http.post(
      Uri.parse('${ApiConfig.baseUrl}/auth/login'),
      headers: _jsonHeaders(),
      body: jsonEncode({'email': email.trim().toLowerCase(), 'parola': parola}),
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
    String? pretRedus,
  }) async {
    final response = await _http.post(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr'),
      headers: _authHeaders(),
      body: jsonEncode(_codQrBody(
        numePostareClienti: numePostareClienti,
        numePostareFirme: numePostareFirme,
        pretRedus: pretRedus,
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
    String? pretRedus,
  }) async {
    final response = await _http.patch(
      Uri.parse('${ApiConfig.baseUrl}/coduri-qr/$id'),
      headers: _authHeaders(),
      body: jsonEncode(_codQrBody(
        numePostareClienti: numePostareClienti,
        numePostareFirme: numePostareFirme,
        pretRedus: pretRedus,
      )),
    );

    final data = _decodeMap(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return QrEntry.fromJson(data);
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
    String? pretRedus,
  }) {
    return {
      'numePostareClienti': numePostareClienti?.trim(),
      'numePostareFirme': numePostareFirme?.trim(),
      'pretRedus': pretRedus?.trim(),
    };
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
