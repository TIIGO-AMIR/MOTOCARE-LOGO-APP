package com.motorcycle.servicelog.controller;

import com.motorcycle.servicelog.model.ServiceRecord;
import com.motorcycle.servicelog.service.ServiceRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceRecordController {

    private final ServiceRecordService serviceRecordService;

    @GetMapping
    public ResponseEntity<List<ServiceRecord>> getAllServices(
            @RequestParam(required = false) String motorcycleId) {
        if (motorcycleId != null && !motorcycleId.isEmpty()) {
            return ResponseEntity.ok(serviceRecordService.getServicesByMotorcycleId(motorcycleId));
        }
        return ResponseEntity.ok(serviceRecordService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRecord> getServiceById(@PathVariable String id) {
        return serviceRecordService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceRecord> createService(@Valid @RequestBody ServiceRecord record) {
        ServiceRecord saved = serviceRecordService.saveService(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceRecord> updateService(@PathVariable String id, @Valid @RequestBody ServiceRecord record) {
        return serviceRecordService.getServiceById(id)
                .map(existing -> {
                    record.setId(id);
                    return ResponseEntity.ok(serviceRecordService.saveService(record));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        serviceRecordService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
