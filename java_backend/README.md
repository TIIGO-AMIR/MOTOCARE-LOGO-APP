# Motorcycle Service Log - Java Spring Boot Backend

Production-ready Java backend service utilizing **Spring Boot 3** and **SQLite / JPA** for persistent data management and expenditure calculation.

## Features
- **RESTful Endpoints**: Full CRUD for motorcycles and service entries.
- **Expenditure Engine**: Real-time calculation of overall total and per-motorcycle servicing expenditures in UGX.
- **Validation**: Enforces required fields, non-negative costs, and cascade deletions.
- **Cross-Origin (CORS)**: Pre-configured to communicate seamlessly with Flutter mobile and Web clients.

## Project Structure
```
java_backend/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── resources/
        │   └── application.properties
        └── java/com/motorcycle/servicelog/
            ├── MotorcycleServiceLogApplication.java
            ├── model/
            │   ├── Motorcycle.java
            │   └── ServiceRecord.java
            ├── repository/
            │   ├── MotorcycleRepository.java
            │   └── ServiceRecordRepository.java
            ├── service/
            │   ├── MotorcycleService.java
            │   └── ServiceRecordService.java
            ├── controller/
            │   ├── MotorcycleController.java
            │   ├── ServiceRecordController.java
            │   └── ExpenditureController.java
            └── dto/
                └── ExpenditureSummaryDTO.java
```

## REST API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/motorcycles` | List all motorcycles |
| `POST` | `/api/motorcycles` | Register new motorcycle |
| `GET` | `/api/motorcycles/{id}` | Get motorcycle details |
| `PUT` | `/api/motorcycles/{id}` | Update motorcycle |
| `DELETE` | `/api/motorcycles/{id}` | Delete motorcycle and linked services |
| `GET` | `/api/services` | List service records (filter: `?motorcycleId=`) |
| `POST` | `/api/services` | Record new service visit |
| `PUT` | `/api/services/{id}` | Update service record |
| `DELETE` | `/api/services/{id}` | Delete service record |
| `GET` | `/api/expenditure/summary` | Get overall total & breakdowns |
| `GET` | `/api/expenditure/total` | Get grand total in UGX |

## How to Run
1. Install Java 17+ and Maven.
2. In `java_backend/`:
   ```bash
   mvn clean spring-boot:run
   ```
3. Server runs on port `8080`.
