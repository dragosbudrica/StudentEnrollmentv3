$(document).ready(function () {
    getProfessorCourses();
});

/*COURSES*/
function getProfessorCourses() {
    var warning = $("#warning");
    $.ajax({
        url: '/getProfessorCourses',
        type: 'GET',
        dataType: 'json',
        traditional: true,
        success: function (data) {
            if(data.length === 0) {
                $(warning).find('h1').text("You have't added any course yet!");
                warning.show();
            } else {
                Enrollment.sortCourseAscending(data);
                renderCourses(data);
                addCourse();
                Enrollment.prepareDisplayCourseDetails();
                prepareEditing();
                prepareRemoval();
                checkDeleteDialogActions();
                checkAddDialogActions();
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
        tr.append("<td><span data-courseCode=" + data[i].courseCode + " class=\"courseNameClass\" style='cursor:pointer'>" + data[i].courseName +
            "</span><input class='courseName' value=" + data[i].courseName + "></td>");
        tr.append("<td><span>" + data[i].category + "</span><select class=\"category\" name=\"category\"></select></td>");
        tr.append("<td><button class=\"editCourse saveCourse\" value=" + data[i].courseCode + "><img src=\"/resources/images/rsz_rsz_edit-pencil-_write_-128.png\"></button></td>");
        tr.append("<td><button class=\"remove cancelEditing\" value=" + data[i].courseCode + " ><img src=\"/resources/images/rsz_rsz_61848.png\"></button></td>");
        $('#tbodyCourses').append(tr);
    }
    $('#professorCourses').show();
    Enrollment.pagination(tbodyCourses, paginationCourses);
}

function addCourse() {
    $('#addCourse').click(function () {
        $(".cover").fadeIn('slow');
        $("#addDialog").fadeIn('slow');
    });
}

function checkAddDialogActions() {
    $("#addDialog").on('click', function () {
        if ($(event.target).is(".close")) {
            $(".cover").fadeOut('slow');
            $("#addDialog").fadeOut('slow');
            window.location.reload();
        }
    });
}

function prepareEditing() {
    var tbody = $("#tbodyCourses");
    var editButtons = $(tbody).find("button[class^=editCourse]");

    for (var i = 0; i < editButtons.length; i++) {
        $(editButtons[i]).on("click", editCourse);
    }
}

function editCourse() {
    // add edit class on course name td
    if ($(this).hasClass('editCourse')) {
        getAllCategories(this);
    }
    else {
        updateCourse(this);
    }
}

function getAllCategories(editButton) {
    $.ajax({
        url: '/getAllCategories',
        type: 'GET',
        dataType: 'json',
        traditional: true,
        success: function (data) {
            console.log(data);
            for (index = 0; index < data.length; ++index) {
                var category = "<option value=" + data[index].categoryName + ">" + data[index].categoryName + "</option>";
                $(category).appendTo('.category');
            }
            $(editButton).parent().parent().children(":first-child").addClass("edit");
            $(editButton).parent().parent().children(":nth-child(2)").addClass("edit");
            var input = $(editButton).parent().parent().children(":first-child").find("input");
            input.focus();
            toggleClassesAndIcons(editButton);

        },
        error: function (data) {
            console.log(data);
        }
    });
}

function updateCourse(saveButton) {
    // set span based on input value
    var courseNameInput = $(saveButton).parent().parent().children(':first-child').find('input');
    var spanCourseNameToEdit = $(courseNameInput).prev();
    $(spanCourseNameToEdit).text($(courseNameInput).val());

    // set span based on option value
    var categoryDropDown = $(saveButton).parent().parent().children(':nth-child(2)').find('select');
    var spanCategoryToEdit = $(categoryDropDown).prev();
    $(spanCategoryToEdit).text($(categoryDropDown).val());

    // remove edit class from course name td
    $(saveButton).parent().parent().children(":first-child").removeClass("edit");
    $(saveButton).parent().parent().children(":nth-child(2)").removeClass("edit");

    toggleClassesAndIconsBackToNormal(saveButton);
    enableTheOtherButtons();
    sendEditingAjax(saveButton);
}

function toggleClassesAndIcons(button) {
    // toggle classes
    var removeCancelButton = $(button).parent().next().children(":first-child");
    $(button).toggleClass('editCourse');
    removeCancelButton.toggleClass('remove');

    // change icons
    $(button).children(":first-child").attr("src", "/resources/images/rsz_artboard_73-128.png");
    removeCancelButton.find("img").attr("src", "/resources/images/rsz_no-128.png");

    disableTheOtherButtons();
}

function disableTheOtherButtons() {
    // disable the other buttons
    var theGrid = $('#coursesGrid');
    var otherEditButtons = theGrid.find("button[class^=editCourse]");
    var otherRemoveButtons = theGrid.find("button[class^=remove]");
    for (var i = 0; i < otherEditButtons.length; i++) {
        otherEditButtons[i].setAttribute("disabled", true);
        otherRemoveButtons[i].setAttribute("disabled", true);
    }
}

function cancelEditing(cancelButton) {
    // remove edit class from td course name
    $('#tbodyCourses').find('td[class=edit]').removeClass('edit');

    toggleClassesAndIconsBackToNormal(cancelButton);
    enableTheOtherButtons();

    // empty the list
    $('.category').empty();
}

function toggleClassesAndIconsBackToNormal(button) {
    // toggle classes
    var editSaveButton, removeCancelButton;
    if ($(button).parent().next('td').length === 0) {
        editSaveButton = $(button).parent().prev().children(":first-child");
        $(button).removeClass('cancelEditing').addClass('remove cancelEditing');
        editSaveButton.removeClass('saveCourse').addClass('editCourse saveCourse');

        // change icons
        $(button).children(":first-child").attr("src", "/resources/images/rsz_rsz_61848.png");
        editSaveButton.find("img").attr("src", "/resources/images/rsz_rsz_edit-pencil-_write_-128.png");
    } else {
        removeCancelButton = $(button).parent().next().children(":first-child");
        $(button).removeClass('saveCourse').addClass('editCourse saveCourse');
        removeCancelButton.removeClass('cancelEditing').addClass('remove cancelEditing');

        // change icons
        $(button).children(":first-child").attr("src", "/resources/images/rsz_rsz_edit-pencil-_write_-128.png");
        removeCancelButton.find("img").attr("src", "/resources/images/rsz_rsz_61848.png");
    }
}

function enableTheOtherButtons() {
    // enable the other buttons
    var theGrid = $('#coursesGrid');
    var otherButtons = theGrid.find("button[disabled=true]");
    for (var i = 0; i < otherButtons.length; i++) {
        $(otherButtons[i]).removeAttr("disabled");
    }
}

function prepareRemoval() {
    var tbody = $("#tbodyCourses");
    var removeButtons = $(tbody).find("button[class^=remove]");

    for (var i = 0; i < removeButtons.length; i++) {
        $(removeButtons[i]).on("click", removeCourse);
    }
}

function removeCourse() {
    // remove course
    if ($(this).hasClass('remove')) {
        $(".cover").fadeIn('slow');
        $("#deleteDialog").fadeIn('slow');
        $("#delete").attr('data-courseCode', $(this).attr('value'));
    } else {
        cancelEditing(this);
    }
}

function sendEditingAjax(saveButton) {
    var spanCourseName = $(saveButton).parent().parent().children(':first-child').find('span');
    var spanCategory = $(saveButton).parent().parent().children(':nth-child(2)').find('span');
    var jsonParams = JSON.stringify({
        'courseCode': $(saveButton).attr('value'),
        'courseName': $(spanCourseName).text(),
        'category': $(spanCategory).text()
    });

    // empty the list
    $('.category').empty();

    // send request
    $.ajax({
        url: '/editCourse',
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
}

function checkDeleteDialogActions() {
    $("#deleteDialog").on('click', function () {
        if ($(event.target).is(".close") || $(event.target).is(".cancel")) {
            $(".cover").fadeOut('slow');
            $("#deleteDialog").fadeOut('slow');
        } else if ($(event.target).is("#delete")) {
            var deleteButton = $("#delete");
            var courseCode = deleteButton.attr('data-courseCode');
            sendRemovalAjax(courseCode);
        }
    });
}

function sendRemovalAjax(courseCode) {
    var jsonParam = JSON.stringify({
        'courseCode': courseCode
    });

    $.ajax({
        url: '/deleteCourse',
        type: 'DELETE',
        data: jsonParam,
        contentType: 'application/json',
        traditional: true,
        success: function (data) {
            var trToBeRemoved = $('#tbodyCourses').find("button[value=" + courseCode + "]").parent().parent();
            $(trToBeRemoved).remove();
            $(".cover").fadeOut('slow');
            $("#deleteDialog").fadeOut('slow');
        },
        error: function (data) {
            $(".cover").fadeOut('slow');
            $("#deleteDialog").fadeOut('slow');
        }
    });
}


/*LECTURES*/
function displayCourseDetailsProfessor(data, courseName, courseCode) {
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
            tr.append("<td><input value=\"Upload PDF\" data-lectureId="+item.lectureId+" data-courseCode="+courseCode+" name=\"file\" type=\"file\" onchange='displayUploadButton(this)'/><button type=\"button\" style=\"display: none\" value=\"Upload\">Upload</button></td>");
            $('#tbodyLectures').append(tr);
        } else if (item.attachment !== null) {
            tr.append("<td>" + item.name + "</td>");
            tr.append("<td><a style='float:left' href=\"/download/"+item.lectureId+"\"><img src=\"/resources/images/rsz_download-pdf.png\"/></a>&nbsp;&nbsp;&nbsp;<button data-lectureId="+item.lectureId+" data-courseCode="+courseCode+" style=\"float:right\" onclick='removeAttachment(this)' type=\"button\" value=\"Upload\"><img src=\"/resources/images/rsz_rsz_2delete-2-xxl.png\"/></button></td>");
            tbodyLectures.append(tr);
        }
    }
    $("#courseDetails").show();
    Enrollment.pagination(tbodyLectures, paginationLectures);
}

function displayUploadButton(input) {
    var button = $(input).next();
    $(button).show();
    uploadFile(input, button);
}

function uploadFile(input, button) {
    $(button).on("click", function() {
        $('#result').html('');
        var lectureId = $(input).attr('data-lectureId');
        var courseCode = $(input).attr('data-courseCode');

        var formData = new FormData($('#fileForm'));
        formData.append('file', input.files[0]);
        $.ajax({
            url: "/upload/"+lectureId,
            type: 'POST',
            data: formData,
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false
        }).done(function (data) {
            var tbody = $("#tbodyCourses");
            var spanCourseName = tbody.find("span[data-courseCode="+courseCode+"]");
            $(spanCourseName).trigger("click");
        }).fail(function (jqXHR, textStatus) {
            console.log(textStatus);
        });
    })
}

function removeAttachment(removeAtt) {
    var lectureId = $(removeAtt).attr('data-lectureId');
    var courseCode = $(removeAtt).attr('data-courseCode');

    $.ajax({
        url: "/removeLectureAttachment/"+lectureId,
        type: 'DELETE',
        traditional: true,
        success: function (data) {
            var tbody = $("#tbodyCourses");
            var spanCourseName = tbody.find("span[data-courseCode="+courseCode+"]");
            $(spanCourseName).trigger("click");
        },
        error: function (data) {
           console.log(data);
        }
    });
}




















