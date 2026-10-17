package com.motorcycle.servicelog.repository;

import com.motorcycle.servicelog.model.Motorcycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MotorcycleRepository extends JpaRepository<Motorcycle, String> {
    Optional<Motorcycle> findByPlateNumberIgnoreCase(String plateNumber);
    List<Motorcycle> findAllByOrderByCreatedAtDesc();
}
