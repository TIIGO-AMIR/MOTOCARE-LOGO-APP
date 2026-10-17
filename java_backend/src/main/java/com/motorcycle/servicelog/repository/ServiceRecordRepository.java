package com.motorcycle.servicelog.repository;

import com.motorcycle.servicelog.model.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, String> {
    List<ServiceRecord> findByMotorcycleIdOrderByServiceDateDesc(String motorcycleId);
    List<ServiceRecord> findAllByOrderByServiceDateDesc();
    void deleteByMotorcycleId(String motorcycleId);

    @Query("SELECT COALESCE(SUM(s.cost), 0) FROM ServiceRecord s")
    Long calculateTotalExpenditure();

    @Query("SELECT COALESCE(SUM(s.cost), 0) FROM ServiceRecord s WHERE s.motorcycleId = :motorcycleId")
    Long calculateMotorcycleExpenditure(String motorcycleId);
}
