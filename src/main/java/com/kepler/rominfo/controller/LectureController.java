package com.kepler.rominfo.controller;

import com.kepler.rominfo.model.Lecture;
import com.kepler.rominfo.service.LectureService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Controller
public class LectureController {

    private LectureService lectureService;

    @Autowired
    public void setLectureService(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @RequestMapping(value = "/download/{lectureId}", method = RequestMethod.GET)
    public @ResponseBody
    String doDownload(@PathVariable("lectureId") String lectureId, HttpServletResponse response) {
        String result = null;

        Lecture lecture = lectureService.getLectureById(Long.parseLong(lectureId));
        InputStream is = new ByteArrayInputStream(lecture.getAttachment());
        try {
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename="+lecture.getName()+".pdf");
            IOUtils.copy(is, response.getOutputStream());
            response.flushBuffer();
            result = "The file was successfully downloaded!";
        } catch (IOException e) {
            e.printStackTrace();
            result = "The download process failed! Reason: " + e.getMessage();
        }

        return result;
    }
}
