package com.lamrin.EmployeeSystem.controller;

import com.lamrin.EmployeeSystem.entity.Department;
import com.lamrin.EmployeeSystem.repository.DepartmentRepository;
import com.lamrin.EmployeeSystem.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500", "http://localhost:5500",
        "http://127.0.0.1:5100", "http://localhost:5100"
})
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepo;
    private final EmployeeRepository employeeRepo;

    public DepartmentController(DepartmentRepository departmentRepo, EmployeeRepository employeeRepo) {
        this.departmentRepo = departmentRepo;
        this.employeeRepo = employeeRepo;
    }

    @GetMapping
    public List<Department> getDepartments() {
        return departmentRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addDepartment(@RequestBody DepartmentRequest request) {
        String name = request.name == null ? "" : request.name.trim();
        if (name.isEmpty()) return ResponseEntity.badRequest().body("Department name is required");
        if (departmentRepo.existsByNameIgnoreCase(name))
            return ResponseEntity.badRequest().body("Department already exists");
        Department department = new Department(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentRepo.save(department));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable int id,
                                               @RequestBody DepartmentRequest request) {
        return departmentRepo.findById(id).<ResponseEntity<?>>map(department -> {
            String name = request.name == null ? "" : request.name.trim();
            if (name.isEmpty()) return ResponseEntity.badRequest().body("Department name is required");
            department.setName(name);
            return ResponseEntity.ok(departmentRepo.save(department));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Department not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable int id) {
        if (employeeRepo.existsByDepartment_Id(id))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("This department has employees. Reassign or delete those employees first.");
        if (!departmentRepo.existsById(id))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Department not found");
        departmentRepo.deleteById(id);
        return ResponseEntity.ok("Department deleted");
    }

    public static class DepartmentRequest {
        public String name;
    }
}
