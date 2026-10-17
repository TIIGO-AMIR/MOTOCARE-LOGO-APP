import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../database/db_helper.dart';
import '../models/motorcycle.dart';
import '../models/service_record.dart';

class AddEditServiceScreen extends StatefulWidget {
  final ServiceRecord? serviceRecord;
  final String? preselectedMotorcycleId;

  const AddEditServiceScreen({Key? key, this.serviceRecord, this.preselectedMotorcycleId}) : super(key: key);

  @override
  State<AddEditServiceScreen> createState() => _AddEditServiceScreenState();
}

class _AddEditServiceScreenState extends State<AddEditServiceScreen> {
  final _formKey = GlobalKey<FormState>();
  final dbHelper = DatabaseHelper.instance;

  String? _selectedMotorcycleId;
  late TextEditingController _dateController;
  late TextEditingController _workController;
  late TextEditingController _costController;
  late TextEditingController _notesController;
  String _category = 'general';

  List<Motorcycle> _motorcycles = [];
  bool _loading = true;

  final List<Map<String, dynamic>> _quickPresets = [
    {'label': 'Oil change', 'cost': 25000, 'cat': 'oil'},
    {'label': 'Brake adjustment', 'cost': 40000, 'cat': 'brakes'},
    {'label': 'Chain replacement', 'cost': 15000, 'cat': 'chain'},
    {'label': 'Tire / tube repair', 'cost': 10000, 'cat': 'tires'},
    {'label': 'Full service', 'cost': 50000, 'cat': 'general'},
  ];

  @override
  void initState() {
    super.initState();
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    _dateController = TextEditingController(text: widget.serviceRecord?.serviceDate ?? today);
    _workController = TextEditingController(text: widget.serviceRecord?.workDone ?? '');
    _costController = TextEditingController(text: widget.serviceRecord?.cost != null ? widget.serviceRecord!.cost.toString() : '');
    _notesController = TextEditingController(text: widget.serviceRecord?.notes ?? '');
    _category = widget.serviceRecord?.category ?? 'general';
    _selectedMotorcycleId = widget.serviceRecord?.motorcycleId ?? widget.preselectedMotorcycleId;

    _loadMotorcycles();
  }

  Future<void> _loadMotorcycles() async {
    final list = await dbHelper.getAllMotorcycles();
    if (mounted) {
      setState(() {
        _motorcycles = list;
        if (_selectedMotorcycleId == null && list.isNotEmpty) {
          _selectedMotorcycleId = list.first.id;
        }
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _dateController.dispose();
    _workController.dispose();
    _costController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _saveService() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedMotorcycleId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please register a motorcycle first.')));
      return;
    }

    final now = DateTime.now().toIso8601String();
    final costVal = int.parse(_costController.text.trim());

    if (widget.serviceRecord == null) {
      final newRecord = ServiceRecord(
        id: 'srv-${DateTime.now().millisecondsSinceEpoch}',
        motorcycleId: _selectedMotorcycleId!,
        serviceDate: _dateController.text.trim(),
        workDone: _workController.text.trim(),
        cost: costVal,
        notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
        category: _category,
        createdAt: now,
        updatedAt: now,
      );
      await dbHelper.insertService(newRecord);
    } else {
      final updated = widget.serviceRecord!.copyWith(
        motorcycleId: _selectedMotorcycleId!,
        serviceDate: _dateController.text.trim(),
        workDone: _workController.text.trim(),
        cost: costVal,
        notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
        category: _category,
        updatedAt: now,
      );
      await dbHelper.updateService(updated);
    }

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.serviceRecord != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Service Record' : 'Record Service Visit'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFEA580C)))
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Select Motorcycle
                  DropdownButtonFormField<String>(
                    value: _selectedMotorcycleId,
                    dropdownColor: const Color(0xFF1E293B),
                    style: const TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Select Motorcycle *', ''),
                    items: _motorcycles.map((m) {
                      return DropdownMenuItem(
                        value: m.id,
                        child: Text('${m.plateNumber} (${m.make} ${m.model})'),
                      );
                    }).toList(),
                    onChanged: (val) => setState(() => _selectedMotorcycleId = val),
                    validator: (val) => val == null ? 'Please select a motorcycle' : null,
                  ),
                  const SizedBox(height: 16),

                  // Service Date
                  TextFormField(
                    controller: _dateController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Service Date (YYYY-MM-DD) *', 'e.g. 2026-10-15'),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) return 'Date is required';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Quick Templates
                  const Text('QUICK TEMPLATES', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _quickPresets.map((preset) {
                      return ActionChip(
                        backgroundColor: const Color(0xFF1E293B),
                        side: const BorderSide(color: Color(0xFF334155)),
                        label: Text('${preset['label']} (UGX ${preset['cost']})', style: const TextStyle(color: Colors.white, fontSize: 12)),
                        onPressed: () {
                          setState(() {
                            _workController.text = preset['label'];
                            _costController.text = preset['cost'].toString();
                            _category = preset['cat'];
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Work Done Description
                  TextFormField(
                    controller: _workController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Work Performed Description *', 'e.g. Oil change and filter replacement'),
                    maxLines: 2,
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) return 'Work description is required';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Cost in UGX
                  TextFormField(
                    controller: _costController,
                    keyboardType: TextInputType.number,
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontFamily: 'monospace'),
                    decoration: _inputDecoration('Service Cost (UGX) *', 'e.g. 25000'),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) return 'Service cost is required';
                      final numVal = int.tryParse(val.trim());
                      if (numVal == null) return 'Must be a valid integer';
                      if (numVal < 0) return 'Cost cannot be negative';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Notes
                  TextFormField(
                    controller: _notesController,
                    style: const TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Mechanic / Parts Notes (optional)', 'e.g. Replaced oil filter, Kalerwe garage'),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 24),

                  ElevatedButton(
                    onPressed: _saveService,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEA580C),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(isEditing ? 'Save Changes' : 'Record Service', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
    );
  }

  InputDecoration _inputDecoration(String label, String hint) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF94A3B8)),
      hintText: hint,
      hintStyle: const TextStyle(color: Color(0xFF475569)),
      filled: true,
      fillColor: const Color(0xFF1E293B),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFEA580C))),
    );
  }
}
