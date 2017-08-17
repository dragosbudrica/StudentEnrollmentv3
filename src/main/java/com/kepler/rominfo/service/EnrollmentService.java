package com.kepler.rominfo.service;

import com.kepler.rominfo.mappers.EnrollmentMapper;
import com.kepler.rominfo.mappers.UserMapper;
import com.kepler.rominfo.model.Course;
import com.kepler.rominfo.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class EnrollmentService {
    private EnrollmentMapper enrollmentMapper;
    private UserMapper userMapper;

    @Autowired
    public EnrollmentService(EnrollmentMapper enrollmentMapper, UserMapper userMapper) {
        this.enrollmentMapper = enrollmentMapper;
        this.userMapper = userMapper;
    }

    @Transactional
    public void enroll(Student student, Course course) {
        student.getCourses().add(course);
        course.getStudents().add(student);
        enrollmentMapper.addEnrollment(student.getStudentId(), course.getCourseCode());
    }

    public boolean alreadyEnrolled(Student student, Course course) {
        for (Course currentCourse : enrollmentMapper.getCoursesOfStudent(student.getStudentId())) {
            if(currentCourse.getCourseCode() == course.getCourseCode())
                return true;
        }
        return false;
    }

    public void editMark(long courseCode, long userId, int mark) {
        Student student = userMapper.findStudentByUserId(userId);
        enrollmentMapper.editMark(courseCode, student.getStudentId(), mark);
    }

    public void removeMark(long courseCode, long userId) {
        Student student = userMapper.findStudentByUserId(userId);
        enrollmentMapper.removeMark(courseCode, student.getStudentId());
    }
}
