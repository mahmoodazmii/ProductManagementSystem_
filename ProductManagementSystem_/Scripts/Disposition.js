$(document).ready(function () {

    LoadDisposition();

    $("#btnSave").click(function () {
        SaveDisposition();
    });

    $("#btnReset").click(function () {
        ResetForm();
    });

});

function SaveDisposition() {

    var model = {

        DispositionId: $("#DispositionId").val(),
        DispositionName: $("#DispositionName").val().trim(),
        ShortCode: $("#ShortCode").val().trim(),
        SortOrder: $("#SortOrder").val() == "" ? 0 : $("#SortOrder").val(),
        DateRequired: $("#DateRequired").val()

    };

    if (model.DispositionName == "") {

        alert("Please Enter Disposition.");
        $("#DispositionName").focus();
        return;

    }

    if (model.ShortCode == "") {

        alert("Please Enter Short Code.");
        $("#ShortCode").focus();
        return;

    }

    if (model.DateRequired == "") {

        alert("Please Select Date Required.");
        $("#DateRequired").focus();
        return;

    }

    $.ajax({

        url: "/Disposition/SaveDisposition",
        type: "POST",
        data: model,

        success: function (response) {

            if (response.success) {

                alert(response.message);

                ResetForm();

                LoadDisposition();

            }
            else {

                alert(response.message);

            }

        },

        error: function (xhr) {

            alert(xhr.responseText);

        }

    });

}

function LoadDisposition() {

    $.ajax({

        url: "/Disposition/GetDisposition",

        type: "GET",

        dataType: "json",

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            if ($.fn.DataTable.isDataTable("#tblDisposition")) {

                $("#tblDisposition").DataTable().clear().destroy();

            }

            var html = "";

            $.each(response.data, function (i, item) {

                html += "<tr>";

                html += "<td>" + (i + 1) + "</td>";

                html += "<td>" + item.DispositionName + "</td>";

                html += "<td>" + item.ShortCode + "</td>";

                html += "<td>" + item.SortOrder + "</td>";

                html += "<td>" + item.DateRequired + "</td>";

                html += "<td>";

                html += "<button type='button' class='btn btn-info btn-sm action-btn' title='View' onclick='ViewDisposition(" + item.DispositionId + ")'><i class='fa fa-eye'></i></button>";

                html += "<button type='button' class='btn btn-primary btn-sm action-btn' title='Edit' onclick='EditDisposition(" + item.DispositionId + ")'><i class='fa fa-edit'></i></button>";

                html += "<button type='button' class='btn btn-danger btn-sm action-btn' title='Delete' onclick='DeleteDisposition(" + item.DispositionId + ")'><i class='fa fa-trash'></i></button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblDisposition tbody").html(html);

            $("#tblDisposition").DataTable({

                destroy: true,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                lengthChange: false,
                autoWidth: false,
                scrollX: true

            });

        },

        error: function (xhr) {

            alert(xhr.responseText);

        }

    });

}

function ViewDisposition(id) {

    $.ajax({

        url: "/Disposition/EditDisposition",

        type: "GET",

        data: { id: id },

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            $("#DispositionId").val(response.data.DispositionId);

            $("#DispositionName").val(response.data.DispositionName);

            $("#ShortCode").val(response.data.ShortCode);

            $("#SortOrder").val(response.data.SortOrder);

            $("#DateRequired").val(response.data.DateRequired.toString());

            DisableForm();

        },

        error: function (xhr) {

            alert(xhr.responseText);

        }

    });

}

function EditDisposition(id) {

    $.ajax({

        url: "/Disposition/EditDisposition",

        type: "GET",

        data: { id: id },

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            $("#DispositionId").val(response.data.DispositionId);

            $("#DispositionName").val(response.data.DispositionName);

            $("#ShortCode").val(response.data.ShortCode);

            $("#SortOrder").val(response.data.SortOrder);

            $("#DateRequired").val(response.data.DateRequired.toString());

            EnableForm();

        },

        error: function (xhr) {

            alert(xhr.responseText);

        }

    });

}
function DeleteDisposition(id) {

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    $.ajax({

        url: "/Disposition/DeleteDisposition",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                ResetForm();

                LoadDisposition();

            }

        },

        error: function (xhr) {

            alert(xhr.responseText);

        }

    });

}


function ResetForm() {

    $("#DispositionId").val(0);

    $("#DispositionName").val("");

    $("#ShortCode").val("");

    $("#SortOrder").val("");

    $("#DateRequired").prop("selectedIndex", 0);

    EnableForm();

}


function DisableForm() {

    $("#DispositionName").prop("disabled", true);

    $("#ShortCode").prop("disabled", true);

    $("#SortOrder").prop("disabled", true);

    $("#DateRequired").prop("disabled", true);

    $("#btnSave").prop("disabled", true);

}


function EnableForm() {

    $("#DispositionName").prop("disabled", false);

    $("#ShortCode").prop("disabled", false);

    $("#SortOrder").prop("disabled", false);

    $("#DateRequired").prop("disabled", false);

    $("#btnSave").prop("disabled", false);

}