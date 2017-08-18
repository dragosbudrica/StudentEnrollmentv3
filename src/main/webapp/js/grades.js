var Grades = Grades || {};

$(document).ready(function () {
    Grades.getCoursesWithStudents();
});

Grades.getCoursesWithStudents = function getCoursesWithStudents() {
    var warning = $("#warning");
    $.ajax({
        url: '/getCoursesWithEnrolledStudents',
        type: 'GET',
        dataType: 'json',
        traditional: true,
        success: function (data) {
            if (data.length === 0) {
                $(warning).find('h1').text("You have't added any course yet!");
                warning.show();
            } else {
                Utils.sortCourseAscending(data);
                Grades.renderCourses(data);
                Grades.prepareDisplayCourseStudents();
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
};

Grades.renderCourses = function renderCourses(data) {
    var tbodyCourses = $('#myCoursesBody');
    var paginationCourses = $('#paginationCourses');
    var tr;
    for (var i = 0; i < data.length; i++) {
        tr = $('<tr/>');
        tr.append("<td><span data-courseCode=" + data[i].courseCode + " class=\"courseName\">" + data[i].courseName + "</span></td>");
        tr.append("<td>" + data[i].category + "</td>");
        tr.append("<td>" + data[i].numberOfEnrolledStudents + " enrolled student(s)</td>");
        tbodyCourses.append(tr);
    }
    $('#myCourses').show();
    Utils.pagination(tbodyCourses, paginationCourses);
};

Grades.prepareDisplayCourseStudents = function prepareDisplayCourseStudents() {
    var spansCourseName = $('#coursesGrid').find("span[class=courseName]");

    for (var i = 0; i < spansCourseName.length; i++) {
        $(spansCourseName[i]).on("click", Grades.getEnrolledStudents);
    }
};

Grades.getEnrolledStudents = function getEnrolledStudents() {
    $('#tbodyGrades').empty();
    $('#paginationGrades').empty();

    var courseCode = $(this).attr('data-courseCode');
    $('#courseTitle').text($(this).text());
    $('#grades').attr('data-courseCode', courseCode);

    var jsonParam = JSON.stringify({
        'courseCode': courseCode
    });
    $.ajax({
        url: "/getEnrolledStudents",
        type: 'POST',
        data: jsonParam,
        contentType: "application/json",
        success: function (data) {
            Utils.sortStudentsAscending(data);
            Grades.renderStudents(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
};

Grades.renderStudents = function renderStudents(data) {
    var tbodyGrades = $('#tbodyGrades');
    var paginationGrades = $('#paginationGrades');
    var tr;
    var mark;
    var validated;
    for (var i = 0; i < data.length; i++) {
        tr = $('<tr/>');
        mark = data[i].mark;
        validated = data[i].validated;
        if (mark === 0) {
            mark = noGrade;
        }
        tr.append("<td>" + (i + 1) + "</td>");
        tr.append("<td>" + data[i].lastName + "</td>");
        tr.append("<td>" + data[i].firstName + "</td>");
        tr.append("<td><span>" + mark + "</span><select class=\"mark\" name=\"mark\"></select></td>");
        if (!validated) {
            tr.append("<td><button class=\"editMark saveMark\" data-userId="+ data[i].userId +" ><img src=\"/resources/images/rsz_rsz_edit-pencil-_write_-128.png\"></button></td>");
            tr.append("<td><button class=\"remove cancelEditing\" data-userId="+ data[i].userId +"><img src=\"/resources/images/rsz_rsz_61848.png\"></button></td>");
        }
        tbodyGrades.append(tr);

    }
    $('#grades').show();
    Utils.pagination(tbodyGrades, paginationGrades);
    Grades.prepareEditing();
    Grades.prepareRemoval();
    Grades.checkRemoveDialogActions();
};

Grades.prepareEditing = function prepareEditing() {
    var tbody = $("#tbodyGrades");
    var editButtons = $(tbody).find("button[class^=editMark]");

    for (var i = 0; i < editButtons.length; i++) {
        $(editButtons[i]).on("click", Grades.editMark);
    }
};

Grades.editMark = function editMark() {
    // add edit class on mark td
    if ($(this).hasClass('editMark')) {
        Grades.fillDropdownWithMarks(this);
    }
    else {
        Grades.updateMark(this);
    }
};

Grades.updateMark = function updateMark(saveButton) {
    // set span based on option value
    var markDropDown = $(saveButton).parent().parent().children(':nth-child(4)').find('select');
    var spanMarkToEdit = $(markDropDown).prev();
    $(spanMarkToEdit).text($(markDropDown).val());

    $(saveButton).parent().parent().children(":nth-child(4)").removeClass("edit");

    Grades.toggleClassesAndIconsBackToNormal(saveButton);
    Grades.enableTheOtherButtons();
    Grades.sendEditingAjax(saveButton);
};

Grades.fillDropdownWithMarks = function fillDropdownWithMarks(editButton) {
    var dropDown = $(editButton).parent().parent().children(":nth-child(4)");
    for (index = 1; index <= 10; ++index) {
        var mark = "<option value=" + index + ">" + index + "</option>";
        $(mark).appendTo('.mark');
    }
    $(dropDown).addClass("edit");
    var select = $(dropDown).find("select");
    select.focus();

    Grades.toggleClassesAndIcons(editButton);
};

Grades.toggleClassesAndIcons = function toggleClassesAndIcons(button) {
    // toggle classes
    var removeCancelButton = $(button).parent().next().children(":first-child");
    $(button).toggleClass('editMark');
    removeCancelButton.toggleClass('remove');

    // change icons
    $(button).children(":first-child").attr("src", "/resources/images/rsz_artboard_73-128.png");
    removeCancelButton.find("img").attr("src", "/resources/images/rsz_no-128.png");

    Grades.disableTheOtherButtons();
};

Grades.disableTheOtherButtons = function disableTheOtherButtons() {
    // disable the other buttons
    var tBodyGrades = $('#tbodyGrades');
    var otherEditButtons = tBodyGrades.find("button[class^=editMark]");
    var otherRemoveButtons = tBodyGrades.find("button[class^=remove]");

    for (var i = 0; i < otherEditButtons.length; i++) {
        otherEditButtons[i].setAttribute("disabled", true);
        otherRemoveButtons[i].setAttribute("disabled", true);
    }
};

Grades.toggleClassesAndIconsBackToNormal = function toggleClassesAndIconsBackToNormal(button) {
    // toggle classes
    var editSaveButton, removeCancelButton;
    if ($(button).parent().next('td').length === 0) {
        editSaveButton = $(button).parent().prev().children(":first-child");
        $(button).removeClass('cancelEditing').addClass('remove cancelEditing');
        editSaveButton.removeClass('saveMark').addClass('editMark saveMark');

        // change icons
        $(button).children(":first-child").attr("src", "/resources/images/rsz_rsz_61848.png");
        editSaveButton.find("img").attr("src", "/resources/images/rsz_rsz_edit-pencil-_write_-128.png");
    } else {
        removeCancelButton = $(button).parent().next().children(":first-child");
        $(button).removeClass('saveMark').addClass('editMark saveMark');
        removeCancelButton.removeClass('cancelEditing').addClass('remove cancelEditing');

        // change icons
        $(button).children(":first-child").attr("src", "/resources/images/rsz_rsz_edit-pencil-_write_-128.png");
        removeCancelButton.find("img").attr("src", "/resources/images/rsz_rsz_61848.png");
    }
};

Grades.enableTheOtherButtons = function enableTheOtherButtons() {
    // enable the other buttons
    var theGrid = $('#gradesGrid');
    var otherButtons = theGrid.find("button[disabled=true]");
    for (var i = 0; i < otherButtons.length; i++) {
        $(otherButtons[i]).removeAttr("disabled");
    }
};

Grades.sendEditingAjax = function sendEditingAjax(saveButton) {
    var spanMark = $(saveButton).parent().parent().children(':nth-child(4)').find('span');
    var jsonParams = JSON.stringify({
        'courseCode': $('#grades').attr('data-courseCode'),
        'userId': $(saveButton).attr('data-userId'),
        'mark': $(spanMark).text()
    });

    // empty the list
    $('.mark').empty();

    // send request
    $.ajax({
        url: '/editMark',
        type: 'PUT',
        data: jsonParams,
        contentType: 'application/json',
        traditional: true,
        success: function (data) {
            console.log("Success editing");
        },
        error: function (data) {
        }
    });
};

Grades.cancelEditing = function cancelEditing(cancelButton) {
    // remove edit class from td course name
    $('#tbodyGrades').find('td[class=edit]').removeClass('edit');

    Grades.toggleClassesAndIconsBackToNormal(cancelButton);
    Grades.enableTheOtherButtons();

    // empty the list
    $('.mark').empty();
};

Grades.prepareRemoval = function prepareRemoval() {
    var tbody = $("#tbodyGrades");
    var removeButtons = $(tbody).find("button[class^=remove]");

    for (var i = 0; i < removeButtons.length; i++) {
        $(removeButtons[i]).on("click", Grades.removeMark);
    }
};

Grades.removeMark = function removeMark() {
    var removeButton = $("#remove");
    // remove mark
    if ($(this).hasClass('remove')) {
        $(".cover").fadeIn('slow');
        $("#removeDialog").fadeIn('slow');
        $(removeButton).attr('data-userId', $(this).attr('data-userId'));
        $(removeButton).attr('data-courseCode', $('#grades').attr('data-courseCode'));
    } else {
        Grades.cancelEditing(this);
    }
};

Grades.checkRemoveDialogActions = function checkRemoveDialogActions() {
    $("#removeDialog").on('click', function () {
        if ($(event.target).is(".close") || $(event.target).is(".cancel")) {
            $(".cover").fadeOut('slow');
            $("#deleteDialog").fadeOut('slow');
        } else if ($(event.target).is("#remove")) {
            var removeButton = $("#remove");
            var courseCode = removeButton.attr('data-courseCode');
            var userId = removeButton.attr('data-userId');

            Grades.sendRemovalAjax(courseCode, userId);
        }
    });
};

Grades.sendRemovalAjax = function sendRemovalAjax(courseCode, userId) {
    var jsonParams = JSON.stringify({
        'courseCode': courseCode,
        'userId': userId
    });

    $.ajax({
        url: '/removeMark',
        type: 'DELETE',
        data: jsonParams,
        contentType: 'application/json',
        traditional: true,
        success: function (data) {
           var mark = $('#tbodyGrades').find("button[data-userId="+userId+"]").parent().parent().children(':nth-child(4)').find('span');
           $(mark).text(noGrade);
            $(".cover").fadeOut('slow');
            $("#removeDialog").fadeOut('slow');
        },
        error: function (data) {
            $(".cover").fadeOut('slow');
            $("#removeDialog").fadeOut('slow');
        }
    });
};



