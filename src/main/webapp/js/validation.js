var Validation = Validation || {};

$(document).ready(function () {
    Validation.getAllCourses();
});

Validation.getAllCourses = function getAllCourses() {
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
                Utils.sortCourseAscending(data);
                Validation.renderCourses(data);
                Validation.prepareDisplayEnrolledStudents();
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
};

Validation.renderCourses = function renderCourses(data) {
    var tbodyCourses = $('#tbodyCourses');
    var paginationCourses = $('#paginationCourses');
    var tr;
    for (var i = 0; i < data.length; i++) {
        tr = $('<tr/>');
        tr.append("<td><span data-courseCode=" + data[i].courseCode + " class=\"courseNameClass\">" + data[i].courseName + "</span></td>");
        tr.append("<td>" + data[i].category + "</td>");
        tr.append("<td>" + data[i].professor + "</td>");
        $(tbodyCourses).append(tr);
    }
    $('#allCourses').show();
    Utils.pagination(tbodyCourses, paginationCourses);
};

Validation.prepareDisplayEnrolledStudents = function prepareDisplayValidation() {
    var spansCourseName = $('#grid').find("span[class=courseNameClass]");

    for (var i = 0; i < spansCourseName.length; i++) {
        $(spansCourseName[i]).on("click", Validation.getEnrolledStudents);
    }
};

Validation.getEnrolledStudents = function getEnrolledStudents() {
    $('#tbodyValidation').empty();
    $('#paginationValidation').empty();
    $('#options').val("Choose An Option");
    Validation.hideValidationButtons();

    var courseCode = $(this).attr('data-courseCode');
    $('#courseTitle').text($(this).text());
    $('#validation').attr('data-courseCode', courseCode);

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
            Validation.renderStudents(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
};

Validation.renderStudents = function renderStudents(data) {
    var tbodyValidation = $('#tbodyValidation');
    var paginationValidation = $('#paginationValidation');
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
        tr.append("<td><input type=\"checkbox\" class=\"checkBoxes\"></td>");
        tr.append("<td>" + data[i].lastName + "</td>");
        tr.append("<td>" + data[i].firstName + "</td>");
        tr.append("<td>" + mark + "</td>");
        if (validated) {
            tr.append("<td><img src=\"/resources/images/rsz_agt_action_success_256.png\" </td>");
        } else {
            tr.append("<td><img src=\"/resources/images/rsz_s43qy.png\" </td>");
        }
        tbodyValidation.append(tr);

    }
    $('#validation').show();
    Utils.pagination(tbodyValidation, paginationValidation);
};

Validation.executeOption = function executeOption() {
    var tbodyValidation = $('#tbodyValidation');
    var option = $('#options').val();
    var allCheckBoxes = tbodyValidation.find("input[type=checkbox]");
    var index;
    var mark;
    var isSomethingChecked;
    var numberOfChecked = 0;

    if (option !== "Choose An Option") {
        switch (option) {
            case "Select All":
                for (index = 0; index < allCheckBoxes.length; index++) {
                    allCheckBoxes[index].checked = true;
                }
                Validation.showValidationButtons();
                break;
            case "Deselect All":
                for (index = 0; index < allCheckBoxes.length; index++) {
                    allCheckBoxes[index].checked = false;
                }
                Validation.hideValidationButtons();
                break;
            case "Select Only No Grade":
                for (index = 0; index < allCheckBoxes.length; index++) {
                     mark = $(allCheckBoxes[index]).parent().parent().children(':nth-child(4)').text();
                    if (mark === 'No Grade') {
                        allCheckBoxes[index].checked = true;
                        numberOfChecked++;
                        isSomethingChecked = true;
                    } else {
                        allCheckBoxes[index].checked = false;
                    }
                }
                if(isSomethingChecked && numberOfChecked <= allCheckBoxes.length) {
                    Validation.showValidationButtons();
                } else {
                    Validation.hideValidationButtons();
                }
                break;
            case "Select Only Grades":
                for (index = 0; index < allCheckBoxes.length; index++) {
                     mark = $(allCheckBoxes[index]).parent().parent().children(':nth-child(4)').text();
                    if (mark !== 'No Grade') {
                        allCheckBoxes[index].checked = true;
                        numberOfChecked++;
                        isSomethingChecked = true;
                    } else {
                        allCheckBoxes[index].checked = false;
                    }
                }
                if(isSomethingChecked && numberOfChecked <= allCheckBoxes.length) {
                    Validation.showValidationButtons();
                } else {
                    Validation.hideValidationButtons();
                }
                break;
            case "Select Validated Grades":
                console.log("You have chosen \"Select Validated Grades\" option!");
                break;
            default:
                console.log("You have chosen \"Select Invalidated Grades\" option!");
                break;
        }
    }
};

Validation.showValidationButtons = function showValidationButtons() {
    var validateButton = $('#validateBtn');
    var invalidateButton = $('#invalidateBtn');

    validateButton.show();
    invalidateButton.show();
};

Validation.hideValidationButtons = function hideValidationButtons() {
    var validateButton = $('#validateBtn');
    var invalidateButton = $('#invalidateBtn');

    validateButton.hide();
    invalidateButton.hide();
};





