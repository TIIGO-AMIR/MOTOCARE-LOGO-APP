import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:intl/intl.dart';
import '../models/motorcycle.dart';
import '../models/service_record.dart';

class PdfService {
  static Future<void> printOverallSummary({
    required List<Motorcycle> motorcycles,
    required List<ServiceRecord> services,
    required int totalExpenditure,
  }) async {
    final pdf = pw.Document();
    final ugxFormat = NumberFormat.currency(locale: 'en_UG', symbol: 'UGX ', decimalDigits: 0);

    // Group by motorcycle
    final Map<String, int> motoTotals = {};
    for (var s in services) {
      motoTotals[s.motorcycleId] = (motoTotals[s.motorcycleId] ?? 0) + s.cost;
    }

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return [
            // Header
            pw.Header(
              level: 0,
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('MOTORCYCLE SERVICE LOG', style: pw.TextStyle(fontSize: 22, fontWeight: pw.FontWeight.bold)),
                      pw.Text('Servicing Expenditure & Maintenance Summary', style: const pw.TextStyle(fontSize: 12, color: PdfColors.grey700)),
                    ],
                  ),
                  pw.Text('Report Date: ${DateFormat('yyyy-MM-dd').format(DateTime.now())}', style: const pw.TextStyle(fontSize: 10)),
                ],
              ),
            ),
            pw.SizedBox(height: 16),

            // Grand Total Card
            pw.Container(
              padding: const pw.EdgeInsets.all(14),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.black),
                borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
              ),
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('TOTAL SERVICING EXPENDITURE', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                      pw.SizedBox(height: 4),
                      pw.Text(ugxFormat.format(totalExpenditure), style: pw.TextStyle(fontSize: 22, fontWeight: pw.FontWeight.bold, color: PdfColors.orange800)),
                    ],
                  ),
                  pw.Text('${services.length} Total Visits • ${motorcycles.length} Motorcycles', style: const pw.TextStyle(fontSize: 10)),
                ],
              ),
            ),
            pw.SizedBox(height: 20),

            // Breakdown by Motorcycle
            pw.Text('Expenditure by Motorcycle', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
            pw.SizedBox(height: 8),
            pw.Table.fromTextArray(
              headers: ['Registration', 'Make & Model', 'Year', 'Total (UGX)', '% of Total'],
              data: motorcycles.map((m) {
                final spent = motoTotals[m.id] ?? 0;
                final pct = totalExpenditure > 0 ? ((spent / totalExpenditure) * 100).toStringAsFixed(1) : '0';
                return [
                  m.plateNumber,
                  '${m.make} ${m.model}',
                  m.year?.toString() ?? '-',
                  ugxFormat.format(spent),
                  '$pct%',
                ];
              }).toList(),
              headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, color: PdfColors.white),
              headerDecoration: const pw.BoxDecoration(color: PdfColors.grey800),
              rowDecoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: PdfColors.grey300))),
            ),
            pw.SizedBox(height: 24),

            // Service Records Log
            pw.Text('Service Records Log', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
            pw.SizedBox(height: 8),
            pw.Table.fromTextArray(
              headers: ['Date', 'Plate', 'Work Description', 'Category', 'Cost (UGX)'],
              data: services.map((s) {
                final bike = motorcycles.firstWhere(
                  (m) => m.id == s.motorcycleId,
                  orElse: () => Motorcycle(id: '', plateNumber: 'Unknown', make: '', model: '', createdAt: '', updatedAt: ''),
                );
                return [
                  s.serviceDate,
                  bike.plateNumber,
                  s.workDone,
                  s.category.toUpperCase(),
                  ugxFormat.format(s.cost),
                ];
              }).toList(),
              headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, color: PdfColors.white),
              headerDecoration: const pw.BoxDecoration(color: PdfColors.grey800),
              rowDecoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: PdfColors.grey300))),
            ),
          ];
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdf.save(),
      name: 'Motorcycle_Service_Log_Summary.pdf',
    );
  }
}
