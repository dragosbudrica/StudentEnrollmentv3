package com.kepler.rominfo.filter;

import com.kepler.rominfo.model.User;
import com.kepler.rominfo.utils.Authorization;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

public class AuthenticationFilter implements Filter {

    private static final Log LOGGER = LogFactory.getLog(AuthenticationFilter.class);

    private static final String LOGIN_PAGE = "/login.jsp";
    private static final String UNAUTHORIZED = "/accessDenied.jsp";

    private static Map<String, ArrayList<String>> rights = Authorization.getRights();

    @Override
    public void doFilter(ServletRequest servletRequest,
                         ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

        User user = (User) httpServletRequest
                .getSession().getAttribute("user");

        if (user != null) {
            LOGGER.debug("user is logged in");
            // user is logged in, continue request
            String pageRequested = ((HttpServletRequest) servletRequest).getRequestURL().toString();
            LOGGER.info(user.getRole());
            LOGGER.info(pageRequested);

            if (!isAuthorized(user, pageRequested)) {
                httpServletResponse.sendRedirect(
                        httpServletRequest.getContextPath()
                                + UNAUTHORIZED);
            } else {
                filterChain.doFilter(servletRequest, servletResponse);
            }
        } else {
            LOGGER.debug("user is not logged in");
            // user is not logged in, redirect to login page
            httpServletResponse.sendRedirect(
                    httpServletRequest.getContextPath()
                            + LOGIN_PAGE);
        }
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
        LOGGER.debug("LoginFilter initialized");
    }

    @Override
    public void destroy() {
        // close resources
    }

    private boolean isAuthorized(User user, String pageRequested) {
        boolean authorized = false;

        outer:
        for (Map.Entry<String, ArrayList<String>> entry : rights.entrySet()) {
            String role = entry.getKey();
            ArrayList<String> pages = entry.getValue();

            for (String page : pages) {
                if (role.equals(user.getRole()) && pageRequested.contains(page)) {
                    authorized = true;
                    break outer;
                }
            }
        }
        return authorized;
    }
}
