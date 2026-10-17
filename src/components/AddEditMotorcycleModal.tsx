import React, { useState, useEffect } from 'react';
import { Motorcycle } from '../types';
import { Bike, X, Save, AlertCircle } from 'lucide-react';

interface AddEditMotorcycleModalProps {
  isOpen: boolean;
  motorcycleToEdit?: Motorcycle | null;
  onClose: () => void;
  onSave: (motorcycle: Omit<Motorcycle, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

const COMMON_MAKES = ['Bajaj', 'TVS', 'Yamaha', 'Honda', 'Suzuki', 'Haojue', 'Senke', 'KTM'];
const COMMON_MODELS: Record<string, string[]> = {
  Bajaj: ['Boxer BM100', 'Boxer 150', 'Pulsar 150', 'Discover 125'],
  TVS: ['Star HLX 125', 'Star HLX 100', 'Apache RTR 160', 'Victor'],
  Yamaha: ['Crux 110', 'DT 125', 'YBR 125', 'FZ-S'],
  Honda: ['Ace 125', 'Ace CB110', 'XR 150L', 'Unicorn'],
};

export const AddEditMotorcycleModal: React.FC<AddEditMotorcycleModalProps> = ({
  isOpen,
  motorcycleToEdit,
  onClose,
  onSave,
}) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (motorcycleToEdit) {
      setPlateNumber(motorcycleToEdit.plateNumber);
      setMake(motorcycleToEdit.make);
      setModel(motorcycleToEdit.model);
      setYear(motorcycleToEdit.year ? String(motorcycleToEdit.year) : '');
      setNotes(motorcycleToEdit.notes || '');
    } else {
      setPlateNumber('');
      setMake('');
      setModel('');
      setYear('');
      setNotes('');
    }
    setErrors({});
  }, [motorcycleToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!plateNumber.trim()) {
      newErrors.plateNumber = 'Registration / plate number is required (e.g. UDD 452A)';
    }
    if (!make.trim()) {
      newErrors.make = 'Motorcycle make is required (e.g. Bajaj, TVS, Yamaha)';
    }
    if (!model.trim()) {
      newErrors.model = 'Motorcycle model is required (e.g. Boxer BM100, Star HLX)';
    }
    if (year.trim()) {
      const yearNum = Number(year);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1960 || yearNum > currentYear + 1) {
        newErrors.year = `Please enter a valid year between 1960 and ${currentYear + 1}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: motorcycleToEdit?.id,
      plateNumber: plateNumber.trim().toUpperCase(),
      make: make.trim(),
      model: model.trim(),
      year: year.trim() ? Number(year) : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleMakeSelect = (selectedMake: string) => {
    setMake(selectedMake);
    if (errors.make) {
      setErrors((prev) => ({ ...prev, make: '' }));
    }
  };

  const handleModelSelect = (selectedModel: string) => {
    setModel(selectedModel);
    if (errors.model) {
      setErrors((prev) => ({ ...prev, model: '' }));
    }
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
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {motorcycleToEdit ? 'Edit Motorcycle' : 'Register New Motorcycle'}
              </h2>
              <p className="text-xs text-slate-400">
                {motorcycleToEdit ? 'Update vehicle details & ownership notes' : 'Add bike details to track maintenance and expenses'}
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
          {/* Registration / Plate Number */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Registration / Plate Number <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => {
                setPlateNumber(e.target.value);
                if (errors.plateNumber) setErrors((prev) => ({ ...prev, plateNumber: '' }));
              }}
              placeholder="e.g. UDD 452A or UAX 912K"
              className={`w-full bg-slate-950 border ${
                errors.plateNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-orange-500'
              } rounded-xl px-3.5 py-2.5 text-white font-mono uppercase placeholder:text-slate-500 focus:outline-none transition`}
            />
            {errors.plateNumber && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.plateNumber}
              </p>
            )}
          </div>

          {/* Make with quick suggestions */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Make / Manufacturer <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                if (errors.make) setErrors((prev) => ({ ...prev, make: '' }));
              }}
              placeholder="e.g. Bajaj, TVS, Yamaha, Honda"
              className={`w-full bg-slate-950 border ${
                errors.make ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-orange-500'
              } rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none transition`}
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_MAKES.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => handleMakeSelect(m)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    make.toLowerCase() === m.toLowerCase()
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {errors.make && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.make}
              </p>
            )}
          </div>

          {/* Model with quick suggestions */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">
              Model <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
              }}
              placeholder="e.g. Boxer BM100, Star HLX 125, Crux"
              className={`w-full bg-slate-950 border ${
                errors.model ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-orange-500'
              } rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none transition`}
            />
            {make && COMMON_MODELS[make] && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 py-0.5">Popular {make}:</span>
                {COMMON_MODELS[make].map((mod) => (
                  <button
                    type="button"
                    key={mod}
                    onClick={() => handleModelSelect(mod)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    {mod}
                  </button>
                ))}
              </div>
            )}
            {errors.model && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.model}
              </p>
            )}
          </div>

          {/* Year & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-200">
                Year of Manufacture <span className="text-slate-500 text-xs font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="1960"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  if (errors.year) setErrors((prev) => ({ ...prev, year: '' }));
                }}
                placeholder="e.g. 2023"
                className={`w-full bg-slate-950 border ${
                  errors.year ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-orange-500'
                } rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none transition`}
              />
              {errors.year && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.year}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-200">
                Owner / Fleet Notes <span className="text-slate-500 text-xs font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Kampala Central Boda #4"
                className="w-full bg-slate-950 border border-slate-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{motorcycleToEdit ? 'Save Changes' : 'Register Motorcycle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
