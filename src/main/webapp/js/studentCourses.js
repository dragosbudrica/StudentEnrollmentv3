$(document).ready(function () {
    getStudentCourses();
});

function getStudentCourses() {
    var warning = $("#warning");
    $.ajax({
        url: '/getStudentCourses',
        type: 'GET',
        dataType: 'json',
        traditional: true,
        success: function (data) {
            if (data.length === 0) {
                $(warning).find('h1').text("You aren't enrolled to any course yet!");
                warning.show();
            } else {
                Enrollment.sortCourseAscending(data);
                renderCourses(data);
                Enrollment.prepareDisplayCourseDetails();
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function renderCourses(data) {
    var tbodyCourses = $('#tbodyCourses');
    var paginationCourses = $('#paginationCourses');
    var tr;
    for (var i = 0; i < data.length; i++) {
        tr = $('<tr/>');
        tr.append("<td><span data-courseCode=" + data[i].courseCode + " class=\"courseNameClass\">" + data[i].courseName + "</span></td>");
        tr.append("<td>" + data[i].category + "</td>");
        tr.append("<td>" + data[i].professor + "</td>");
        tbodyCourses.append(tr);
    }
    $('#studentCourses').show();
    Enrollment.pagination(tbodyCourses, paginationCourses);
}

function displayCourseDetailsStudent(data, courseName) {
    var tbodyLectures = $("#tbodyLectures");
    var paginationLectures = $('#paginationLectures');
    tbodyLectures.empty();
    paginationLectures.empty();
    $('#courseName').text(courseName);
    var tr;
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        tr = $('<tr/>');
        if (item.attachment === null) {
            tr.append("<td>" + item.name + "</td>");
            tr.append("<td>No PDF</td>");
            $('#tbodyLectures').append(tr);
        } else if (item.attachment !== null) {
            tr.append("<td>" + item.name + "</td>");
            tr.append("<td><a href=\"/download/"+item.lectureId+"\"><img src=\"/resources/images/rsz_download-pdf.png\"/></a></td>");
            tbodyLectures.append(tr);
        }
    }
    $("#courseDetails").show();
    Enrollment.pagination(tbodyLectures, paginationLectures);
}


