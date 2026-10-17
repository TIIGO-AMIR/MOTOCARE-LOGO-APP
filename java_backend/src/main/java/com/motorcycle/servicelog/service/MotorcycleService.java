package com.motorcycle.servicelog.service;

import com.motorcycle.servicelog.model.Motorcycle;
import com.motorcycle.servicelog.repository.MotorcycleRepository;
import com.motorcycle.servicelog.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MotorcycleService {

    private final MotorcycleRepository motorcycleRepository;
    private final ServiceRecordRepository serviceRecordRepository;

    public List<Motorcycle> getAllMotorcycles() {
        return motorcycleRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Motorcycle> getMotorcycleById(String id) {
        return motorcycleRepository.findById(id);
    }

    public Motorcycle saveMotorcycle(Motorcycle motorcycle) {
        return motorcycleRepository.save(motorcycle);
    }

    @Transactional
    public void deleteMotorcycle(String id) {
        serviceRecordRepository.deleteByMotorcycleId(id);
        motorcycleRepository.deleteById(id);
    }
}
