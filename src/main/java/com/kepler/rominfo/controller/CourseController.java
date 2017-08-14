package com.kepler.rominfo.controller;

import com.kepler.rominfo.dto.CourseDto;
import com.kepler.rominfo.model.Course;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.List;

@Controller
public class CourseController {

    @RequestMapping(value = "/allCourses", method = RequestMethod.GET)
    public String allCourses() {
      return "allCourses";
    }

    @RequestMapping(value = "/studentCourses", method = RequestMethod.GET)
    public String studentCourses() {
        return "studentCourses";
    }

    @RequestMapping(value = "/professorCourses", method = RequestMethod.GET)
    public String professorCourses() {
        return "professorCourses";
    }

    @RequestMapping(value = "/newCourse", method = RequestMethod.GET)
    public String newCourse() {
        return "newCourse";
    }
}
