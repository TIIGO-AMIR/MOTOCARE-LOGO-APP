export interface Motorcycle {
  id: string;
  plateNumber: string; // e.g. "UDD 452A"
  make: string;        // e.g. "Bajaj", "Yamaha"
  model: string;       // e.g. "Boxer 100", "Crux"
  year?: number;       // e.g. 2022
  notes?: string;      // owner name or notes
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'oil'
  | 'brakes'
  | 'chain'
  | 'tires'
  | 'engine'
  | 'electrical'
  | 'general'
  | 'other';

export interface ServiceRecord {
  id: string;
  motorcycleId: string;
  serviceDate: string; // YYYY-MM-DD
  workDone: string;    // e.g. "Oil change and filter replacement"
  cost: number;        // Cost in UGX (Ugandan Shillings)
  notes?: string;      // Optional mechanic notes or parts
  category: ServiceCategory;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'motorcycles' | 'expenditure';

export interface MotorcycleWithStats extends Motorcycle {
  totalSpent: number;
  serviceCount: number;
  lastServiceDate?: string;
}
