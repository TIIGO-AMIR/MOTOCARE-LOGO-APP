package com.motorcycle.servicelog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRecord {

    @Id
    @Column(nullable = false, unique = true)
    private String id;

    @NotBlank(message = "Motorcycle ID is required")
    @Column(nullable = false)
    private String motorcycleId;

    @NotBlank(message = "Service date is required")
    @Column(nullable = false)
    private String serviceDate;

    @NotBlank(message = "Work performed description is required")
    @Column(nullable = false, length = 1000)
    private String workDone;

    @NotNull(message = "Cost in UGX is required")
    @Min(value = 0, message = "Cost must be a valid non-negative amount")
    @Column(nullable = false)
    private Long cost; // Cost in Ugandan Shillings (UGX)

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null || id.isEmpty()) {
            id = "srv-" + System.currentTimeMillis();
        }
        if (category == null || category.isEmpty()) {
            category = "general";
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
