$(document).ready(function () {

    LoadCountry();

    $("#btnSave").click(function () {
        SaveCountry();
    });

    $("#btnReset").click(function () {
        ResetForm();
    });

});


function LoadCountry() {

    $.ajax({

        url: "/Country/GetCountries",
        type: "GET",

        success: function (response) {

            if ($.fn.DataTable.isDataTable("#tblCountry")) {
                $("#tblCountry").DataTable().destroy();
            }

            $("#tblCountry tbody").empty();

            $.each(response, function (i, item) {

               var statusText = "";


                if (item.Status == "A" || item.Status == "Active" || item.Status == true) {

                    statusText = "Active";

                }
                else {

                    statusText = "Inactive";

                }

                $("#tblCountry tbody").append(

                    "<tr>" +
                    "<td class='text-center'>" +
                    item.CountryId +
                    "</td>" +

                    "<td>" +
                    item.CountryName +
                    "</td>" +
                    "<td class='text-center'>" +
                    statusText +
                    "</td>" +

                    "<td class='text-center'>" +

                    "<button class='btn btn-primary btn-sm' onclick='EditCountry("
                    + item.CountryId +
                    ")'>" +

                    "<i class='fa fa-edit'></i>" +

                    "</button>" +

                    "</td>" +

                    "<td class='text-center'>" +

                    "<button class='btn btn-danger btn-sm' onclick='DeleteCountry("
                    + item.CountryId +
                    ")'>" +

                    "<i class='fa fa-trash'></i>" +

                    "</button>" +

                    "</td>" +

                    "</tr>"

                );

            });

            $("#tblCountry").DataTable({

                destroy: true,

                paging: false,

                searching: false,

                info: false,

                lengthChange: false,

                ordering: false,

                autoWidth: false,

                language: {

                    emptyTable: "No Country Found"

                }
            });

        }

    });

}

function SaveCountry() {

    var model = {

        CountryId: $("#CountryId").val(),

        CountryName: $("#CountryName").val(),

        Status: $("#Status").val() == "A"

    };


    if ($.trim(model.CountryName) == "") {

        alert("Enter Country Name");
        $("#CountryName").focus();
        return;

    }


    $.ajax({

        url: "/Country/SaveCountry",

        type: "POST",

        data: model,

        success: function (response) {

            alert(response.message);

            if (response.success) {

                ResetForm();
                LoadCountry();

            }

        },

        error: function (xhr) {

            console.log(xhr.responseText);

        }

    });

}

function EditCountry(id) {

    $.ajax({

        url: "/Country/EditCountry",

        type: "GET",

        data: { id: id },

        success: function (data) {


            $("#CountryId").val(data.CountryId);

            $("#CountryName").val(data.CountryName);

            if (data.Status == "A" || data.Status == "Active" || data.Status == true) {

                $("#Status").val("A");

            }
            else {

                $("#Status").val("D");

            }
        }

    });

}

function DeleteCountry(id) {

    if (!confirm("Are you sure you want to delete?"))
        return;

    $.ajax({

        url: "/Country/DeleteCountry",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadCountry();

            }
        }

    });

}

function ResetForm() {

    $("#CountryId").val(0);

    $("#CountryName").val("");

    $("#Status").val("A");
}