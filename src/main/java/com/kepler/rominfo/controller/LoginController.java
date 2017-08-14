package com.kepler.rominfo.controller;

import com.kepler.rominfo.dto.CourseDto;
import com.kepler.rominfo.dto.LoginDto;
import com.kepler.rominfo.model.Course;
import com.kepler.rominfo.model.User;
import com.kepler.rominfo.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class LoginController {

    private static final Log LOGGER = LogFactory.getLog(LoginController.class);

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    @RequestMapping(value="/login", method = RequestMethod.GET)
    public String login(Model model) {
        model.addAttribute("loginDto", new LoginDto());
        return "login";
    }

    @RequestMapping(value = "/doLogin", method = RequestMethod.POST)
    public ModelAndView loginProcess(HttpSession session,
                                     @ModelAttribute("loginDto") LoginDto loginDto) {
        ModelAndView mav = null;
        User user = userService.findUser(loginDto.getEmail());
        if (user != null) {
            if (userService.checkCredentials(user, loginDto.getEmail(), loginDto.getPassword())) {
                session.setAttribute("user", user);
                switch (user.getRole()) {
                    case "Admin":
                        mav = new ModelAndView("redirect:/newAccount");
                        break;
                    case "Professor":
                        mav = new ModelAndView("redirect:/professorCourses");
                        break;
                    default:
                        mav = new ModelAndView("redirect:/allCourses");
                        break;
                }
                LOGGER.info(mav);
            }
            else {
                LOGGER.info("login failed for " + loginDto.getEmail() + ". Reason: Wrong password!");
                mav = new ModelAndView("login");
                mav.addObject("message", "Wrong password!");
            }
        } else {
            LOGGER.info("LoginDto failed for " + loginDto.getEmail() + ". Reason: That user does not exists!");
            mav = new ModelAndView("login");
            mav.addObject("message", "Invalid email!");
        }

        return mav;
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ModelAndView logout(HttpSession session) {
        ModelAndView mav = new ModelAndView("redirect:/login");
        LOGGER.debug("invalidating session for " + ((User) session.getAttribute("user")).getEmail());
        session.invalidate();
        return mav;
    }
}
