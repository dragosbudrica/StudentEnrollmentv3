package com.kepler.rominfo.controller.restcontroller;

import com.kepler.rominfo.model.Lecture;
import com.kepler.rominfo.service.CourseService;
import com.kepler.rominfo.service.LectureService;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RestController
public class RestLectureController {
    private static final Log LOGGER = LogFactory.getLog(RestLectureController.class);

    private LectureService lectureService;

    @Autowired
    public void setLectureService(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @RequestMapping(value = "/getLectures", method = RequestMethod.POST)
    public List<Lecture> getLectures(@RequestBody Map<String, Object> params) {
        String courseCode = (String) params.get("courseCode");
        List<Lecture> lectures = null;
        try {
            lectures = lectureService.getLectures(Long.parseLong(courseCode));
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return lectures;
    }

    @RequestMapping(value = "/upload/{lectureId}", method = RequestMethod.POST)
    public @ResponseBody String doUpload(@PathVariable("lectureId") String lectureId, MultipartHttpServletRequest request, HttpServletResponse response) {
        String result = null;

        MultipartFile multipartFile =  request.getFile("file");
        InputStream stream = null;
        try {
            stream = multipartFile.getInputStream();
            byte[] file = IOUtils.toByteArray(stream);
            lectureService.uploadFile(file, Long.parseLong(lectureId));
            result = "The file was successfully uploaded!";
        } catch (IOException e) {
            e.printStackTrace();
            result = "The upload process failed! Reason: " + e.getMessage();
        }

        return result;
    }

    @RequestMapping(value = "/removeLectureAttachment/{lectureId}", method = RequestMethod.DELETE)
    @ResponseStatus(value = HttpStatus.OK)
    public void removeLectureAttachment(@PathVariable("lectureId") String lectureId) {
        try {
            lectureService.removeLectureAttachment(Long.parseLong(lectureId));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
