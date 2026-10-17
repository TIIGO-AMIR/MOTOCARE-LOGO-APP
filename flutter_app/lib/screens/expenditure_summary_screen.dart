import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../database/db_helper.dart';
import '../models/motorcycle.dart';
import '../models/service_record.dart';
import '../services/pdf_service.dart';

class ExpenditureSummaryScreen extends StatefulWidget {
  const ExpenditureSummaryScreen({Key? key}) : super(key: key);

  @override
  State<ExpenditureSummaryScreen> createState() => _ExpenditureSummaryScreenState();
}

class _ExpenditureSummaryScreenState extends State<ExpenditureSummaryScreen> {
  final dbHelper = DatabaseHelper.instance;
  final ugxFormat = NumberFormat.currency(locale: 'en_UG', symbol: 'UGX ', decimalDigits: 0);

  List<Motorcycle> _motorcycles = [];
  List<ServiceRecord> _services = [];
  int _totalExpenditure = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSummary();
  }

  Future<void> _loadSummary() async {
    setState(() => _isLoading = true);
    final mList = await dbHelper.getAllMotorcycles();
    final sList = await dbHelper.getAllServices();
    final total = await dbHelper.getTotalExpenditure();

    if (mounted) {
      setState(() {
        _motorcycles = mList;
        _services = sList;
        _totalExpenditure = total;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Group totals by motorcycle
    final Map<String, int> motoTotals = {};
    for (var s in _services) {
      motoTotals[s.motorcycleId] = (motoTotals[s.motorcycleId] ?? 0) + s.cost;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Expenditure Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.print, color: Color(0xFFEA580C)),
            tooltip: 'Print / Save PDF Report',
            onPressed: () {
              PdfService.printOverallSummary(
                motorcycles: _motorcycles,
                services: _services,
                totalExpenditure: _totalExpenditure,
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSummary,
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFEA580C)))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Grand Total Banner
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
                          const Text(
                            'TOTAL SERVICING EXPENDITURE',
                            style: TextStyle(color: Color(0xFFEA580C), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              PdfService.printOverallSummary(
                                motorcycles: _motorcycles,
                                services: _services,
                                totalExpenditure: _totalExpenditure,
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEA580C),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            icon: const Icon(Icons.print, size: 16),
                            label: const Text('Print PDF', style: TextStyle(fontSize: 12)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        ugxFormat.format(_totalExpenditure),
                        style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Sum of all ${_services.length} recorded service entries across ${_motorcycles.length} motorcycles.',
                        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Breakdown by Motorcycle
                const Text('EXPENDITURE BY MOTORCYCLE', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                const SizedBox(height: 8),

                if (_motorcycles.isEmpty)
                  const Text('No motorcycles added yet.', style: TextStyle(color: Colors.white70))
                else
                  ..._motorcycles.map((m) {
                    final spent = motoTotals[m.id] ?? 0;
                    final pct = _totalExpenditure > 0 ? (spent / _totalExpenditure) : 0.0;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF334155)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('${m.plateNumber} (${m.make} ${m.model})', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                              Text(ugxFormat.format(spent), style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 13)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: pct,
                              minHeight: 6,
                              backgroundColor: const Color(0xFF0F172A),
                              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFEA580C)),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Align(
                            alignment: Alignment.centerRight,
                            child: Text('${(pct * 100).toStringAsFixed(1)}% of total expenditure', style: const TextStyle(color: Color(0xFF64748B), fontSize: 10)),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
              ],
            ),
    );
  }
}
