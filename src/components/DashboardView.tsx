import React from 'react';
import { Motorcycle, ServiceRecord, ActiveTab } from '../types';
import { 
  Bike, 
  Wrench, 
  Coins, 
  TrendingUp, 
  Plus, 
  ChevronRight
} from 'lucide-react';
import { formatUGX } from '../utils/storage';

interface DashboardViewProps {
  motorcycles: Motorcycle[];
  services: ServiceRecord[];
  onOpenAddMotorcycle: () => void;
  onOpenAddService: (motorcycleId?: string) => void;
  onSelectMotorcycle: (motorcycle: Motorcycle) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onEditService?: (service: ServiceRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  motorcycles,
  services,
  onOpenAddMotorcycle,
  onOpenAddService,
  onSelectMotorcycle,
  onNavigateTab,
}) => {
  // Total expenditure calculation
  const totalExpenditure = services.reduce((sum, s) => sum + s.cost, 0);
  const averageCost = services.length > 0 ? Math.round(totalExpenditure / services.length) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Welcome / Hero Banner - Plain solid colors (no gradients) */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Motorcycle Service Log
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Organized records for motorcycles, service visits, maintenance expenditure, and parts history. Works offline on your mobile phone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenAddService()}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Service</span>
            </button>
            <button
              onClick={onOpenAddMotorcycle}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition active:scale-95"
            >
              <Bike className="w-4 h-4 text-orange-400" />
              <span>Add Motorcycle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards - Plain solid colors (no gradients) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Expenditure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Servicing</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-2">
            {formatUGX(totalExpenditure)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <span>Calculated from {services.length} records</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600" />
        </div>

        {/* Registered Motorcycles */}
        <div 
          onClick={() => onNavigateTab('motorcycles')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Motorcycles</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-2">
            {motorcycles.length}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-blue-300 transition">
            <span>Manage fleet &amp; records</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
        </div>

        {/* Service Visits */}
        <div 
          onClick={() => onNavigateTab('expenditure')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Service Visits</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-2">
            {services.length}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-emerald-300 transition">
            <span>View cost breakdown</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
        </div>

        {/* Average Service Cost */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Cost / Visit</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-2">
            {formatUGX(averageCost)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <span>Per recorded service visit</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
        </div>
      </div>

      {/* Main Section: Motorcycles Fleet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bike className="w-4 h-4 text-orange-500" />
            Registered Motorcycles
          </h2>
          <button
            onClick={() => onNavigateTab('motorcycles')}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {motorcycles.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs text-slate-400">No motorcycles added yet.</p>
            <button
              onClick={onOpenAddMotorcycle}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Add Motorcycle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {motorcycles.map((moto) => {
              const motoServices = services.filter((s) => s.motorcycleId === moto.id);
              const motoTotal = motoServices.reduce((acc, s) => acc + s.cost, 0);

              return (
                <div
                  key={moto.id}
                  onClick={() => onSelectMotorcycle(moto)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl p-4 cursor-pointer transition group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-orange-400 tracking-wide">
                        {moto.plateNumber}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {formatUGX(motoTotal)}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <p className="font-semibold text-white group-hover:text-orange-400 transition text-sm">
                        {moto.make} {moto.model}
                      </p>
                      {moto.year && (
                        <p className="text-[11px] text-slate-500 mt-0.5">Year: {moto.year}</p>
                      )}
                      {moto.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{moto.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px]">
                      {motoServices.length} {motoServices.length === 1 ? 'service visit' : 'service visits'}
                    </span>
                    <span className="text-[11px] text-orange-400 group-hover:text-orange-300 flex items-center gap-0.5 font-medium">
                      <span>View history</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
