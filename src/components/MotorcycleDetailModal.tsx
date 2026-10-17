import React, { useState } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { 
  Bike, 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  ArrowUpDown, 
  Wrench, 
  Tag 
} from 'lucide-react';
import { formatUGX } from '../utils/storage';

interface MotorcycleDetailModalProps {
  isOpen: boolean;
  motorcycle: Motorcycle | null;
  services: ServiceRecord[];
  onClose: () => void;
  onEditMotorcycle: (motorcycle: Motorcycle) => void;
  onDeleteMotorcycle: (motorcycle: Motorcycle) => void;
  onAddService: (motorcycleId: string) => void;
  onEditService: (service: ServiceRecord) => void;
  onDeleteService: (service: ServiceRecord) => void;
}

export const MotorcycleDetailModal: React.FC<MotorcycleDetailModalProps> = ({
  isOpen,
  motorcycle,
  services,
  onClose,
  onEditMotorcycle,
  onDeleteMotorcycle,
  onAddService,
  onEditService,
  onDeleteService,
}) => {
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen || !motorcycle) return null;

  // Filter services linked to this motorcycle
  const linkedServices = services.filter((s) => s.motorcycleId === motorcycle.id);
  const totalCost = linkedServices.reduce((sum, s) => sum + s.cost, 0);

  // Sort by serviceDate
  const sortedServices = [...linkedServices].sort((a, b) => {
    const diff = new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime();
    return sortAsc ? -diff : diff;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Motorcycle Badge - Plain solid colors */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-orange-400 font-mono font-bold text-sm tracking-wide">
                  {motorcycle.plateNumber}
                </span>
                <span className="text-white font-bold text-base sm:text-lg">
                  {motorcycle.make} {motorcycle.model}
                </span>
                {motorcycle.year && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {motorcycle.year}
                  </span>
                )}
              </div>
              {motorcycle.notes && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {motorcycle.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditMotorcycle(motorcycle)}
              title="Edit Motorcycle"
              aria-label="Edit Motorcycle"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteMotorcycle(motorcycle)}
              title="Delete Motorcycle"
              aria-label="Delete Motorcycle"
              className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Banner for this bike */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <p className="text-slate-400 font-medium">Total Spent (UGX)</p>
            <p className="text-lg font-bold text-orange-400 font-mono mt-0.5">
              {formatUGX(totalCost)}
            </p>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <p className="text-slate-400 font-medium">Services Recorded</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {linkedServices.length} {linkedServices.length === 1 ? 'visit' : 'visits'}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between sm:block">
            <p className="text-slate-400 font-medium">Latest Service</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {sortedServices[0] ? sortedServices[0].serviceDate : 'No visits yet'}
            </p>
          </div>
        </div>

        {/* Service History Controls & List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Service History
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                {linkedServices.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {linkedServices.length > 1 && (
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg flex items-center gap-1 transition"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{sortAsc ? 'Oldest first' : 'Newest first'}</span>
                </button>
              )}
              <button
                onClick={() => onAddService(motorcycle.id)}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Service</span>
              </button>
            </div>
          </div>

          {/* List of service entries */}
          {sortedServices.length === 0 ? (
            <div className="text-center py-10 bg-slate-950 rounded-xl border border-dashed border-slate-800 p-6">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No service records yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Log the first maintenance visit, oil change, or repair for this motorcycle.
              </p>
              <button
                onClick={() => onAddService(motorcycle.id)}
                className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add First Service Record
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedServices.map((record) => (
                <div
                  key={record.id}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">
                        {record.workDone}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        {record.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {record.serviceDate}
                      </span>
                      {record.notes && (
                        <span className="text-slate-400 truncate max-w-xs">
                          • {record.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="font-mono font-bold text-orange-400 text-sm sm:text-base">
                      {formatUGX(record.cost)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditService(record)}
                        aria-label="Edit service record"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteService(record)}
                        aria-label="Delete service record"
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Calculated total: <strong className="text-orange-400 font-mono">{formatUGX(totalCost)}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
