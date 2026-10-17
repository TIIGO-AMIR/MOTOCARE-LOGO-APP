class ServiceRecord {
  final String id;
  final String motorcycleId;
  final String serviceDate;
  final String workDone;
  final int cost; // Cost in UGX (Ugandan Shillings)
  final String? notes;
  final String category;
  final String createdAt;
  final String updatedAt;

  ServiceRecord({
    required this.id,
    required this.motorcycleId,
    required this.serviceDate,
    required this.workDone,
    required this.cost,
    this.notes,
    required this.category,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'motorcycleId': motorcycleId,
      'serviceDate': serviceDate,
      'workDone': workDone,
      'cost': cost,
      'notes': notes,
      'category': category,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  factory ServiceRecord.fromMap(Map<String, dynamic> map) {
    return ServiceRecord(
      id: map['id'] as String,
      motorcycleId: map['motorcycleId'] as String,
      serviceDate: map['serviceDate'] as String,
      workDone: map['workDone'] as String,
      cost: (map['cost'] as num).toInt(),
      notes: map['notes'] as String?,
      category: (map['category'] as String?) ?? 'general',
      createdAt: map['createdAt'] as String,
      updatedAt: map['updatedAt'] as String,
    );
  }

  ServiceRecord copyWith({
    String? id,
    String? motorcycleId,
    String? serviceDate,
    String? workDone,
    int? cost,
    String? notes,
    String? category,
    String? createdAt,
    String? updatedAt,
  }) {
    return ServiceRecord(
      id: id ?? this.id,
      motorcycleId: motorcycleId ?? this.motorcycleId,
      serviceDate: serviceDate ?? this.serviceDate,
      workDone: workDone ?? this.workDone,
      cost: cost ?? this.cost,
      notes: notes ?? this.notes,
      category: category ?? this.category,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
