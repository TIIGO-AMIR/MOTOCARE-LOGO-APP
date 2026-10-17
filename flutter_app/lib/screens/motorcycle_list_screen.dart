import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../database/db_helper.dart';
import '../models/motorcycle.dart';
import 'motorcycle_detail_screen.dart';
import 'add_edit_motorcycle_screen.dart';

class MotorcycleListScreen extends StatefulWidget {
  const MotorcycleListScreen({Key? key}) : super(key: key);

  @override
  State<MotorcycleListScreen> createState() => _MotorcycleListScreenState();
}

class _MotorcycleListScreenState extends State<MotorcycleListScreen> {
  final dbHelper = DatabaseHelper.instance;
  final ugxFormat = NumberFormat.currency(locale: 'en_UG', symbol: 'UGX ', decimalDigits: 0);

  List<Motorcycle> motorcycles = [];
  Map<String, int> motorcycleTotals = {};
  Map<String, int> motorcycleServiceCounts = {};
  String searchQuery = '';
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMotorcycles();
  }

  Future<void> _loadMotorcycles() async {
    setState(() => isLoading = true);
    final list = await dbHelper.getAllMotorcycles();
    final Map<String, int> totals = {};
    final Map<String, int> counts = {};

    for (var m in list) {
      final total = await dbHelper.getMotorcycleExpenditure(m.id);
      final services = await dbHelper.getServicesForMotorcycle(m.id);
      totals[m.id] = total;
      counts[m.id] = services.length;
    }

    if (mounted) {
      setState(() {
        motorcycles = list;
        motorcycleTotals = totals;
        motorcycleServiceCounts = counts;
        isLoading = false;
      });
    }
  }

  Future<void> _deleteMotorcycle(Motorcycle moto) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: Text('Delete ${moto.plateNumber}?', style: const TextStyle(color: Colors.white)),
        content: Text(
          'Are you sure you want to delete ${moto.make} ${moto.model} (${moto.plateNumber})? All associated service history will also be deleted.',
          style: const TextStyle(color: Color(0xFF94A3B8)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.white70)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red[700]),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await dbHelper.deleteMotorcycle(moto.id);
      _loadMotorcycles();
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = motorcycles.where((m) {
      final q = searchQuery.toLowerCase();
      return m.plateNumber.toLowerCase().contains(q) ||
          m.make.toLowerCase().contains(q) ||
          m.model.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Motorcycles Fleet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AddEditMotorcycleScreen()),
              );
              _loadMotorcycles();
            },
          )
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (val) => setState(() => searchQuery = val),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search plate number, make, model...',
                hintStyle: const TextStyle(color: Color(0xFF64748B)),
                prefixIcon: const Icon(Icons.search, color: Color(0xFF64748B)),
                filled: true,
                fillColor: const Color(0xFF1E293B),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF334155)),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),

          // Motorcycle List
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFFEA580C)))
                : filtered.isEmpty
                    ? Center(
                        child: Text(
                          searchQuery.isEmpty ? 'No motorcycles registered yet.' : 'No matching motorcycles.',
                          style: const TextStyle(color: Color(0xFF94A3B8)),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: filtered.length,
                        itemBuilder: (context, index) {
                          final moto = filtered[index];
                          final totalSpent = motorcycleTotals[moto.id] ?? 0;
                          final count = motorcycleServiceCounts[moto.id] ?? 0;

                          return Card(
                            color: const Color(0xFF1E293B),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: const BorderSide(color: Color(0xFF334155)),
                            ),
                            margin: const EdgeInsets.only(bottom: 12),
                            child: InkWell(
                              borderRadius: BorderRadius.circular(12),
                              onTap: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => MotorcycleDetailScreen(motorcycle: moto)),
                                );
                                _loadMotorcycles();
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF0F172A),
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(color: const Color(0xFF475569)),
                                          ),
                                          child: Text(
                                            moto.plateNumber,
                                            style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 13),
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            IconButton(
                                              icon: const Icon(Icons.edit, size: 18, color: Colors.white70),
                                              onPressed: () async {
                                                await Navigator.push(
                                                  context,
                                                  MaterialPageRoute(builder: (_) => AddEditMotorcycleScreen(motorcycle: moto)),
                                                );
                                                _loadMotorcycles();
                                              },
                                            ),
                                            IconButton(
                                              icon: const Icon(Icons.delete, size: 18, color: Colors.redAccent),
                                              onPressed: () => _deleteMotorcycle(moto),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      '${moto.make} ${moto.model}',
                                      style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                                    ),
                                    if (moto.year != null || (moto.notes != null && moto.notes!.isNotEmpty)) ...[
                                      const SizedBox(height: 4),
                                      Text(
                                        '${moto.year != null ? 'Year: ${moto.year}' : ''} ${moto.notes != null ? '• ${moto.notes}' : ''}',
                                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                                      ),
                                    ],
                                    const SizedBox(height: 12),
                                    Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0F172A),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text('Total Spent: ${ugxFormat.format(totalSpent)}', style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 13)),
                                          Text('$count services', style: const TextStyle(color: Colors.white70, fontSize: 12)),
                                        ],
                                      ),
                                    )
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
