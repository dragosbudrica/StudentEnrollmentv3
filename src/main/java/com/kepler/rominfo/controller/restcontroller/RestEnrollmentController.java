package com.kepler.rominfo.controller.restcontroller;

import com.kepler.rominfo.model.Course;
import com.kepler.rominfo.model.Student;
import com.kepler.rominfo.model.User;
import com.kepler.rominfo.service.CourseService;
import com.kepler.rominfo.service.EnrollmentService;
import com.kepler.rominfo.service.UserService;
import com.kepler.rominfo.utils.CourseAlreadyExistsException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
public class RestEnrollmentController {

    private static final Log LOGGER = LogFactory.getLog(RestEnrollmentController.class);

    private EnrollmentService enrollmentService;
    private CourseService courseService;
    private UserService userService;


    @Autowired
    public void setCourseService(CourseService courseService) {
        this.courseService = courseService;
    }

    @Autowired
    public void setEnrollmentService(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/enroll", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.OK)
    public String enroll(@RequestBody Map<String, Object> params, HttpSession session) {
        String enrollmentResult = null;
        String courseCode = (String) params.get("courseCode");
        User user = (User) session.getAttribute("user");
        Student student = userService.findStudent(user.getEmail());
        Course course = courseService.getCourseByCode(Long.parseLong(courseCode));

        try {
            if(!enrollmentService.alreadyEnrolled(student, course)) {
                enrollmentService.enroll(student, course);
                enrollmentResult = "Enrollment successful!";
            }
            else {
                LOGGER.info("student already enrolled at this course");
                enrollmentResult = "Enrollment failed!";
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            LOGGER.info("enrollment failed for " + user.getEmail());
            enrollmentResult = ex.getMessage();
        }

        return enrollmentResult;
    }
}
