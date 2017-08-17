package com.kepler.rominfo.service;

import com.kepler.rominfo.mappers.UserMapper;
import com.kepler.rominfo.model.Professor;
import com.kepler.rominfo.model.Student;
import com.kepler.rominfo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }


    @Transactional
    public void addUser(String firstName, String lastName, long ssn, String email, String password, String role) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setSsn(ssn);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        userMapper.addUser(user);
        if(role.equals("Student")) {
            User student = userMapper.findByEmail(email);
            userMapper.addStudent(student.getUserId());
        } else {
            User professor = userMapper.findByEmail(email);
            userMapper.addProfessor(professor.getUserId());
        }
    }

    public User findUser(String email) {
        return userMapper.findByEmail(email);
    }

    public Student findStudent(String email) {
        return userMapper.findStudentByEmail(email);
    }

    public Professor findProfessor(String email) { return userMapper.findProfessorByEmail(email); }

    public boolean checkCredentials(User user, String email, String password) {
        return (user.getEmail().equals(email) && user.getPassword().equals(password));
    }

    public List<Student> getEnrolledStudents(long courseCode) {
        return userMapper.getEnrolledStudents(courseCode);
    }
}

