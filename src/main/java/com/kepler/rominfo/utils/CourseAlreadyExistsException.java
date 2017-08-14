package com.kepler.rominfo.utils;

public class CourseAlreadyExistsException extends Exception {
    public CourseAlreadyExistsException() {}

    public CourseAlreadyExistsException(String message) {
        super(message);
    }
}
