# Motorcycle Service Log - Flutter Mobile App

A production-ready Flutter mobile application implementing all features specified in the **Motorcycle Service Log Mobile Application Documentation**:
- **On-Device SQLite Storage**: Offline persistence via `sqflite` so records remain available without internet connectivity.
- **Motorcycle Registry**: Plate number, make, model, year, notes with validation.
- **Service Logging**: Dates, work performed, costs in Ugandan Shillings (UGX).
- **Service History**: Chronological timeline of visits for each bike.
- **Expenditure Calculations**: Dynamic calculations of overall total and per-motorcycle totals.
- **PDF Summary Printing**: Native print/PDF generation using the `pdf` and `printing` packages.
- **Plain Solid Colors**: Sleek slate and orange UI with no gradients.

## Project Structure
```
flutter_app/
├── pubspec.yaml
├── README.md
└── lib/
    ├── main.dart
    ├── models/
    │   ├── motorcycle.dart
    │   └── service_record.dart
    ├── database/
    │   └── db_helper.dart      # SQLite database tables & queries
    ├── services/
    │   └── pdf_service.dart    # PDF export & printing
    └── screens/
        ├── dashboard_screen.dart
        ├── motorcycle_list_screen.dart
        ├── motorcycle_detail_screen.dart
        ├── add_edit_motorcycle_screen.dart
        ├── add_edit_service_screen.dart
        └── expenditure_summary_screen.dart
```

## How to Run on Mobile (Android / iOS)
1. Install Flutter SDK (`flutter.dev`).
2. Open terminal in `flutter_app/`:
   ```bash
   flutter pub get
   ```
3. Connect your Android or iOS device (or launch emulator):
   ```bash
   flutter run
   ```
4. Build release APK for Android:
   ```bash
   flutter build apk --release
   ```
