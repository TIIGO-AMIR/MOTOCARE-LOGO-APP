package com.motorcycle.servicelog.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "motorcycles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Motorcycle {

    @Id
    @Column(nullable = false, unique = true)
    private String id;

    @NotBlank(message = "Registration / plate number is required")
    @Column(nullable = false)
    private String plateNumber;

    @NotBlank(message = "Make is required")
    @Column(nullable = false)
    private String make;

    @NotBlank(message = "Model is required")
    @Column(nullable = false)
    private String model;

    private Integer year;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (id == null || id.isEmpty()) {
            id = "bike-" + System.currentTimeMillis();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
