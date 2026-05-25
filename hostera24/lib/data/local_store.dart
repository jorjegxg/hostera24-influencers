import 'dart:convert';

import 'package:hostera24/models/qr_entry.dart';
import 'package:path/path.dart' as p;
import 'package:sqflite/sqflite.dart';

class LocalStore {
  LocalStore._();
  static final LocalStore instance = LocalStore._();

  Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _open();
    return _db!;
  }

  Future<Database> _open() async {
    final base = await getDatabasesPath();
    final path = p.join(base, 'hostera24_offline.db');
    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE qr_list_cache (
            firma_id INTEGER PRIMARY KEY,
            data TEXT NOT NULL,
            updated_at INTEGER NOT NULL
          )
        ''');
        await db.execute('''
          CREATE TABLE scan_outbox (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firma_id INTEGER NOT NULL,
            payload TEXT NOT NULL,
            created_at INTEGER NOT NULL
          )
        ''');
      },
    );
  }

  Future<void> saveQrList(int firmaId, List<QrEntry> entries) async {
    final db = await database;
    final jsonList = entries.map(_entryToJson).toList();
    await db.insert(
      'qr_list_cache',
      {
        'firma_id': firmaId,
        'data': jsonEncode(jsonList),
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<QrEntry>?> loadQrList(int firmaId) async {
    final db = await database;
    final rows = await db.query(
      'qr_list_cache',
      where: 'firma_id = ?',
      whereArgs: [firmaId],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    final list = jsonDecode(rows.first['data']! as String) as List<dynamic>;
    return list
        .map((e) => QrEntry.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> enqueueScan({
    required int firmaId,
    required String payload,
  }) async {
    final db = await database;
    await db.insert('scan_outbox', {
      'firma_id': firmaId,
      'payload': payload.trim(),
      'created_at': DateTime.now().millisecondsSinceEpoch,
    });
  }

  Future<List<Map<String, Object?>>> pendingScans(int firmaId) async {
    final db = await database;
    return db.query(
      'scan_outbox',
      where: 'firma_id = ?',
      whereArgs: [firmaId],
      orderBy: 'created_at ASC',
    );
  }

  Future<int> pendingScanCount(int firmaId) async {
    final db = await database;
    final result = await db.rawQuery(
      'SELECT COUNT(*) AS c FROM scan_outbox WHERE firma_id = ?',
      [firmaId],
    );
    return Sqflite.firstIntValue(result) ?? 0;
  }

  Future<void> removeScanOutbox(int id) async {
    final db = await database;
    await db.delete('scan_outbox', where: 'id = ?', whereArgs: [id]);
  }

  Map<String, dynamic> _entryToJson(QrEntry entry) {
    return {
      'id': entry.id,
      'cod': entry.cod,
      'numePostareFirme': entry.firmaDescription,
      'numePostareClienti': entry.clientDescription,
      'pret': entry.pret,
      'reducere': entry.reducere,
      'creatLa': entry.createdAt.toUtc().toIso8601String(),
      'numarScanari': entry.numarScanari,
      ...entry.schedule.toApiBody(),
    };
  }
}
