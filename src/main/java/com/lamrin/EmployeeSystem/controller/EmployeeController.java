package com.lamrin.EmployeeSystem.controller;

import com.lamrin.EmployeeSystem.entity.Department;
import com.lamrin.EmployeeSystem.entity.Employee;
import com.lamrin.EmployeeSystem.repository.DepartmentRepository;
import com.lamrin.EmployeeSystem.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500", "http://localhost:5500",
        "http://127.0.0.1:5100", "http://localhost:5100"
})
@RequestMapping("/emp")
public class EmployeeController {

    private final EmployeeRepository repo;
    private final DepartmentRepository departmentRepo;

    public EmployeeController(EmployeeRepository repo, DepartmentRepository departmentRepo) {
        this.repo = repo;
        this.departmentRepo = departmentRepo;
    }

    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeRequest request) {
        Optional<Department> department = departmentRepo.findById(request.departmentId);
        if (department.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a valid department");
        }
        Employee employee = new Employee(request.name, request.email,
                department.get(), request.salary);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(employee));
    }

    @GetMapping
    public ResponseEntity<List<Employee>> readAllEmployees() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable int id) {
        return repo.findById(id).<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable int id,
                                             @RequestBody EmployeeRequest request) {
        Optional<Employee> found = repo.findById(id);
        Optional<Department> department = departmentRepo.findById(request.departmentId);
        if (found.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        if (department.isEmpty()) return ResponseEntity.badRequest().body("Please select a valid department");

        Employee employee = found.get();
        employee.setName(request.name);
        employee.setEmail(request.email);
        employee.setSalary(request.salary);
        employee.setDepartment(department.get());
        return ResponseEntity.ok(repo.save(employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable int id) {
        if (!repo.existsById(id)) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        repo.deleteById(id);
        return ResponseEntity.ok("Employee deleted");
    }

    public static class EmployeeRequest {
        public String name;
        public String email;
        public double salary;
        public int departmentId;
    }
}
