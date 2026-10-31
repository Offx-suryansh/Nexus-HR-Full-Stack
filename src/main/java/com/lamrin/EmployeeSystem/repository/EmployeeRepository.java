package com.lamrin.EmployeeSystem.repository;

import com.lamrin.EmployeeSystem.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    boolean existsByDepartment_Id(int departmentId);
}
