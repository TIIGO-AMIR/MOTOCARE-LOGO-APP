import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../database/db_helper.dart';
import '../models/motorcycle.dart';
import '../models/service_record.dart';
import 'add_edit_service_screen.dart';
import 'add_edit_motorcycle_screen.dart';

class MotorcycleDetailScreen extends StatefulWidget {
  final Motorcycle motorcycle;

  const MotorcycleDetailScreen({Key? key, required this.motorcycle}) : super(key: key);

  @override
  State<MotorcycleDetailScreen> createState() => _MotorcycleDetailScreenState();
}

class _MotorcycleDetailScreenState extends State<MotorcycleDetailScreen> {
  final dbHelper = DatabaseHelper.instance;
  final ugxFormat = NumberFormat.currency(locale: 'en_UG', symbol: 'UGX ', decimalDigits: 0);

  late Motorcycle _currentMoto;
  List<ServiceRecord> _services = [];
  int _totalSpent = 0;
  bool _isLoading = true;
  bool _sortAsc = false;

  @override
  void initState() {
    super.initState();
    _currentMoto = widget.motorcycle;
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    setState(() => _isLoading = true);
    final sList = await dbHelper.getServicesForMotorcycle(_currentMoto.id);
    final total = await dbHelper.getMotorcycleExpenditure(_currentMoto.id);

    sList.sort((a, b) {
      final diff = a.serviceDate.compareTo(b.serviceDate);
      return _sortAsc ? diff : -diff;
    });

    if (mounted) {
      setState(() {
        _services = sList;
        _totalSpent = total;
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteService(ServiceRecord record) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Delete Service Entry?', style: TextStyle(color: Colors.white)),
        content: Text('Delete "${record.workDone}" (${record.serviceDate})? Expenditure will decrease accordingly.', style: const TextStyle(color: Color(0xFF94A3B8))),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel', style: TextStyle(color: Colors.white70))),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red[700]),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await dbHelper.deleteService(record.id);
      _loadHistory();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_currentMoto.plateNumber),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => AddEditMotorcycleScreen(motorcycle: _currentMoto)),
              );
              final all = await dbHelper.getAllMotorcycles();
              final updated = all.firstWhere((m) => m.id == _currentMoto.id, orElse: () => _currentMoto);
              setState(() => _currentMoto = updated);
            },
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFEA580C)))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Vehicle Profile Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF334155)),
                  ),
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
                              _currentMoto.plateNumber,
                              style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ),
                          Text('Year: ${_currentMoto.year ?? 'N/A'}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        '${_currentMoto.make} ${_currentMoto.model}',
                        style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      if (_currentMoto.notes != null && _currentMoto.notes!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(_currentMoto.notes!, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                      ],
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('TOTAL SPENT', style: TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 2),
                                  Text(ugxFormat.format(_totalSpent), style: const TextStyle(color: Color(0xFFEA580C), fontSize: 14, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('SERVICES', style: TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 2),
                                  Text('${_services.length} visits', style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // History Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('SERVICE HISTORY (DATE ORDER)', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                    Row(
                      children: [
                        IconButton(
                          icon: Icon(_sortAsc ? Icons.arrow_upward : Icons.arrow_downward, size: 18, color: Colors.white70),
                          onPressed: () {
                            setState(() => _sortAsc = !_sortAsc);
                            _loadHistory();
                          },
                        ),
                        ElevatedButton.icon(
                          onPressed: () async {
                            await Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => AddEditServiceScreen(preselectedMotorcycleId: _currentMoto.id)),
                            );
                            _loadHistory();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEA580C),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          ),
                          icon: const Icon(Icons.add, size: 16),
                          label: const Text('Add', style: TextStyle(fontSize: 12)),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                if (_services.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Text('No service records linked to this motorcycle yet.', style: TextStyle(color: Color(0xFF94A3B8))),
                    ),
                  )
                else
                  ..._services.map((s) {
                    return Card(
                      color: const Color(0xFF1E293B),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: Color(0xFF334155)),
                      ),
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        title: Text(s.workDone, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14)),
                        subtitle: Text('${s.serviceDate} • ${s.notes ?? s.category}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(ugxFormat.format(s.cost), style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 13)),
                            IconButton(
                              icon: const Icon(Icons.edit, size: 16, color: Colors.white70),
                              onPressed: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => AddEditServiceScreen(serviceRecord: s)),
                                );
                                _loadHistory();
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, size: 16, color: Colors.redAccent),
                              onPressed: () => _deleteService(s),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
              ],
            ),
    );
  }
}
