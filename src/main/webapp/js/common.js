var Enrollment = Enrollment || {};

Enrollment.countChar = function countChar(val) {
    var max = 255;
    var charNum = $('#charNum');
    var len = val.value.length;
    if (len >= max) {
        charNum.text('You have reached the limit');
        charNum.css('color', 'red');
    } else {
        var chars = max - len;
        charNum.text(chars + " characters remaining");
        charNum.css('color', 'green');
    }
};

Enrollment.sortCourseAscending = function sortCourseAscending(data) {
    data.sort(function (a, b) {
        return a.courseName.localeCompare(b.courseName);
    });
}

Enrollment.pagination = function pagination(tbody, pagination) {
    var req_num_row = 5;
    var $tr = $(tbody).find('tr');
    var total_num_row = $tr.length;
    var num_pages = 0;
    if (total_num_row % req_num_row == 0) {
        num_pages = total_num_row / req_num_row;
    }
    if (total_num_row % req_num_row >= 1) {
        num_pages = total_num_row / req_num_row;
        num_pages++;
        num_pages = Math.floor(num_pages++);
    }
    for (var i = 1; i <= num_pages; i++) {
        pagination.append(" <a href=" + i + ">" + i + "</a> ");
    }
    $tr.each(function (i) {
        jQuery(this).hide();
        if (i + 1 <= req_num_row) {
            $tr.eq(i).show();
        }

    });
    pagination.find('a').click(function (e) {
        e.preventDefault();
        $tr.hide();
        var page = jQuery(this).text();
        var temp = page - 1;
        var start = temp * req_num_row;
        //alert(start);

        for (var i = 0; i < req_num_row; i++) {

            $tr.eq(start + i).show();
        }
    });
}

Enrollment.prepareDisplayCourseDetails = function prepareDisplayCourseDetails() {
    var tbody = $("#tbodyCourses");
    var spansCourseName = tbody.find("span[class=courseNameClass]");

    for (var i = 0; i < spansCourseName.length; i++) {
        $(spansCourseName[i]).on("click", Enrollment.getCourseDetails);
    }
}

Enrollment.getCourseDetails = function getCourseDetails() {
    var courseCode = $(this).attr('data-courseCode');
    var courseName = $(this).text();
    var jsonParam = JSON.stringify({
        'courseCode': courseCode
    });

    $.ajax({
        url: "/getLectures",
        type: 'POST',
        data: jsonParam,
        contentType: "application/json",
        success: function (data) {
            Enrollment.sortLectureAsceding(data, courseName, courseCode);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

Enrollment.sortLectureAsceding = function sortLectureAsceding(data, courseName, courseCode) {
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;

    data.sort(function (a, b) {
        var aA = a.name.replace(reA, "");
        var bA = b.name.replace(reA, "");
        if(aA === bA) {
            var aN = parseInt(a.name.replace(reN, ""), 10);
            var bN = parseInt(b.name.replace(reN, ""), 10);
            return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
            return aA > bA ? 1 : -1;
        }
    });
    if(role === "Professor") {
        displayCourseDetailsProfessor(data, courseName, courseCode);
    } else if(role === "Student") {
        displayCourseDetailsStudent(data, courseName);
    }
}





