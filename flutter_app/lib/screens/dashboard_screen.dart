import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../database/db_helper.dart';
import '../models/motorcycle.dart';
import '../models/service_record.dart';
import 'add_edit_service_screen.dart';
import 'add_edit_motorcycle_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final dbHelper = DatabaseHelper.instance;
  final ugxFormat = NumberFormat.currency(locale: 'en_UG', symbol: 'UGX ', decimalDigits: 0);

  List<Motorcycle> motorcycles = [];
  List<ServiceRecord> services = [];
  int totalExpenditure = 0;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => isLoading = true);
    final mList = await dbHelper.getAllMotorcycles();
    final sList = await dbHelper.getAllServices();
    final total = await dbHelper.getTotalExpenditure();

    if (mounted) {
      setState(() {
        motorcycles = mList;
        services = sList;
        totalExpenditure = total;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final avgCost = services.isNotEmpty ? (totalExpenditure / services.length).round() : 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Motorcycle Service Log', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          )
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFEA580C)))
          : RefreshIndicator(
              onRefresh: _loadData,
              color: const Color(0xFFEA580C),
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Hero Header - Plain solid colors
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
                        const Text(
                          'UGANDA MOTORCYCLE FLEET',
                          style: TextStyle(color: Color(0xFFEA580C), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Maintenance & Expenses',
                          style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Keep organized records of service visits and total spending.',
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            ElevatedButton.icon(
                              onPressed: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => const AddEditServiceScreen()),
                                );
                                _loadData();
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFEA580C),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              icon: const Icon(Icons.add, size: 18),
                              label: const Text('Log Service'),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton.icon(
                              onPressed: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (_) => const AddEditMotorcycleScreen()),
                                );
                                _loadData();
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: const BorderSide(color: Color(0xFF475569)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              icon: const Icon(Icons.two_wheeler, size: 18, color: Color(0xFFEA580C)),
                              label: const Text('Add Bike'),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Stat Cards Grid
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          title: 'TOTAL EXPENDITURE',
                          value: ugxFormat.format(totalExpenditure),
                          subtitle: '${services.length} records',
                          icon: Icons.payments,
                          accentColor: const Color(0xFFEA580C),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMetricCard(
                          title: 'MOTORCYCLES',
                          value: '${motorcycles.length}',
                          subtitle: 'Registered',
                          icon: Icons.two_wheeler,
                          accentColor: const Color(0xFF38BDF8),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          title: 'SERVICE VISITS',
                          value: '${services.length}',
                          subtitle: 'Completed',
                          icon: Icons.build_circle,
                          accentColor: const Color(0xFF10B981),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMetricCard(
                          title: 'AVG COST / VISIT',
                          value: ugxFormat.format(avgCost),
                          subtitle: 'Per visit',
                          icon: Icons.trending_up,
                          accentColor: const Color(0xFFA855F7),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Recent Services Section
                  const Text(
                    'RECENT MAINTENANCE VISITS',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1),
                  ),
                  const SizedBox(height: 8),

                  if (services.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF334155)),
                      ),
                      child: const Center(
                        child: Text('No service records recorded yet.', style: TextStyle(color: Colors.white70)),
                      ),
                    )
                  else
                    ...services.take(5).map((s) {
                      final bike = motorcycles.firstWhere(
                        (m) => m.id == s.motorcycleId,
                        orElse: () => Motorcycle(id: '', plateNumber: 'Unknown', make: '', model: '', createdAt: '', updatedAt: ''),
                      );

                      return Card(
                        color: const Color(0xFF1E293B),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: const BorderSide(color: Color(0xFF334155)),
                        ),
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          leading: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F172A),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: const Color(0xFF475569)),
                            ),
                            child: Text(
                              bike.plateNumber,
                              style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 11),
                            ),
                          ),
                          title: Text(s.workDone, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 14)),
                          subtitle: Text('${s.serviceDate} • ${s.category.toUpperCase()}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                          trailing: Text(
                            ugxFormat.format(s.cost),
                            style: const TextStyle(color: Color(0xFFEA580C), fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                      );
                    }).toList(),
                ],
              ),
            ),
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
  }) {
    return Container(
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
              Text(title, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 9, fontWeight: FontWeight.bold)),
              Icon(icon, size: 16, color: accentColor),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(color: Color(0xFF64748B), fontSize: 10)),
        ],
      ),
    );
  }
}
