package com.kepler.rominfo.service;

import com.kepler.rominfo.mappers.EnrollmentMapper;
import com.kepler.rominfo.model.Course;
import com.kepler.rominfo.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class EnrollmentService {
    private EnrollmentMapper enrollmentMapper;

    @Autowired
    public EnrollmentService(EnrollmentMapper enrollmentMapper) {
        this.enrollmentMapper = enrollmentMapper;
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
}
