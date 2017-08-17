package com.kepler.rominfo.mappers;

import com.kepler.rominfo.model.Professor;
import com.kepler.rominfo.model.Student;
import com.kepler.rominfo.model.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserMapper {

    List<User> getAllUsers();

    @Transactional
    void addUser(User user);

    @Transactional
    void addStudent(@Param("userId") long userId);

    @Transactional
    void addProfessor(@Param("userId") long userId);

    User findByEmail(@Param("email") String email);

    Student findStudentByEmail(@Param("email") String email);

    Professor findProfessorByEmail(@Param("email") String email);

    List<Student> getEnrolledStudents(@Param("courseCode") long courseCode);

    Student findStudentByUserId(@Param("userId") long userId);
}
