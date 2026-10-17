import 'dart:async';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import '../models/motorcycle.dart';
import '../models/service_record.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('motorcycle_service_log.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE motorcycles (
        id TEXT PRIMARY KEY,
        plateNumber TEXT NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER,
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE service_records (
        id TEXT PRIMARY KEY,
        motorcycleId TEXT NOT NULL,
        serviceDate TEXT NOT NULL,
        workDone TEXT NOT NULL,
        cost INTEGER NOT NULL,
        notes TEXT,
        category TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (motorcycleId) REFERENCES motorcycles (id) ON DELETE CASCADE
      )
    ''');

    // Seed initial data from documentation example (Oil change 25k, Brake 40k, Chain 15k => 80k UGX)
    final now = DateTime.now().toIso8601String();
    await db.insert('motorcycles', {
      'id': 'bike-1',
      'plateNumber': 'UDD 452A',
      'make': 'Bajaj',
      'model': 'Boxer BM100',
      'year': 2022,
      'notes': 'Kampala Boda Boda Unit #1',
      'createdAt': now,
      'updatedAt': now,
    });

    await db.insert('service_records', {
      'id': 'srv-1',
      'motorcycleId': 'bike-1',
      'serviceDate': '2026-09-20',
      'workDone': 'Oil change',
      'cost': 25000,
      'notes': 'Castrol 20W-50 oil and fresh filter',
      'category': 'oil',
      'createdAt': now,
      'updatedAt': now,
    });

    await db.insert('service_records', {
      'id': 'srv-2',
      'motorcycleId': 'bike-1',
      'serviceDate': '2026-09-28',
      'workDone': 'Brake adjustment',
      'cost': 40000,
      'notes': 'Replaced rear brake shoes',
      'category': 'brakes',
      'createdAt': now,
      'updatedAt': now,
    });

    await db.insert('service_records', {
      'id': 'srv-3',
      'motorcycleId': 'bike-1',
      'serviceDate': '2026-10-05',
      'workDone': 'Chain replacement',
      'cost': 15000,
      'notes': 'Heavy duty 428 chain installed',
      'category': 'chain',
      'createdAt': now,
      'updatedAt': now,
    });
  }

  // --- Motorcycle CRUD ---

  Future<List<Motorcycle>> getAllMotorcycles() async {
    final db = await instance.database;
    final result = await db.query('motorcycles', orderBy: 'createdAt DESC');
    return result.map((json) => Motorcycle.fromMap(json)).toList();
  }

  Future<int> insertMotorcycle(Motorcycle moto) async {
    final db = await instance.database;
    return await db.insert('motorcycles', moto.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<int> updateMotorcycle(Motorcycle moto) async {
    final db = await instance.database;
    return await db.update(
      'motorcycles',
      moto.toMap(),
      where: 'id = ?',
      whereArgs: [moto.id],
    );
  }

  Future<int> deleteMotorcycle(String id) async {
    final db = await instance.database;
    // Delete linked service records first or rely on cascade
    await db.delete('service_records', where: 'motorcycleId = ?', whereArgs: [id]);
    return await db.delete('motorcycles', where: 'id = ?', whereArgs: [id]);
  }

  // --- ServiceRecord CRUD ---

  Future<List<ServiceRecord>> getAllServices() async {
    final db = await instance.database;
    final result = await db.query('service_records', orderBy: 'serviceDate DESC');
    return result.map((json) => ServiceRecord.fromMap(json)).toList();
  }

  Future<List<ServiceRecord>> getServicesForMotorcycle(String motorcycleId) async {
    final db = await instance.database;
    final result = await db.query(
      'service_records',
      where: 'motorcycleId = ?',
      whereArgs: [motorcycleId],
      orderBy: 'serviceDate DESC',
    );
    return result.map((json) => ServiceRecord.fromMap(json)).toList();
  }

  Future<int> insertService(ServiceRecord record) async {
    final db = await instance.database;
    return await db.insert('service_records', record.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<int> updateService(ServiceRecord record) async {
    final db = await instance.database;
    return await db.update(
      'service_records',
      record.toMap(),
      where: 'id = ?',
      whereArgs: [record.id],
    );
  }

  Future<int> deleteService(String id) async {
    final db = await instance.database;
    return await db.delete('service_records', where: 'id = ?', whereArgs: [id]);
  }

  // --- Calculations ---

  Future<int> getTotalExpenditure() async {
    final db = await instance.database;
    final result = await db.rawQuery('SELECT SUM(cost) as total FROM service_records');
    final total = result.first['total'];
    return (total != null) ? (total as num).toInt() : 0;
  }

  Future<int> getMotorcycleExpenditure(String motorcycleId) async {
    final db = await instance.database;
    final result = await db.rawQuery(
      'SELECT SUM(cost) as total FROM service_records WHERE motorcycleId = ?',
      [motorcycleId],
    );
    final total = result.first['total'];
    return (total != null) ? (total as num).toInt() : 0;
  }
}
