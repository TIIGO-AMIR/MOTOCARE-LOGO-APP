import 'package:flutter/material.dart';
import '../database/db_helper.dart';
import '../models/motorcycle.dart';

class AddEditMotorcycleScreen extends StatefulWidget {
  final Motorcycle? motorcycle;

  const AddEditMotorcycleScreen({Key? key, this.motorcycle}) : super(key: key);

  @override
  State<AddEditMotorcycleScreen> createState() => _AddEditMotorcycleScreenState();
}

class _AddEditMotorcycleScreenState extends State<AddEditMotorcycleScreen> {
  final _formKey = GlobalKey<FormState>();
  final dbHelper = DatabaseHelper.instance;

  late TextEditingController _plateController;
  late TextEditingController _makeController;
  late TextEditingController _modelController;
  late TextEditingController _yearController;
  late TextEditingController _notesController;

  @override
  void initState() {
    super.initState();
    _plateController = TextEditingController(text: widget.motorcycle?.plateNumber ?? '');
    _makeController = TextEditingController(text: widget.motorcycle?.make ?? '');
    _modelController = TextEditingController(text: widget.motorcycle?.model ?? '');
    _yearController = TextEditingController(text: widget.motorcycle?.year != null ? widget.motorcycle!.year.toString() : '');
    _notesController = TextEditingController(text: widget.motorcycle?.notes ?? '');
  }

  @override
  void dispose() {
    _plateController.dispose();
    _makeController.dispose();
    _modelController.dispose();
    _yearController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _saveMotorcycle() async {
    if (!_formKey.currentState!.validate()) return;

    final now = DateTime.now().toIso8601String();
    final yearVal = _yearController.text.trim().isNotEmpty ? int.tryParse(_yearController.text.trim()) : null;

    if (widget.motorcycle == null) {
      final newMoto = Motorcycle(
        id: 'bike-${DateTime.now().millisecondsSinceEpoch}',
        plateNumber: _plateController.text.trim().toUpperCase(),
        make: _makeController.text.trim(),
        model: _modelController.text.trim(),
        year: yearVal,
        notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
        createdAt: now,
        updatedAt: now,
      );
      await dbHelper.insertMotorcycle(newMoto);
    } else {
      final updated = widget.motorcycle!.copyWith(
        plateNumber: _plateController.text.trim().toUpperCase(),
        make: _makeController.text.trim(),
        model: _modelController.text.trim(),
        year: yearVal,
        notes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
        updatedAt: now,
      );
      await dbHelper.updateMotorcycle(updated);
    }

    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.motorcycle != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Motorcycle' : 'Register Motorcycle'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Plate Number
            TextFormField(
              controller: _plateController,
              textCapitalization: TextCapitalization.characters,
              style: const TextStyle(color: Colors.white, fontFamily: 'monospace'),
              decoration: _inputDecoration('Registration / Plate Number *', 'e.g. UDD 452A'),
              validator: (val) {
                if (val == null || val.trim().isEmpty) {
                  return 'Registration number is required';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Make
            TextFormField(
              controller: _makeController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Make / Manufacturer *', 'e.g. Bajaj, TVS, Yamaha, Honda'),
              validator: (val) {
                if (val == null || val.trim().isEmpty) {
                  return 'Motorcycle make is required';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Model
            TextFormField(
              controller: _modelController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Model *', 'e.g. Boxer BM100, Star HLX, Crux'),
              validator: (val) {
                if (val == null || val.trim().isEmpty) {
                  return 'Motorcycle model is required';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Year
            TextFormField(
              controller: _yearController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Year of Manufacture (optional)', 'e.g. 2023'),
              validator: (val) {
                if (val != null && val.trim().isNotEmpty) {
                  final y = int.tryParse(val.trim());
                  if (y == null || y < 1960 || y > 2030) {
                    return 'Please enter a valid year';
                  }
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // Notes
            TextFormField(
              controller: _notesController,
              style: const TextStyle(color: Colors.white),
              decoration: _inputDecoration('Owner / Fleet Notes (optional)', 'e.g. Kampala Route Unit #3'),
              maxLines: 2,
            ),
            const SizedBox(height: 24),

            ElevatedButton(
              onPressed: _saveMotorcycle,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEA580C),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isEditing ? 'Save Changes' : 'Register Motorcycle', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
