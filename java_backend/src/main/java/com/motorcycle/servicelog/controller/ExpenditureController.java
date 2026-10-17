package com.motorcycle.servicelog.controller;

import com.motorcycle.servicelog.dto.ExpenditureSummaryDTO;
import com.motorcycle.servicelog.service.ServiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/expenditure")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExpenditureController {

    private final ServiceRecordService serviceRecordService;

    @GetMapping("/summary")
    public ResponseEntity<ExpenditureSummaryDTO> getExpenditureSummary() {
        return ResponseEntity.ok(serviceRecordService.getExpenditureSummary());
    }

    @GetMapping("/total")
    public ResponseEntity<Long> getTotalExpenditure() {
        return ResponseEntity.ok(serviceRecordService.getTotalExpenditure());
    }

    @GetMapping("/motorcycle/{motorcycleId}")
    public ResponseEntity<Long> getMotorcycleExpenditure(@PathVariable String motorcycleId) {
        return ResponseEntity.ok(serviceRecordService.getMotorcycleExpenditure(motorcycleId));
    }
}
