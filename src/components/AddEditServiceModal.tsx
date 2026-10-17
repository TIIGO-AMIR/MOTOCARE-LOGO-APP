import React, { useState, useEffect } from 'react';
import { Motorcycle, ServiceRecord, ServiceCategory } from '../types';
import { Wrench, X, Save, AlertCircle } from 'lucide-react';
import { detectCategory, formatUGX } from '../utils/storage';

interface AddEditServiceModalProps {
  isOpen: boolean;
  motorcycles: Motorcycle[];
  preselectedMotorcycleId?: string;
  serviceToEdit?: ServiceRecord | null;
  onClose: () => void;
  onSave: (service: Omit<ServiceRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

const COMMON_SERVICES = [
  { label: 'Oil change', cost: 25000, cat: 'oil' },
  { label: 'Brake adjustment', cost: 40000, cat: 'brakes' },
  { label: 'Chain replacement', cost: 15000, cat: 'chain' },
  { label: 'Tire / tube repair', cost: 10000, cat: 'tires' },
  { label: 'Carburetor clean & tune', cost: 20000, cat: 'engine' },
  { label: 'Spark plug replacement', cost: 12000, cat: 'electrical' },
  { label: 'Full routine service', cost: 50000, cat: 'general' },
];

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'oil', label: 'Oil & Filter' },
  { id: 'brakes', label: 'Brakes' },
  { id: 'chain', label: 'Chain & Sprocket' },
  { id: 'tires', label: 'Tires & Wheels' },
  { id: 'engine', label: 'Engine & Carb' },
  { id: 'electrical', label: 'Electrical & Lights' },
  { id: 'general', label: 'General Service' },
  { id: 'other', label: 'Other' },
];

