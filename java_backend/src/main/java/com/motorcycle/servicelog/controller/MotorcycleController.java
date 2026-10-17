package com.motorcycle.servicelog.controller;

import com.motorcycle.servicelog.model.Motorcycle;
import com.motorcycle.servicelog.service.MotorcycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motorcycles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MotorcycleController {

    private final MotorcycleService motorcycleService;

    @GetMapping
    public ResponseEntity<List<Motorcycle>> getAllMotorcycles() {
        return ResponseEntity.ok(motorcycleService.getAllMotorcycles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motorcycle> getMotorcycleById(@PathVariable String id) {
        return motorcycleService.getMotorcycleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Motorcycle> createMotorcycle(@Valid @RequestBody Motorcycle motorcycle) {
        Motorcycle saved = motorcycleService.saveMotorcycle(motorcycle);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Motorcycle> updateMotorcycle(@PathVariable String id, @Valid @RequestBody Motorcycle motorcycle) {
        return motorcycleService.getMotorcycleById(id)
                .map(existing -> {
                    motorcycle.setId(id);
                    return ResponseEntity.ok(motorcycleService.saveMotorcycle(motorcycle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMotorcycle(@PathVariable String id) {
        motorcycleService.deleteMotorcycle(id);
        return ResponseEntity.noContent().build();
    }
}
