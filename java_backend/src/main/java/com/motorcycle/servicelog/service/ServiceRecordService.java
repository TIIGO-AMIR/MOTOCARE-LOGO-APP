package com.motorcycle.servicelog.service;

import com.motorcycle.servicelog.dto.ExpenditureSummaryDTO;
import com.motorcycle.servicelog.model.Motorcycle;
import com.motorcycle.servicelog.model.ServiceRecord;
import com.motorcycle.servicelog.repository.MotorcycleRepository;
import com.motorcycle.servicelog.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceRecordService {

    private final ServiceRecordRepository serviceRecordRepository;
    private final MotorcycleRepository motorcycleRepository;

    public List<ServiceRecord> getAllServices() {
        return serviceRecordRepository.findAllByOrderByServiceDateDesc();
    }

    public List<ServiceRecord> getServicesByMotorcycleId(String motorcycleId) {
        return serviceRecordRepository.findByMotorcycleIdOrderByServiceDateDesc(motorcycleId);
    }

    public Optional<ServiceRecord> getServiceById(String id) {
        return serviceRecordRepository.findById(id);
    }

    public ServiceRecord saveService(ServiceRecord record) {
        return serviceRecordRepository.save(record);
    }

    public void deleteService(String id) {
        serviceRecordRepository.deleteById(id);
    }

    public Long getTotalExpenditure() {
        return serviceRecordRepository.calculateTotalExpenditure();
    }

    public Long getMotorcycleExpenditure(String motorcycleId) {
        return serviceRecordRepository.calculateMotorcycleExpenditure(motorcycleId);
    }

    public ExpenditureSummaryDTO getExpenditureSummary() {
        List<ServiceRecord> allServices = serviceRecordRepository.findAll();
        List<Motorcycle> allMotorcycles = motorcycleRepository.findAll();
        Long grandTotal = serviceRecordRepository.calculateTotalExpenditure();

        // Breakdown by Motorcycle
        Map<String, List<ServiceRecord>> servicesByMoto = allServices.stream()
                .collect(Collectors.groupingBy(ServiceRecord::getMotorcycleId));

        List<ExpenditureSummaryDTO.MotorcycleExpenditureDTO> motoBreakdown = allMotorcycles.stream()
                .map(m -> {
                    List<ServiceRecord> motoServices = servicesByMoto.getOrDefault(m.getId(), Collections.emptyList());
                    long totalSpent = motoServices.stream().mapToLong(ServiceRecord::getCost).sum();
                    double pct = grandTotal > 0 ? ((double) totalSpent / grandTotal) * 100 : 0.0;

                    return ExpenditureSummaryDTO.MotorcycleExpenditureDTO.builder()
                            .motorcycleId(m.getId())
                            .plateNumber(m.getPlateNumber())
                            .make(m.getMake())
                            .model(m.getModel())
                            .totalSpent(totalSpent)
                            .serviceCount(motoServices.size())
                            .percentageOfTotal(Math.round(pct * 10.0) / 10.0)
                            .build();
                })
                .sorted(Comparator.comparing(ExpenditureSummaryDTO.MotorcycleExpenditureDTO::getTotalSpent).reversed())
                .collect(Collectors.toList());

        // Breakdown by Category
        Map<String, Long> categoryBreakdown = allServices.stream()
                .collect(Collectors.groupingBy(
                        ServiceRecord::getCategory,
                        Collectors.summingLong(ServiceRecord::getCost)
                ));

        return ExpenditureSummaryDTO.builder()
                .grandTotal(grandTotal)
                .currency("UGX")
                .totalRecords(allServices.size())
                .totalMotorcycles(allMotorcycles.size())
                .breakdownByMotorcycle(motoBreakdown)
                .breakdownByCategory(categoryBreakdown)
                .build();
    }
}