export const AddEditServiceModal: React.FC<AddEditServiceModalProps> = ({
  isOpen,
  motorcycles,
  preselectedMotorcycleId,
  serviceToEdit,
  onClose,
  onSave,
}) => {
  const [motorcycleId, setMotorcycleId] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [cost, setCost] = useState<string>('');
  const [category, setCategory] = useState<ServiceCategory>('general');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (serviceToEdit) {
      setMotorcycleId(serviceToEdit.motorcycleId);
      setServiceDate(serviceToEdit.serviceDate);
      setWorkDone(serviceToEdit.workDone);
      setCost(String(serviceToEdit.cost));
      setCategory(serviceToEdit.category || 'general');
      setNotes(serviceToEdit.notes || '');
    } else {
      setMotorcycleId(preselectedMotorcycleId || (motorcycles[0]?.id || ''));
      setServiceDate(new Date().toISOString().split('T')[0]);
      setWorkDone('');
      setCost('');
      setCategory('general');
      setNotes('');
    }
    setErrors({});
  }, [serviceToEdit, preselectedMotorcycleId, motorcycles, isOpen]);

  if (!isOpen) return null;

  const handleWorkDoneChange = (text: string) => {
    setWorkDone(text);
    if (errors.workDone) {
      setErrors((prev) => ({ ...prev, workDone: '' }));
    }
    const detected = detectCategory(text);
    setCategory(detected);
  };

  const handleApplyPreset = (preset: typeof COMMON_SERVICES[0]) => {
    setWorkDone(preset.label);
    setCost(String(preset.cost));
    setCategory(preset.cat as ServiceCategory);
    setErrors((prev) => ({ ...prev, workDone: '', cost: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!motorcycleId) {
      newErrors.motorcycleId = 'Please select a motorcycle to link this service to';
    }
    if (!serviceDate.trim()) {
      newErrors.serviceDate = 'Service date is required';
    }
    if (!workDone.trim()) {
      newErrors.workDone = 'Please describe the work performed';
    }

    const costNum = Number(cost);
    if (!cost.trim()) {
      newErrors.cost = 'Service cost in UGX is required';
    } else if (isNaN(costNum)) {
      newErrors.cost = 'Please enter a valid numeric cost';
    } else if (costNum < 0) {
      newErrors.cost = 'Service cost cannot be negative (must be 0 or higher)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: serviceToEdit?.id,
      motorcycleId,
      serviceDate,
      workDone: workDone.trim(),
      cost: Math.round(Number(cost)),
      category,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Plain solid colors */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {serviceToEdit ? 'Edit Service Record' : 'Log Maintenance Service'}
              </h2>
              <p className="text-xs text-slate-400">
                Record service date, description of work completed, and cost in UGX
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Linked Motorcycle */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Motorcycle <span className="text-orange-500">*</span>
            </label>
            {motorcycles.length === 0 ? (
              <p className="text-xs text-amber-400 bg-slate-950 p-2.5 rounded-lg border border-amber-800">
                No motorcycles registered yet. Please add a motorcycle first.
              </p>
            ) : (
              <select
                value={motorcycleId}
                onChange={(e) => {
                  setMotorcycleId(e.target.value);
                  if (errors.motorcycleId) setErrors((prev) => ({ ...prev, motorcycleId: '' }));
                }}
                className={`w-full bg-slate-950 border ${
                  errors.motorcycleId ? 'border-red-500' : 'border-slate-700 focus:border-orange-500'
                } rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition`}
              >
                {motorcycles.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.plateNumber} — {m.make} {m.model} {m.year ? `(${m.year})` : ''}
                  </option>
                ))}
              </select>
            )}
            {errors.motorcycleId && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.motorcycleId}
              </p>
            )}
          </div>

          {/* Service Date */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Service Date <span className="text-orange-500">*</span>
            </label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => {
                setServiceDate(e.target.value);
                if (errors.serviceDate) setErrors((prev) => ({ ...prev, serviceDate: '' }));
              }}
              className={`w-full bg-slate-950 border ${
                errors.serviceDate ? 'border-red-500' : 'border-slate-700 focus:border-orange-500'
              } rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition`}
            />
            {errors.serviceDate && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.serviceDate}
              </p>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Service Templates:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SERVICES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-orange-400 font-mono">
                    {formatUGX(preset.cost)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Work Done */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Work Performed Description <span className="text-orange-500">*</span>
            </label>
            <textarea
              rows={2}
              value={workDone}
              onChange={(e) => handleWorkDoneChange(e.target.value)}
              placeholder="e.g. Oil change, replaced brake shoes, tuned carburetor..."
              className={`w-full bg-slate-950 border ${
                errors.workDone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-orange-500'
              } rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none transition`}
            />
            {errors.workDone && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.workDone}
              </p>
            )}
          </div>

          {/* Cost in UGX */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-200">
                Service Cost (UGX) <span className="text-orange-500">*</span>
              </label>
              {cost && !isNaN(Number(cost)) && Number(cost) >= 0 && (
                <span className="text-xs font-mono font-semibold text-orange-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  {formatUGX(Number(cost))}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">
                UGX
              </span>
              <input
                type="number"
                min="0"
                step="500"
                value={cost}
                onChange={(e) => {
                  setCost(e.target.value);
                  if (errors.cost) setErrors((prev) => ({ ...prev, cost: '' }));
                }}
                placeholder="e.g. 25000"
                className={`w-full bg-slate-950 border ${
                  errors.cost ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-orange-500'
                } rounded-xl pl-14 pr-3.5 py-2.5 text-white font-mono text-base focus:outline-none transition`}
              />
            </div>
            {errors.cost && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cost}
              </p>
            )}
          </div>

          {/* Category selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Maintenance Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                    category === c.id
                      ? 'bg-orange-600 border-orange-600 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Additional Notes / Spare Parts <span className="text-slate-500 text-xs font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mechanic John, Kalerwe Garage, Odometer: 14,200 km"
              className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none transition"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={motorcycles.length === 0}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{serviceToEdit ? 'Save Changes' : 'Record Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
