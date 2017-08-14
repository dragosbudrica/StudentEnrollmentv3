<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java"
         contentType="text/html; charset=windows-1256"
         pageEncoding="windows-1256"
%>
<%@ page session="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <link rel="stylesheet" href="/css/allCourses.css"/>
    <script type="text/javascript" src="/js/allCourses.js"></script>
</head>
<body>
<div id="allCourses">
    <h1>All Courses</h1>
    <table id="grid">
        <thead>
        <tr>
            <th>Course Name</th>
            <th>Category</th>
            <th>Professor</th>
            <th></th>
        </tr>
        </thead>
        <tbody id="tbody"></tbody>
    </table>
    <div id="pagination"></div>
    <div id="message"></div>
</div>

<div id="enrollDialog">
    <span class="close">&times;</span>
    <p>Are you sure you want to be enrolled at this course?</p>
    <div class="options">
        <button id="enroll" data-courseCode="">Enroll</button>
        <button class="cancel">Cancel</button>
    </div>
</div>
<div class="cover"></div>
</body>
</html>
