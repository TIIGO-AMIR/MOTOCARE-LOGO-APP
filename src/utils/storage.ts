import { Motorcycle, ServiceRecord, ServiceCategory } from '../types';

const STORAGE_KEY_MOTORCYCLES = 'moto_log_motorcycles_v1';
const STORAGE_KEY_SERVICES = 'moto_log_services_v1';

// Seed sample data matching the exact example from the documentation
// Example calculation from page 2-3 of PDF:
// Oil change 25,000 UGX, Brake adjustment 40,000 UGX, Chain replacement 15,000 UGX => Total 80,000 UGX
const INITIAL_MOTORCYCLES: Motorcycle[] = [
  {
    id: 'bike-1',
    plateNumber: 'UDD 452A',
    make: 'Bajaj',
    model: 'Boxer BM100',
    year: 2022,
    notes: 'Kampala Central route - Daily transport',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'bike-2',
    plateNumber: 'UFB 781C',
    make: 'TVS',
    model: 'Star HLX 125',
    year: 2023,
    notes: 'Delivery fleet unit #2',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  },
];

const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 'srv-1',
    motorcycleId: 'bike-1',
    serviceDate: '2026-09-20',
    workDone: 'Oil change',
    cost: 25000,
    category: 'oil',
    notes: 'Castrol 20W-50 oil replaced with fresh filter',
    createdAt: '2026-09-20T11:00:00.000Z',
    updatedAt: '2026-09-20T11:00:00.000Z',
  },
  {
    id: 'srv-2',
    motorcycleId: 'bike-1',
    serviceDate: '2026-09-28',
    workDone: 'Brake adjustment',
    cost: 40000,
    category: 'brakes',
    notes: 'Replaced rear brake shoes and tightened front drum cable',
    createdAt: '2026-09-28T14:30:00.000Z',
    updatedAt: '2026-09-28T14:30:00.000Z',
  },
  {
    id: 'srv-3',
    motorcycleId: 'bike-1',
    serviceDate: '2026-10-05',
    workDone: 'Chain replacement',
    cost: 15000,
    category: 'chain',
    notes: 'Heavy duty 428 chain installed and lubricated',
    createdAt: '2026-10-05T09:15:00.000Z',
    updatedAt: '2026-10-05T09:15:00.000Z',
  },
  {
    id: 'srv-4',
    motorcycleId: 'bike-2',
    serviceDate: '2026-10-12',
    workDone: 'Oil change and Spark plug inspection',
    cost: 30000,
    category: 'oil',
    notes: 'Standard 1000km scheduled service',
    createdAt: '2026-10-12T16:00:00.000Z',
    updatedAt: '2026-10-12T16:00:00.000Z',
  },
];

export function getStoredMotorcycles(): Motorcycle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MOTORCYCLES);
    if (!raw) {
      saveStoredMotorcycles(INITIAL_MOTORCYCLES);
      return INITIAL_MOTORCYCLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading motorcycles from storage:', e);
    return INITIAL_MOTORCYCLES;
  }
}

export function saveStoredMotorcycles(motorcycles: Motorcycle[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MOTORCYCLES, JSON.stringify(motorcycles));
  } catch (e) {
    console.error('Error saving motorcycles to storage:', e);
  }
}

export function getStoredServices(): ServiceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (!raw) {
      saveStoredServices(INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading services from storage:', e);
    return INITIAL_SERVICES;
  }
}

export function saveStoredServices(services: ServiceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Error saving services to storage:', e);
  }
}

export function formatUGX(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('en-US');
  return `UGX ${formatted}`;
}

export function detectCategory(workDone: string): ServiceCategory {
  const lower = workDone.toLowerCase();
  if (lower.includes('oil') || lower.includes('filter') || lower.includes('lubricant')) return 'oil';
  if (lower.includes('brake') || lower.includes('shoe') || lower.includes('pad')) return 'brakes';
  if (lower.includes('chain') || lower.includes('sprocket')) return 'chain';
  if (lower.includes('tyre') || lower.includes('tire') || lower.includes('tube') || lower.includes('wheel')) return 'tires';
  if (lower.includes('engine') || lower.includes('valve') || lower.includes('piston') || lower.includes('carb')) return 'engine';
  if (lower.includes('light') || lower.includes('battery') || lower.includes('spark') || lower.includes('wire')) return 'electrical';
  if (lower.includes('wash') || lower.includes('inspection') || lower.includes('service')) return 'general';
  return 'other';
}

