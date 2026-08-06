$(document).ready(function () {

    LoadCountries();

    LoadCities();

    $("#CountryId").change(function () {

        LoadStates($(this).val());

    });

    $("#btnSave").click(function () {

        SaveCity();

    });

    $("#btnReset").click(function () {

        ResetForm();

    });

});

function LoadCountries() {

    $.ajax({

        url: "/City/GetCountries",

        type: "GET",

        success: function (data) {

            $("#CountryId").empty();

            $("#CountryId").append('<option value="">--Select Country--</option>');

            $.each(data, function (i, item) {

                $("#CountryId").append('<option value="' + item.CountryId + '">' + item.CountryName + '</option>');

            });

        }

    });

}

function LoadStates(countryId, selectedStateId) {

    $("#StateId").empty();

    $("#StateId").append('<option value="">--Select State--</option>');

    if (countryId == "")
        return;

    $.ajax({

        url: "/City/GetStates",

        type: "GET",

        data: { countryId: countryId },

        success: function (data) {

            $.each(data, function (i, item) {

                $("#StateId").append('<option value="' + item.StateId + '">' + item.StateName + '</option>');

            });

            if (selectedStateId != undefined) {

                $("#StateId").val(selectedStateId);

            }

        }

    });

}

function LoadCities() {

    $.ajax({

        url: "/City/GetCities",

        type: "GET",

        success: function (data) {

            if ($.fn.DataTable.isDataTable("#tblCity")) {

                $("#tblCity").DataTable().destroy();

            }

            $("#tblCity tbody").empty();

            $.each(data, function (i, item) {

                $("#tblCity tbody").append(

                    "<tr>" +

                    "<td class='text-center'>" + item.CityId + "</td>" +

                    "<td>" + item.CountryName + "</td>" +

                    "<td>" + item.StateName + "</td>" +

                    "<td>" + item.CityName + "</td>" +

                    "<td class='text-center'>" + item.Status + "</td>" +

                    "<td class='text-center'><button class='btn btn-primary btn-sm' onclick='EditCity(" + item.CityId + ")'><i class='fa fa-edit'></i></button></td>" +

                    "<td class='text-center'><button class='btn btn-danger btn-sm' onclick='DeleteCity(" + item.CityId + ")'><i class='fa fa-trash'></i></button></td>" +

                    "</tr>"

                );

            });

            $("#tblCity").DataTable({

                destroy: true,

                paging: false,

                searching: false,

                info: false,

                lengthChange: false,

                ordering: false,

                autoWidth: false,

                language: {

                    emptyTable: "No City Found"

                }

            });

        }

    });

}

function SaveCity() {

    if ($("#CountryId").val() == "") {

        alert("Select Country");

        return;

    }

    if ($("#StateId").val() == "") {

        alert("Select State");

        return;

    }

    if ($("#CityName").val() == "") {

        alert("Enter City Name");

        return;

    }

    var model = {

        CityId: $("#CityId").val(),

        StateId: $("#StateId").val(),

        CityName: $("#CityName").val(),

        Status: $("#Status").val() == "A"

    };

    $.ajax({

        url: "/City/SaveCity",

        type: "POST",

        data: model,

        success: function (response) {

            alert(response.message);

            if (response.success) {

                ResetForm();

                LoadCities();

            }

        }

    });

}

function EditCity(id) {

    $.ajax({

        url: "/City/EditCity",

        type: "GET",

        data: { id: id },

        success: function (data) {

            $("#CityId").val(data.CityId);

            $("#CountryId").val(data.CountryId);

            LoadStates(data.CountryId, data.StateId);

            $("#CityName").val(data.CityName);

            $("#Status").prop("checked", data.Status);

        }

    });

}

function DeleteCity(id) {

    if (!confirm("Are you sure you want to delete?"))
        return;

    $.ajax({

        url: "/City/DeleteCity",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadCities();

            }

        }

    });

}

function ResetForm() {

    $("#CityId").val(0);

    $("#CountryId").val("");

    $("#StateId").html('<option value="">--Select State--</option>');

    $("#CityName").val("");

    $("#Status").prop("checked", true);

}