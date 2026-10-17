class Motorcycle {
  final String id;
  final String plateNumber;
  final String make;
  final String model;
  final int? year;
  final String? notes;
  final String createdAt;
  final String updatedAt;

  Motorcycle({
    required this.id,
    required this.plateNumber,
    required this.make,
    required this.model,
    this.year,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'plateNumber': plateNumber,
      'make': make,
      'model': model,
      'year': year,
      'notes': notes,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  factory Motorcycle.fromMap(Map<String, dynamic> map) {
    return Motorcycle(
      id: map['id'] as String,
      plateNumber: map['plateNumber'] as String,
      make: map['make'] as String,
      model: map['model'] as String,
      year: map['year'] != null ? map['year'] as int : null,
      notes: map['notes'] as String?,
      createdAt: map['createdAt'] as String,
      updatedAt: map['updatedAt'] as String,
    );
  }

  Motorcycle copyWith({
    String? id,
    String? plateNumber,
    String? make,
    String? model,
    int? year,
    String? notes,
    String? createdAt,
    String? updatedAt,
  }) {
    return Motorcycle(
      id: id ?? this.id,
      plateNumber: plateNumber ?? this.plateNumber,
      make: make ?? this.make,
      model: model ?? this.model,
      year: year ?? this.year,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
