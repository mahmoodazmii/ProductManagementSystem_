$(document).ready(function () {

    LoadPriority();

    $("#btnSave").click(function () {
        SavePriority();
    });

    $("#btnReset").click(function () {
        ResetForm();
    });

});

function SavePriority() {

    var priority = {

        PriorityId: $("#PriorityId").val(),
        PriorityName: $("#PriorityName").val().trim(),
        PriorityCode: $("#PriorityCode").val().trim(),
        Description: $("#Description").val().trim()

    };

    if (priority.PriorityName == "") {
        alert("Please enter Priority Name.");
        $("#PriorityName").focus();
        return;
    }

    if (priority.PriorityCode == "") {
        alert("Please enter Priority Code.");
        $("#PriorityCode").focus();
        return;
    }

    $.ajax({

        url: "/Priority/SavePriority",

        type: "POST",

        data: priority,

        success: function (response) {

            if (response.success) {

                alert(response.message);

                ResetForm();

                LoadPriority();

            }
            else {

                alert(response.message);

            }

        },

        error: function () {

            alert("Something went wrong.");

        }

    });

}

function LoadPriority() {

    $.ajax({

        url: "/Priority/GetPriority",

        type: "GET",

        dataType: "json",

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            if ($.fn.DataTable.isDataTable("#tblPriority")) {

                $("#tblPriority").DataTable().clear().destroy();

            }

            var html = "";

            $.each(response.data, function (i, item) {

                html += "<tr>";

                html += "<td>" + (i + 1) + "</td>";

                html += "<td>" + item.PriorityName + "</td>";

                html += "<td>" + item.PriorityCode + "</td>";

                html += "<td>" + (item.Description == null ? "" : item.Description) + "</td>";

                html += "<td class='text-center'>";

                html += "<button type='button' class='btn btn-info btn-sm action-btn' title='View' onclick='ViewPriority(" + item.PriorityId + ")'><i class='fa fa-eye'></i></button>";

                html += "<button type='button' class='btn btn-primary btn-sm action-btn' title='Edit' onclick='EditPriority(" + item.PriorityId + ")'><i class='fa fa-edit'></i></button>";

                html += "<button type='button' class='btn btn-danger btn-sm' title='Delete' onclick='DeletePriority(" + item.PriorityId + ")'><i class='fa fa-trash'></i></button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblPriority tbody").html(html);

            $("#tblPriority").DataTable({
                paging: false,
                searching: false,
                info: false,
                ordering: false,
                lengthChange: false,
                autoWidth: false
            });

        },

        error: function () {

            alert("Unable to load data.");

        }

    });

}

function EditPriority(id) {

    $.ajax({

        url: "/Priority/EditPriority",

        type: "GET",

        data: { id: id },

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            $("#PriorityId").val(response.data.PriorityId);
            $("#PriorityName").val(response.data.PriorityName);
            $("#PriorityCode").val(response.data.PriorityCode);
            $("#Description").val(response.data.Description);

            $("#PriorityName").prop("readonly", false);
            $("#PriorityCode").prop("readonly", false);
            $("#Description").prop("readonly", false);

            $("#btnSave").show();

        }

    });

}

function ViewPriority(id) {

    $.ajax({

        url: "/Priority/EditPriority",

        type: "GET",

        data: { id: id },

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            $("#PriorityId").val(response.data.PriorityId);
            $("#PriorityName").val(response.data.PriorityName);
            $("#PriorityCode").val(response.data.PriorityCode);
            $("#Description").val(response.data.Description);

            $("#PriorityName").prop("readonly", true);
            $("#PriorityCode").prop("readonly", true);
            $("#Description").prop("readonly", true);

            $("#btnSave").hide();

        }

    });

}

function DeletePriority(id) {

    if (!confirm("Are you sure you want to delete this Priority?"))
        return;

    $.ajax({

        url: "/Priority/DeletePriority",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadPriority();

                ResetForm();

            }

        }

    });

}

function ResetForm() {

    $("#PriorityId").val(0);

    $("#PriorityName").val("");

    $("#PriorityCode").val("");

    $("#Description").val("");

    $("#PriorityName").prop("readonly", false);
    $("#PriorityCode").prop("readonly", false);
    $("#Description").prop("readonly", false);

    $("#btnSave").show();

}