<%--
  Created by IntelliJ IDEA.
  User: Dragos
  Date: 16.08.2017
  Time: 17:50
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div id="warning">
    <img alt="" src="/resources/images/icon-warning-png-11.png"/>
    <h1></h1>
</div>
<div id="studentCourses">
    <h1>My Courses</h1>
    <table id="grid">
        <thead>
        <tr>
            <th>Course Name</th>
            <th>Category</th>
            <th>Professor</th>
        </tr>
        </thead>
        <tfoot>
        <tr>
            <td colspan="3" id="paginationCourses"></td>
        </tr>
        </tfoot>
        <tbody id="tbodyCourses"></tbody>
    </table>
    <div id="message" style="display: none" align="center"></div>
</div>
