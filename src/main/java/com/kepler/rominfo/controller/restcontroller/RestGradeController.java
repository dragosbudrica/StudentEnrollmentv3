package com.kepler.rominfo.controller.restcontroller;

import com.kepler.rominfo.dto.CourseDto;
import com.kepler.rominfo.model.*;
import com.kepler.rominfo.service.CourseService;
import com.kepler.rominfo.service.EnrollmentService;
import com.kepler.rominfo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class RestGradeController {

    private CourseService courseService;

    private UserService userService;

    private EnrollmentService enrollmentService;

    @Autowired
    public void setEnrollmentService(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setCourseService(CourseService courseService) {
        this.courseService = courseService;
    }

    @RequestMapping(value = "/getCoursesWithEnrolledStudents", method = RequestMethod.GET)
    public List<CourseDto> getProfessorCourses(HttpSession session) {
        List<CourseDto> professorCoursesWithEnrolledStudents = new ArrayList<>();
        try {
            User user = (User) session.getAttribute("user");
            List<Course> courses = courseService.getProfessorCoursesWithEnrolledStudents(user.getEmail());

            for (Course currentCourse : courses) {
                CourseDto courseDto = courseService.putCourseDtoProperties(currentCourse);
                courseDto.setNumberOfEnrolledStudents(currentCourse.getNumberOfEnrolledStudents());
                professorCoursesWithEnrolledStudents.add(courseDto);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return professorCoursesWithEnrolledStudents;
    }

    @RequestMapping(value = "/getEnrolledStudents", method = RequestMethod.POST)
    public List<Student> getEnrolledStudents(@RequestBody Map<String, Object> params) {
        String courseCode = (String) params.get("courseCode");
        List<Student> students = null;
        try {
            students = userService.getEnrolledStudents(Long.parseLong(courseCode));
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return students;
    }

    @RequestMapping(value = "/editMark", method = RequestMethod.PUT)
    @ResponseStatus(value = HttpStatus.OK)
    public void editMark(@RequestBody Map<String, Object> params) {
        String courseCode = (String) params.get("courseCode");
        String userId = (String) params.get("userId");
        String mark = (String) params.get("mark");
        try {
            enrollmentService.editMark(Long.parseLong(courseCode), Long.parseLong(userId), Integer.parseInt(mark));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @RequestMapping(value = "/removeMark", method = RequestMethod.DELETE)
    @ResponseStatus(value = HttpStatus.OK)
    public void removeMark(@RequestBody Map<String, Object> params) {
        String courseCode = (String) params.get("courseCode");
        String userId = (String) params.get("userId");

        try {
            enrollmentService.removeMark(Long.parseLong(courseCode), Long.parseLong(userId));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @RequestMapping(value = "/getMyCoursesWithGrades", method = RequestMethod.GET)
    public List<CourseDto> getMyCoursesWithGrades(HttpSession session) {
        List<CourseDto> studentCoursesWithGrades = new ArrayList<>();
        try {
            User user = (User) session.getAttribute("user");
            List<Course> courses = courseService.getStudentCoursesWithGrades(user.getEmail());

            for (Course currentCourse : courses) {
                CourseDto courseDto = courseService.putCourseDtoProperties(currentCourse);
                courseDto.setMark(currentCourse.getMark());
                courseDto.setValidated(currentCourse.isValidated());
                studentCoursesWithGrades.add(courseDto);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return studentCoursesWithGrades;
    }
}
