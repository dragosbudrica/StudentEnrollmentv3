$(document).ready(function () {
    getAllCourses();
});

function getAllCourses() {
    var warning = $("#warning");
    $.ajax({
        url: '/getAllCourses',
        type: 'GET',
        dataType: 'json',
        traditional: true,
        success: function (data) {
            if (data.length === 0) {
                $(warning).find('h1').text("There are no courses added yet!");
                warning.show();
            } else {
                sortCourseAscending(data);
                prepareEnrollment();
                checkEnrollDialogActions();
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function sortCourseAscending(data) {
    data.sort(function (a, b) {
        return a.courseName.localeCompare(b.courseName);
    });
    renderCourses(data);
}

function renderCourses(data) {
    var tr;
    for (var i = 0; i < data.length; i++) {
        tr = $('<tr/>');
        tr.append("<td>" + data[i].courseName + "</td>");
        tr.append("<td>" + data[i].category + "</td>");
        tr.append("<td>" + data[i].professor + "</td>");
        tr.append("<td><button class=\"enroll\" value=" + data[i].courseCode + " ><img src=\"/resources/images/rsz_1alta-empresa.png\"></button></td>");
        $('#tbody').append(tr);
    }
    $('#allCourses').show();
    pagination();
}

function pagination() {
    var req_num_row = 5;
    var $tr = $('tbody tr');
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
        $('#pagination').append(" <a href=" + i + ">" + i + "</a> ");
    }
    $tr.each(function (i) {
        jQuery(this).hide();
        if (i + 1 <= req_num_row) {
            $tr.eq(i).show();
        }

    });
    $('#pagination').find('a').click(function (e) {
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

function prepareEnrollment() {
    var tbody = $("#tbody");
    var enrollButtons = $(tbody).find("button[class=enroll]");

    for (var i = 0; i < enrollButtons.length; i++) {
        $(enrollButtons[i]).on("click", openEnrollmentDialog);
    }
}

function openEnrollmentDialog() {
    $(".cover").fadeIn('slow');
    $("#enrollDialog").fadeIn('slow');
    $("#enroll").attr('data-courseCode', $(this).attr('value'));
}

function sendEnrollAjax(courseCode) {
    var message = $('#message');
    $.ajax({
        url: "/enroll/"+courseCode,
        type: 'POST',
        traditional: true,
        success: function (data) {
            $(".cover").fadeOut('slow');
            $("#enrollDialog").fadeOut('slow');
            if(data === "Enrollment successful!") {
                message.text(data);
                message.css('font-size', '200%');
                message.css('color', 'green');
                message.fadeIn('slow');
                message.fadeOut('slow');
            } else {
                message.text("You're already enrolled at that course!");
                message.css('font-size', '200%');
                message.css('color', 'red');
                message.fadeIn('slow');
                message.fadeOut('slow');
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function checkEnrollDialogActions() {
    $("#enrollDialog").on('click', function () {
        if ($(event.target).is(".close") || $(event.target).is(".cancel")) {
            $(".cover").fadeOut('slow');
            $("#enrollDialog").fadeOut('slow');
        } else if ($(event.target).is("#enroll")) {
            var enrollButton = $("#enroll");
            var courseCode = enrollButton.attr('data-courseCode');
            sendEnrollAjax(courseCode);
        }
    });
}

