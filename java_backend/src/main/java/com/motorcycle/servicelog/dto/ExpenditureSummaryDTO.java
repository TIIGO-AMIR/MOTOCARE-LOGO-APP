package com.motorcycle.servicelog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenditureSummaryDTO {
    private Long grandTotal;
    private String currency; // "UGX"
    private int totalRecords;
    private int totalMotorcycles;
    private List<MotorcycleExpenditureDTO> breakdownByMotorcycle;
    private Map<String, Long> breakdownByCategory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MotorcycleExpenditureDTO {
        private String motorcycleId;
        private String plateNumber;
        private String make;
        private String model;
        private Long totalSpent;
        private int serviceCount;
        private double percentageOfTotal;
    }
}
