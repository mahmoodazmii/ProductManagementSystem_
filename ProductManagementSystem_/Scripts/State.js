$(document).ready(function () {

    LoadCountries();

    LoadStates();

    $("#btnSave").click(function () {
        SaveState();
    });

    $("#btnReset").click(function () {
        ResetForm();
    });

});

function LoadCountries() {

    $.ajax({

        url: "/State/GetCountries",
        type: "GET",

        success: function (data) {

            $("#CountryId").empty();

            $("#CountryId").append('<option value="">-- Select Country --</option>');

            $.each(data, function (i, item) {

                $("#CountryId").append(
                    '<option value="' + item.CountryId + '">' +
                    item.CountryName +
                    '</option>'
                );

            });

        }

    });

}

function LoadStates() {

    $.ajax({

        url: "/State/GetStates",
        type: "GET",

        success: function (data) {

            if ($.fn.DataTable.isDataTable("#tblState")) {
                $("#tblState").DataTable().destroy();
            }

            $("#tblState tbody").empty();

            $.each(data, function (i, item) {

                $("#tblState tbody").append(

                    "<tr>" +

                    "<td class='text-center'>" + item.StateId + "</td>" +

                    "<td>" + item.CountryName + "</td>" +

                    "<td>" + item.StateName + "</td>" +

                    "<td class='text-center'>" + item.Status + "</td>" +

                    "<td class='text-center'>" +

                    "<button class='btn btn-primary btn-sm' onclick='EditState(" + item.StateId + ")'>" +

                    "<i class='fa fa-edit'></i>" +

                    "</button>" +

                    "</td>" +

                    "<td class='text-center'>" +

                    "<button class='btn btn-danger btn-sm' onclick='DeleteState(" + item.StateId + ")'>" +

                    "<i class='fa fa-trash'></i>" +

                    "</button>" +

                    "</td>" +

                    "</tr>"

                );

            });

            $("#tblState").DataTable({

                destroy: true,

                paging: false,

                searching: false,

                info: false,

                lengthChange: false,

                ordering: false,

                autoWidth: false,

                language: {

                    emptyTable: "No State Found"

                }

            });

        }

    });

}

function SaveState() {

    if ($("#CountryId").val() == "") {

        alert("Please Select Country");

        $("#CountryId").focus();

        return;

    }

    if ($("#StateName").val() == "") {

        alert("Please Enter State Name");

        $("#StateName").focus();

        return;

    }

    var model = {

        StateId: $("#StateId").val(),

        CountryId: $("#CountryId").val(),

        StateName: $("#StateName").val(),

        Status: $("#Status").val() == "A"
    };

    $.ajax({

        url: "/State/SaveState",

        type: "POST",

        data: model,

        success: function (response) {

            alert(response.message);

            if (response.success) {

                ResetForm();

                LoadStates();

            }

        }

    });

}

function EditState(id) {

    $.ajax({

        url: "/State/EditState",

        type: "GET",

        data: { id: id },

        success: function (data) {

            $("#StateId").val(data.StateId);

            $("#CountryId").val(data.CountryId);

            $("#StateName").val(data.StateName);

            $("#Status").prop("checked", data.Status);

        }

    });

}

function DeleteState(id) {

    if (!confirm("Are you sure you want to delete?"))
        return;

    $.ajax({

        url: "/State/DeleteState",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadStates();

            }

        }

    });

}

function ResetForm() {

    $("#StateId").val(0);

    $("#CountryId").val("");

    $("#StateName").val("");

    $("#Status").prop("checked", true);

}