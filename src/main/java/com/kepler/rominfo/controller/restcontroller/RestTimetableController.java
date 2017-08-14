package com.kepler.rominfo.controller.restcontroller;

import com.kepler.rominfo.dto.CourseDto;
import com.kepler.rominfo.model.Course;
import com.kepler.rominfo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class RestTimetableController {

    private CourseService courseService;

    @Autowired
    public void setCourseService(CourseService courseService) {
        this.courseService = courseService;
    }

    @RequestMapping(value = "/getEvents", method = RequestMethod.GET)
    public List<CourseDto> getEvents() {
        List<CourseDto> events = new ArrayList<CourseDto>();
        boolean timetableUnderConstruction = false;
        for (Course course : courseService.getAllCourses()) {
            if (course.getStartTime() == null) {
                timetableUnderConstruction = true;
                break;
            }
        }

        if (!timetableUnderConstruction) {
            for (CourseDto currentCourseDto : courseService.getOnlyCoursesWithDates()) {
                List<CourseDto> reccurentCourses = courseService.getAllRecurrentCourses(currentCourseDto);
                events.addAll(reccurentCourses);
            }
        }

        return events;
    }
}
