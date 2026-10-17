import React, { useState, useEffect } from 'react';
import { Motorcycle, ServiceRecord, ActiveTab } from './types';
import { 
  getStoredMotorcycles, 
  saveStoredMotorcycles, 
  getStoredServices, 
  saveStoredServices 
} from './utils/storage';
import { Header, MobileBottomNav } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { DashboardView } from './components/DashboardView';
import { MotorcycleListView } from './components/MotorcycleListView';
import { ExpenditureSummaryView } from './components/ExpenditureSummaryView';
import { AddEditMotorcycleModal } from './components/AddEditMotorcycleModal';
import { AddEditServiceModal } from './components/AddEditServiceModal';
import { MotorcycleDetailModal } from './components/MotorcycleDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(() => getStoredMotorcycles());
  const [services, setServices] = useState<ServiceRecord[]>(() => getStoredServices());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [isMotorcycleModalOpen, setIsMotorcycleModalOpen] = useState(false);
  const [motorcycleToEdit, setMotorcycleToEdit] = useState<Motorcycle | null>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceRecord | null>(null);
  const [preselectedMotorcycleId, setPreselectedMotorcycleId] = useState<string | undefined>(undefined);

  const [selectedMotorcycleForDetail, setSelectedMotorcycleForDetail] = useState<Motorcycle | null>(null);

  // Delete confirmation modal state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    impactWarning?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Sync to storage on change
  useEffect(() => {
    saveStoredMotorcycles(motorcycles);
  }, [motorcycles]);

  useEffect(() => {
    saveStoredServices(services);
  }, [services]);

  // Keep selected motorcycle for detail modal in sync if updated
  useEffect(() => {
    if (selectedMotorcycleForDetail) {
      const refreshed = motorcycles.find((m) => m.id === selectedMotorcycleForDetail.id);
      setSelectedMotorcycleForDetail(refreshed || null);
    }
  }, [motorcycles]);

  // Motorcycle handlers
  const handleSaveMotorcycle = (data: Omit<Motorcycle, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    if (data.id) {
      // Edit existing
      setMotorcycles((prev) =>
        prev.map((m) => (m.id === data.id ? { ...m, ...data, updatedAt: now } : m))
      );
    } else {
      // Create new
      const newMotorcycle: Motorcycle = {
        ...data,
        id: `bike-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setMotorcycles((prev) => [newMotorcycle, ...prev]);
    }
  };

  const handlePromptDeleteMotorcycle = (motorcycle: Motorcycle) => {
    const linkedServicesCount = services.filter((s) => s.motorcycleId === motorcycle.id).length;
    setDeleteDialog({
      isOpen: true,
      title: `Delete Motorcycle: ${motorcycle.plateNumber}?`,
      message: `Are you sure you want to delete ${motorcycle.make} ${motorcycle.model} (${motorcycle.plateNumber})?`,
      confirmLabel: 'Delete Motorcycle',
      impactWarning:
        linkedServicesCount > 0
          ? `Warning: This motorcycle has ${linkedServicesCount} linked service records. Deleting this motorcycle will also delete all of its recorded service entries.`
          : undefined,
      onConfirm: () => {
        setMotorcycles((prev) => prev.filter((m) => m.id !== motorcycle.id));
        setServices((prev) => prev.filter((s) => s.motorcycleId !== motorcycle.id));
        if (selectedMotorcycleForDetail?.id === motorcycle.id) {
          setSelectedMotorcycleForDetail(null);
        }
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Service handlers
  const handleSaveService = (data: Omit<ServiceRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    if (data.id) {
      // Edit existing
      setServices((prev) =>
        prev.map((s) => (s.id === data.id ? { ...s, ...data, updatedAt: now } : s))
      );
    } else {
      // Create new
      const newService: ServiceRecord = {
        ...data,
        id: `srv-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setServices((prev) => [newService, ...prev]);
    }
  };

  const handlePromptDeleteService = (service: ServiceRecord) => {
    const moto = motorcycles.find((m) => m.id === service.motorcycleId);
    setDeleteDialog({
      isOpen: true,
      title: 'Delete Service Entry?',
      message: `Are you sure you want to delete the service record "${service.workDone}" (${service.serviceDate}) for ${moto?.plateNumber || 'motorcycle'}?`,
      confirmLabel: 'Delete Entry',
      impactWarning: 'The total expenditure calculation will decrease by this service cost.',
      onConfirm: () => {
        setServices((prev) => prev.filter((s) => s.id !== service.id));
        setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      {/* Offline Status Alert */}
      <div className="print:hidden">
        <OfflineBanner />
      </div>

      {/* App Header & Navigation */}
      <div className="print:hidden">
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenAddMotorcycle={() => {
            setMotorcycleToEdit(null);
            setIsMotorcycleModalOpen(true);
          }}
          onOpenAddService={() => {
            setServiceToEdit(null);
            setPreselectedMotorcycleId(undefined);
            setIsServiceModalOpen(true);
          }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 md:pb-12 print:p-0 print:m-0 print:max-w-none">
        {activeTab === 'dashboard' && (
          <DashboardView
            motorcycles={motorcycles}
            services={services}
            onOpenAddMotorcycle={() => {
              setMotorcycleToEdit(null);
              setIsMotorcycleModalOpen(true);
            }}
            onOpenAddService={(motorcycleId) => {
              setServiceToEdit(null);
              setPreselectedMotorcycleId(motorcycleId);
              setIsServiceModalOpen(true);
            }}
            onSelectMotorcycle={(moto) => setSelectedMotorcycleForDetail(moto)}
            onNavigateTab={setActiveTab}
            onEditService={(service) => {
              setServiceToEdit(service);
              setIsServiceModalOpen(true);
            }}
          />
        )}

        {activeTab === 'motorcycles' && (
          <MotorcycleListView
            motorcycles={motorcycles}
            services={services}
            onOpenAddMotorcycle={() => {
              setMotorcycleToEdit(null);
              setIsMotorcycleModalOpen(true);
            }}
            onEditMotorcycle={(moto) => {
              setMotorcycleToEdit(moto);
              setIsMotorcycleModalOpen(true);
            }}
            onDeleteMotorcycle={handlePromptDeleteMotorcycle}
            onSelectMotorcycle={(moto) => setSelectedMotorcycleForDetail(moto)}
            onAddServiceToMotorcycle={(motorcycleId) => {
              setServiceToEdit(null);
              setPreselectedMotorcycleId(motorcycleId);
              setIsServiceModalOpen(true);
            }}
          />
        )}

        {activeTab === 'expenditure' && (
          <ExpenditureSummaryView
            motorcycles={motorcycles}
            services={services}
            onEditService={(service) => {
              setServiceToEdit(service);
              setIsServiceModalOpen(true);
            }}
            onDeleteService={handlePromptDeleteService}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="print:hidden">
        <MobileBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>

      {/* Modals */}
      {/* 1. Add / Edit Motorcycle Modal */}
      <AddEditMotorcycleModal
        isOpen={isMotorcycleModalOpen}
        motorcycleToEdit={motorcycleToEdit}
        onClose={() => {
          setIsMotorcycleModalOpen(false);
          setMotorcycleToEdit(null);
        }}
        onSave={handleSaveMotorcycle}
      />

      {/* 2. Add / Edit Service Modal */}
      <AddEditServiceModal
        isOpen={isServiceModalOpen}
        motorcycles={motorcycles}
        preselectedMotorcycleId={preselectedMotorcycleId}
        serviceToEdit={serviceToEdit}
        onClose={() => {
          setIsServiceModalOpen(false);
          setServiceToEdit(null);
          setPreselectedMotorcycleId(undefined);
        }}
        onSave={handleSaveService}
      />

      {/* 3. Motorcycle Detail & Service History Modal */}
      <MotorcycleDetailModal
        isOpen={!!selectedMotorcycleForDetail}
        motorcycle={selectedMotorcycleForDetail}
        services={services}
        onClose={() => setSelectedMotorcycleForDetail(null)}
        onEditMotorcycle={(moto) => {
          setMotorcycleToEdit(moto);
          setIsMotorcycleModalOpen(true);
        }}
        onDeleteMotorcycle={(moto) => handlePromptDeleteMotorcycle(moto)}
        onAddService={(motorcycleId) => {
          setServiceToEdit(null);
          setPreselectedMotorcycleId(motorcycleId);
          setIsServiceModalOpen(true);
        }}
        onEditService={(service) => {
          setServiceToEdit(service);
          setIsServiceModalOpen(true);
        }}
        onDeleteService={(service) => handlePromptDeleteService(service)}
      />

      {/* 4. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        message={deleteDialog.message}
        confirmLabel={deleteDialog.confirmLabel}
        impactWarning={deleteDialog.impactWarning}
        onConfirm={deleteDialog.onConfirm}
        onCancel={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
