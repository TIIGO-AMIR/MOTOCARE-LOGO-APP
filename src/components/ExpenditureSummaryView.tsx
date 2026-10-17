import React, { useState } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { 
  Coins, 
  Printer, 
  Wrench, 
  Calendar, 
  Trash2, 
  Edit3, 
  PieChart, 
  BarChart3,
  Bike
} from 'lucide-react';
import { formatUGX } from '../utils/storage';

interface ExpenditureSummaryViewProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onEditService: (service: ServiceRecord) => void;
  onDeleteService: (service: ServiceRecord) => void;
}

export const ExpenditureSummaryView: React.FC<ExpenditureSummaryViewProps> = ({
  motorcycles,
  services,
  onEditService,
  onDeleteService,
}) => {
  const [selectedMotorcycleFilter, setSelectedMotorcycleFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Grand Total calculation across all services
  const grandTotal = services.reduce((sum, s) => sum + s.cost, 0);

  // Filtered services for display
  const filteredServices = services.filter((s) => {
    const matchMoto = selectedMotorcycleFilter === 'ALL' || s.motorcycleId === selectedMotorcycleFilter;
    const matchCat = selectedCategoryFilter === 'ALL' || s.category === selectedCategoryFilter;
    return matchMoto && matchCat;
  });

  const filteredTotal = filteredServices.reduce((sum, s) => sum + s.cost, 0);

  // Per-motorcycle calculation
  const motorcycleBreakdowns = motorcycles.map((m) => {
    const motoServices = services.filter((s) => s.motorcycleId === m.id);
    const totalCost = motoServices.reduce((sum, s) => sum + s.cost, 0);
    const percentage = grandTotal > 0 ? ((totalCost / grandTotal) * 100).toFixed(1) : '0';
    return {
      motorcycle: m,
      servicesCount: motoServices.length,
      totalCost,
      percentage,
    };
  }).sort((a, b) => b.totalCost - a.totalCost);

  // Per-category calculation
  const categoryTotals: Record<string, number> = {};
  services.forEach((s) => {
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + s.cost;
  });

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  const handlePrint = () => {
    window.print();
  };

  const getMotorcycle = (id: string) => motorcycles.find((m) => m.id === id);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Printable Document Header (visible during print) */}
      <div className="hidden print:block mb-6 border-b border-black pb-4 text-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide">Motorcycle Service Log</h1>
        <p className="text-sm text-gray-700">Maintenance &amp; Servicing Expenditure Summary Report</p>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleDateString()} | Total Recorded Expenditure: {formatUGX(grandTotal)}</p>
      </div>

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-orange-500" />
            Expenditure Summary &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time calculated totals for all service visits and individual motorcycles
          </p>
        </div>

        {/* Print / PDF Button */}
        <div>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            title="Print or Save Summary as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Grand Total Banner - Plain solid colors (no gradient) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-white print:border print:border-gray-300 print:text-black">
        <div>
          <span className="text-xs uppercase font-bold text-orange-500 tracking-wider print:text-orange-700">
            Total Servicing Expenditure
          </span>
          <p className="text-2xl sm:text-4xl font-extrabold text-white font-mono mt-1 print:text-black">
            {formatUGX(grandTotal)}
          </p>
          <p className="text-xs text-slate-400 mt-1 print:text-gray-600">
            Sum of all {services.length} recorded service entries across {motorcycles.length} motorcycles
          </p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:grid-cols-2">
        {/* Breakdown by Motorcycle */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 print:bg-white print:border-gray-300 print:text-black">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-black">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            Expenditure by Motorcycle
          </h2>

          {motorcycleBreakdowns.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No motorcycles registered yet.</p>
          ) : (
            <div className="space-y-3">
              {motorcycleBreakdowns.map(({ motorcycle, totalCost, servicesCount, percentage }) => (
                <div key={motorcycle.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 print:text-black print:bg-gray-100 print:border-gray-300">
                        {motorcycle.plateNumber}
                      </span>
                      <span className="font-semibold text-white print:text-black">
                        {motorcycle.make} {motorcycle.model}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white print:text-black">
                        {formatUGX(totalCost)}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5 print:text-gray-600">({percentage}%)</span>
                    </div>
                  </div>

                  {/* Plain solid progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden print:bg-gray-200">
                    <div
                      className="bg-orange-500 h-2 rounded-full print:bg-black"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Breakdown by Service Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 print:bg-white print:border-gray-300 print:text-black">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 print:text-black">
            <PieChart className="w-4 h-4 text-orange-500" />
            Expenditure by Maintenance Category
          </h2>

          {categoryEntries.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No service entries yet.</p>
          ) : (
            <div className="space-y-3">
              {categoryEntries.map(([cat, amount]) => {
                const percent = grandTotal > 0 ? ((amount / grandTotal) * 100).toFixed(1) : '0';
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white uppercase text-[11px] tracking-wider print:text-black">
                        {cat}
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white print:text-black">
                          {formatUGX(amount)}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1.5 print:text-gray-600">({percent}%)</span>
                      </div>
                    </div>
                    {/* Plain solid progress bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden print:bg-gray-200">
                      <div
                        className="bg-blue-600 h-2 rounded-full print:bg-gray-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Service Records Table with Edit & Delete */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-3 p-5 print:bg-white print:border-gray-300 print:text-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              All Service Entries
            </h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
              {filteredServices.length}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMotorcycleFilter}
              onChange={(e) => setSelectedMotorcycleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Motorcycles</option>
              {motorcycles.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.plateNumber} ({m.make})
                </option>
              ))}
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Categories</option>
              <option value="oil">Oil</option>
              <option value="brakes">Brakes</option>
              <option value="chain">Chain</option>
              <option value="tires">Tires</option>
              <option value="engine">Engine</option>
              <option value="electrical">Electrical</option>
              <option value="general">General</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Print Only Table Title */}
        <div className="hidden print:block font-bold text-sm text-black mb-2 border-b pb-1">
          Recorded Service Visits ({filteredServices.length} entries)
        </div>

        {filteredServices.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No service records matching criteria.</p>
        ) : (
          <div className="divide-y divide-slate-800/80 -mx-5 px-5 print:divide-gray-200">
            {filteredServices.map((record) => {
              const moto = getMotorcycle(record.motorcycleId);
              return (
                <div
                  key={record.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-800/30 px-2 rounded-xl transition print:hover:bg-transparent"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-orange-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 print:text-black print:bg-gray-100 print:border-gray-300">
                        {moto ? moto.plateNumber : 'Unknown'}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white print:text-black">
                        {record.workDone}
                      </span>
                      <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 print:text-gray-600 print:bg-gray-100 print:border-gray-300">
                        {record.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 print:text-gray-600">
                      <span className="font-mono flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-500 print:text-gray-500" />
                        {record.serviceDate}
                      </span>
                      {record.notes && (
                        <span className="text-[11px] text-slate-400 print:text-gray-600 truncate max-w-sm">
                          • {record.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 print:border-none">
                    <span className="font-mono font-bold text-orange-400 text-sm print:text-black">
                      {formatUGX(record.cost)}
                    </span>
                    <div className="flex items-center gap-1 print:hidden">
                      <button
                        onClick={() => onEditService(record)}
                        title="Edit Service Entry"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteService(record)}
                        title="Delete Service Entry"
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filtered Total Display */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs print:border-gray-300">
          <span className="text-slate-400 print:text-gray-700 font-medium">
            Selected Filter Total:
          </span>
          <span className="font-mono font-bold text-orange-400 text-sm print:text-black">
            {formatUGX(filteredTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
