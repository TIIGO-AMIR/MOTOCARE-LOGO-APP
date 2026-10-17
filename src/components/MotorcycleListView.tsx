import React, { useState } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { 
  Bike, 
  Plus, 
  Search, 
  Calendar, 
  Edit3, 
  Trash2, 
  ChevronRight
} from 'lucide-react';
import { formatUGX } from '../utils/storage';

interface MotorcycleListViewProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onOpenAddMotorcycle: () => void;
  onEditMotorcycle: (motorcycle: Motorcycle) => void;
  onDeleteMotorcycle: (motorcycle: Motorcycle) => void;
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  onAddServiceToMotorcycle: (motorcycleId: string) => void;
}

export const MotorcycleListView: React.FC<MotorcycleListViewProps> = ({
  motorcycles,
  services,
  onOpenAddMotorcycle,
  onEditMotorcycle,
  onDeleteMotorcycle,
  onSelectMotorcycle,
  onAddServiceToMotorcycle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('ALL');

  // Calculate unique makes for filtering
  const allMakes = Array.from(new Set(motorcycles.map((m) => m.make))).filter(Boolean);

  // Filtered motorcycles
  const filtered = motorcycles.filter((m) => {
    const matchesSearch =
      m.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.notes && m.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMake = selectedMake === 'ALL' || m.make.toLowerCase() === selectedMake.toLowerCase();

    return matchesSearch && matchesMake;
  });

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Bike className="w-6 h-6 text-orange-500" />
            Motorcycle Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {motorcycles.length} {motorcycles.length === 1 ? 'motorcycle' : 'motorcycles'} registered for maintenance tracking
          </p>
        </div>

        <button
          onClick={onOpenAddMotorcycle}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Motorcycle</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by registration number, make, model..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition"
          />
        </div>

        {allMakes.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedMake('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedMake === 'ALL'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Makes
            </button>
            {allMakes.map((make) => (
              <button
                key={make}
                onClick={() => setSelectedMake(make)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedMake === make
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {make}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Motorcycle Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Bike className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No motorcycles found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search criteria or clear filters.'
              : 'Add your first motorcycle to start logging services and expenses.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedMake('ALL');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={onOpenAddMotorcycle}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Register Motorcycle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((moto) => {
            const motoServices = services.filter((s) => s.motorcycleId === moto.id);
            const totalSpent = motoServices.reduce((sum, s) => sum + s.cost, 0);
            const latestService = [...motoServices].sort(
              (a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
            )[0];

            return (
              <div
                key={moto.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm transition group"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-orange-400 tracking-wider">
                      {moto.plateNumber}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEditMotorcycle(moto)}
                        title="Edit Motorcycle"
                        aria-label="Edit Motorcycle"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteMotorcycle(moto)}
                        title="Delete Motorcycle"
                        aria-label="Delete Motorcycle"
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition">
                      {moto.make} {moto.model}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      {moto.year ? <span>Year: {moto.year}</span> : <span>Year: N/A</span>}
                      {moto.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[140px] text-slate-400">{moto.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Financial & Service Metric */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Spent</p>
                      <p className="text-sm font-bold text-orange-400 font-mono mt-0.5">
                        {formatUGX(totalSpent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Services</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {motoServices.length} {motoServices.length === 1 ? 'entry' : 'entries'}
                      </p>
                    </div>
                  </div>

                  {latestService && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Last: {latestService.serviceDate} ({latestService.workDone})</span>
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectMotorcycle(moto)}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <span>View History</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onAddServiceToMotorcycle(moto.id)}
                    title="Add Service Entry"
                    className="p-2 bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
