$(document).ready(function () {

    LoadRegisterLead();
    LoadCategories();
    LoadCompanies();          // Company independent (page load par saari)
    LoadCountries();
    LoadDispositions();
    LoadPriorities();

    $("#DispositionId").change(function () {

        var disposition = $("#DispositionId option:selected").text().trim();

        $(".visitFields").hide();
        $(".fixedField").hide();

        $("#VisitDate").val("");
        $("#VisitTime").val("");
        $("#Fixed").val("");

        if (disposition == "Visit Fixed") {
            $(".visitFields").show();
            $(".fixedField").show();
        }
        else if (
            disposition == "Call Back" ||
            disposition == "Not Interested" ||
            disposition == "Closed Lost" ||
            disposition == ""
        ) {
            // kuch nahi
        }
        else {
            $(".visitFields").show();
            $(".fixedField").hide();
        }

    });

    $("#ClientType").trigger("change");

    // ❌ Category -> Company binding HATA DI GAYI HAI

    // ✅ Company -> Product binding
    $("#CompanyId").change(function () {
        GetProductsByCompany($(this).val());
    });

    $("#CountryId").change(function () {
        LoadStates($(this).val());
    });

    $("#StateId").change(function () {
        LoadCities($(this).val());
    });

    $("#CaseType").change(function () {
        var selectedType = $(this).val();
        if (selectedType == "Port") {
            $(".portFields").css("display", "block");
        }
        else {
            $(".portFields").css("display", "none");
            $("#ExistingCompany").val("");
            $("#PolicyNo").val("");
            $("#Amount").val("");
        }
    });
    $("#CaseType").trigger("change");

    $("#ClientType").change(function () {
        var type = $(this).val();
        if (type == "Individual") {
            $("#clientNameLabel").text("Name");
            $("#Name").attr("placeholder", "Enter Name");
        }
        else if (type == "Company") {
            $("#clientNameLabel").text("Company");
            $("#Name").attr("placeholder", "Enter Company Name");
        }
        else {
            $("#clientNameLabel").text("Name");
            $("#Name").attr("placeholder", "Enter Name");
        }
    });

    $("#btnSave").click(function (e) {
        e.preventDefault();
        SaveRegisterLead();
    });

    $("#btnReset").click(function (e) {
        e.preventDefault();
        ResetForm();
    });

    $("#ContactNo").keypress(function (e) {
        var key = e.which;
        if (key < 48 || key > 57) {
            e.preventDefault();
        }
    });

    $("#EmailId").blur(function () {
        var email = $.trim($(this).val());
        if (email !== "" && !ValidateEmail(email)) {
            alert("Please enter valid Email Address.");
            $(this).focus();
        }
    });

    $("#Remarks").on("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });

});

function ValidateEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function DisableSaveButton() {
    $("#btnSave")
        .prop("disabled", true)
        .html("<i class='fa fa-spinner fa-spin'></i> Saving...");
}

function EnableSaveButton() {
    var text = ($("#LeadId").val() == "0")
        ? "<i class='fa fa-save'></i> Save"
        : "<i class='fa fa-edit'></i> Update";

    $("#btnSave")
        .prop("disabled", false)
        .html(text);
}

$(document).on("keypress", "form", function (e) {
    if (e.which == 13) {
        e.preventDefault();
        return false;
    }
});

function LoadDispositions(selectedDispositionId) {

    $.ajax({
        url: "/RegisterLead/GetDispositions",
        type: "GET",
        dataType: "json",
        success: function (response) {

            $("#DispositionId").empty();
            $("#DispositionId").append('<option value="">-- Select Disposition --</option>');

            if (response.success) {

                $.each(response.data, function (i, item) {
                    $("#DispositionId").append(
                        $("<option></option>").val(item.DispositionId).text(item.DispositionName)
                    );
                });

                if (selectedDispositionId) {
                    $("#DispositionId").val(selectedDispositionId);
                }
            }
        }
    });
}

function LoadPriorities(selectedPriorityId) {

    $.ajax({
        url: "/RegisterLead/GetPriorities",
        type: "GET",
        dataType: "json",
        success: function (response) {

            $("#PriorityId").empty();
            $("#PriorityId").append('<option value="">-- Select Priority --</option>');

            if (response.success) {

                $.each(response.data, function (i, item) {
                    $("#PriorityId").append(
                        $("<option></option>").val(item.PriorityId).text(item.PriorityName)
                    );
                });

                if (selectedPriorityId) {
                    $("#PriorityId").val(selectedPriorityId);
                }
            }
        }
    });
}

function LoadCategories(selectedCategoryId) {
    $.ajax({
        url: "/RegisterLead/GetCategories",
        type: "GET",
        dataType: "json",
        success: function (response) {

            $("#CategoryId").empty().append('<option value="">-- Select Category --</option>');

            if (response.success) {
                $.each(response.data, function (i, item) {
                    $("#CategoryId").append(
                        $("<option></option>").val(item.CategoryId).text(item.CategoryName)
                    );
                });

                if (selectedCategoryId) {
                    $("#CategoryId").val(selectedCategoryId);
                }
            }
        }
    });
}

function LoadCompanies(selectedCompanyId, callback) {
    $.ajax({
        url: "/RegisterLead/GetCompanies",
        type: "GET",
        dataType: "json",
        success: function (response) {

            $("#CompanyId").empty().append('<option value="">-- Select Company --</option>');

            if (response.success) {
                $.each(response.data, function (i, item) {
                    $("#CompanyId").append(
                        $("<option></option>").val(item.CompanyId).text(item.CompanyName)
                    );
                });

                if (selectedCompanyId) {
                    $("#CompanyId").val(selectedCompanyId);
                }

                if (typeof callback === "function") {
                    callback();
                }
            }
        }
    });
}

function GetProductsByCompany(companyId, callback) {

    $("#ProductId").empty().append('<option value="">-- Select Product --</option>');

    if (companyId == "" || companyId == null) return;

    $.ajax({
        url: "/RegisterLead/GetProductsByCompany",
        type: "GET",
        dataType: "json",
        data: { companyId: companyId },
        success: function (response) {
            if (response.success) {
                $.each(response.data, function (i, item) {
                    $("#ProductId").append(
                        $("<option></option>").val(item.ProductId).text(item.ProductName)
                    );
                });

                if (typeof callback === "function") {
                    callback();
                }
            }
        }
    });
}

function SaveRegisterLead() {

    var fixedVal = ($("#Fixed").val() || "").trim();
    var visitDateVal = ($("#VisitDate").val() || "").trim();
    var visitTimeVal = ($("#VisitTime").val() || "").trim();

    var model = {
        LeadId: $("#LeadId").val(),
        LeadDate: $("#LeadDate").val(),
        CategoryId: $("#CategoryId").val(),
        CompanyId: $("#CompanyId").val(),
        ProductId: $("#ProductId").val(),
        DispositionId: $("#DispositionId").val(),
        PriorityId: $("#PriorityId").val(),
        Name: $.trim($("#Name").val()),
        ContactNo: $.trim($("#ContactNo").val()),
        EmailId: $.trim($("#EmailId").val()),
        Address: $.trim($("#Address").val()),
        CountryId: $("#CountryId").val(),
        StateId: $("#StateId").val(),
        CityId: $("#CityId").val(),
        Pincode: $("#Pincode").val(),
        Remarks: $("#Remarks").val(),
        CaseType: $("#CaseType").val(),
        ExistingCompany: $("#ExistingCompany").val(),
        PolicyNo: $("#PolicyNo").val(),
        Amount: $("#Amount").val(),
        ClientType: $("#ClientType").val(),
        Status: $("#Status").val(),

        VisitDate: visitDateVal === "" ? null : visitDateVal,
        VisitTime: visitTimeVal === "" ? null : visitTimeVal,
        Fixed: fixedVal === "" ? null : fixedVal
    };

    if (model.CategoryId == "") {
        alert("Please Select Category.");
        $("#CategoryId").focus();
        return;
    }

    if (model.CompanyId == "") {
        alert("Please Select Company.");
        $("#CompanyId").focus();
        return;
    }

    if (model.ProductId == "") {
        alert("Please Select Product.");
        $("#ProductId").focus();
        return;
    }

    if (model.CaseType == "") {
        alert("Please Select Case Type.");
        $("#CaseType").focus();
        return;
    }

    if (model.ClientType == "") {
        alert("Please Select Client Type.");
        $("#ClientType").focus();
        return;
    }

    if (model.CaseType == "Port") {
        if (model.ExistingCompany == "") {
            alert("Please Enter Existing Company.");
            $("#ExistingCompany").focus();
            return;
        }
        if (model.PolicyNo == "") {
            alert("Please Enter Policy No.");
            $("#PolicyNo").focus();
            return;
        }
        if (model.Amount == "") {
            alert("Please Enter Amount.");
            $("#Amount").focus();
            return;
        }
    }

    if (model.ClientType == "Individual") {
        if (model.Name == "") {
            alert("Please Enter Name.");
            $("#Name").focus();
            return;
        }
    }
    else if (model.ClientType == "Company") {
        if (model.Name == "") {
            alert("Please Enter Company Name.");
            $("#Name").focus();
            return;
        }
    }

    if (model.ContactNo == "") {
        alert("Please Enter Contact Number.");
        $("#ContactNo").focus();
        return;
    }

    if (model.CountryId == "") {
        alert("Please Select Country.");
        $("#CountryId").focus();
        return;
    }

    if (model.StateId == "") {
        alert("Please Select State.");
        $("#StateId").focus();
        return;
    }

    if (model.CityId == "") {
        alert("Please Select City.");
        $("#CityId").focus();
        return;
    }

    DisableSaveButton();

    $.ajax({
        url: "/RegisterLead/SaveRegisterLead",
        type: "POST",
        dataType: "json",
        data: model,
        success: function (response) {
            EnableSaveButton();
            if (response.success) {
                alert(response.message);
                ResetForm();
                LoadRegisterLead();
            } else {
                alert(response.message);
            }
        },
        error: function (xhr) {
            EnableSaveButton();
            alert("Unable to save Register Lead.");
        }
    });
}

function LoadRegisterLead() {
    $.ajax({
        url: "/RegisterLead/GetRegisterLead",
        type: "GET",
        dataType: "json",
        cache: false,
        success: function (response) {

            if (!response.success) {
                alert(response.message);
                return;
            }

            if ($.fn.DataTable.isDataTable("#tblRegisterLead")) {
                $("#tblRegisterLead").DataTable().clear().destroy();
            }

            var html = "";

            $.each(response.data, function (i, item) {

                var leadDate = "";
                if (item.LeadDate) {
                    var date = new Date(item.LeadDate);
                    if (!isNaN(date.getTime())) {
                        var day = ("0" + date.getDate()).slice(-2);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        leadDate = day + "-" + month + "-" + year;
                    }
                    else {
                        leadDate = item.LeadDate;
                    }
                }

                // Visit -> plain black text (Yes / No / blank)
                var visit = (item.Visit || "").toString().trim();

                html += "<tr>";
                html += "<td>" + (i + 1) + "</td>";
                html += "<td>" + leadDate + "</td>";
                html += "<td>" + (item.Company || "") + "</td>";
                html += "<td>" + (item.Product || "") + "</td>";
                html += "<td>" + (item.ContactNo || "") + "</td>";
                html += "<td class='text-center'>" + visit + "</td>";
                html += "<td>" + (item.Remarks || "") + "</td>";
                html += "<td>" + (item.Status || "") + "</td>";
                html += "<td class='text-center'>";
                html += "<a href='javascript:void(0)' onclick='ViewRegisterLead(" + item.LeadId + ")'><i class='fa fa-eye text-primary'></i></a> ";
                html += "<a href='javascript:void(0)' onclick='EditRegisterLead(" + item.LeadId + ")'><i class='fa fa-edit text-success'></i></a> ";
                html += "<a href='javascript:void(0)' onclick='DeleteRegisterLead(" + item.LeadId + ")'><i class='fa fa-trash text-danger'></i></a>";
                html += "</td>";
                html += "</tr>";
            });

            $("#tblRegisterLead tbody").html(html);

            $("#tblRegisterLead").DataTable({
                destroy: true,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                lengthChange: false,
                autoWidth: false,
                responsive: false,
                scrollX: false,
                language: {
                    emptyTable: "No Record Found"
                }
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("Unable to load Register Lead List.");
        }
    });
}

function EditRegisterLead(id) {
    $.ajax({
        url: "/RegisterLead/EditRegisterLead",
        type: "GET",
        dataType: "json",
        data: { id: id },
        success: function (response) {

            if (!response.success) {
                alert(response.message);
                return;
            }

            var data = response.data;

            $("#LeadId").val(data.LeadId);

            if (data.LeadDate) {
                $("#LeadDate").val(data.LeadDate.substring(0, 10));
            }

            $("#CategoryId").val(data.CategoryId);

            LoadCompanies(data.CompanyId, function () {
                GetProductsByCompany(data.CompanyId, function () {
                    $("#ProductId").val(data.ProductId);
                });
            });

            $("#CaseType").val(data.CaseType).trigger("change");
            $("#ExistingCompany").val(data.ExistingCompany);
            $("#PolicyNo").val(data.PolicyNo);
            $("#Amount").val(data.Amount);

            $("#ClientType").val(data.ClientType).trigger("change");
            $("#Name").val(data.Name);

            $("#ContactNo").val(data.ContactNo);
            $("#EmailId").val(data.EmailId);
            $("#Address").val(data.Address);

            $("#CountryId").val(data.CountryId);
            LoadStates(data.CountryId, data.StateId);
            LoadCities(data.StateId, data.CityId);

            $("#Pincode").val(data.Pincode);
            $("#Remarks").val(data.Remarks);
            $("#Status").val(data.Status);

            LoadPriorities(data.PriorityId);
            LoadDispositions(data.DispositionId);

            setTimeout(function () {
                $("#DispositionId").val(data.DispositionId).trigger("change");

                $("#VisitDate").val(data.VisitDate == null ? "" : data.VisitDate.substring(0, 10));
                $("#VisitTime").val(data.VisitTime == null ? "" : data.VisitTime);
                $("#Fixed").val(data.Fixed == null ? "" : data.Fixed);
            }, 300);

            $("#registerLeadFormCard").find("input, textarea, select").prop("disabled", false);
            $("#LeadDate").prop("readonly", true);

            $("#btnSave").show().html("<i class='fa fa-save'></i> Update");
            $("#btnReset").html("<i class='fa fa-refresh'></i> Reset");

            $("html, body").animate({
                scrollTop: $("#registerLeadFormCard").offset().top
            }, 500);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("Unable to load Register Lead.");
        }
    });
}

function ViewRegisterLead(id) {
    $.ajax({
        url: "/RegisterLead/EditRegisterLead",
        type: "GET",
        dataType: "json",
        data: { id: id },
        success: function (response) {

            if (!response.success) {
                alert(response.message);
                return;
            }

            var data = response.data;

            $("#LeadId").val(data.LeadId);

            if (data.LeadDate) {
                $("#LeadDate").val(data.LeadDate.substring(0, 10));
            }

            $("#CategoryId").val(data.CategoryId);

            LoadCompanies(data.CompanyId, function () {
                GetProductsByCompany(data.CompanyId, function () {
                    $("#ProductId").val(data.ProductId);
                });
            });

            $("#CaseType").val(data.CaseType).trigger("change");
            $("#ExistingCompany").val(data.ExistingCompany);
            $("#PolicyNo").val(data.PolicyNo);
            $("#Amount").val(data.Amount);

            $("#ClientType").val(data.ClientType).trigger("change");
            $("#Name").val(data.Name);

            $("#ContactNo").val(data.ContactNo);
            $("#EmailId").val(data.EmailId);
            $("#Address").val(data.Address);

            $("#CountryId").val(data.CountryId);
            LoadStates(data.CountryId, data.StateId);
            LoadCities(data.StateId, data.CityId);

            $("#Pincode").val(data.Pincode);
            $("#Remarks").val(data.Remarks);
            $("#Status").val(data.Status);

            LoadPriorities(data.PriorityId);
            LoadDispositions(data.DispositionId);

            setTimeout(function () {
                $("#DispositionId").val(data.DispositionId).trigger("change");

                $("#VisitDate").val(data.VisitDate == null ? "" : data.VisitDate.substring(0, 10));
                $("#VisitTime").val(data.VisitTime == null ? "" : data.VisitTime);
                $("#Fixed").val(data.Fixed == null ? "" : data.Fixed);

                $("#registerLeadFormCard").find("input, textarea, select").prop("disabled", true);
                $("#LeadId").prop("disabled", false);
            }, 400);

            $("#btnSave").hide();
            $("#btnReset").prop("disabled", false).html("<i class='fa fa-arrow-left'></i> Back");

            $("html, body").animate({
                scrollTop: $("#registerLeadFormCard").offset().top
            }, 500);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("Unable to view Register Lead.");
        }
    });
}

function DeleteRegisterLead(id) {

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    $.ajax({
        url: "/RegisterLead/DeleteRegisterLead",
        type: "POST",
        dataType: "json",
        data: { id: id },
        success: function (response) {
            if (response.success) {
                alert(response.message);
                LoadRegisterLead();
                ResetForm();
            }
            else {
                alert(response.message);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            alert("Unable to delete record.");
        }
    });
}

function LoadCountries(selectedCountryId) {
    $.ajax({
        url: "/RegisterLead/GetCountries",
        type: "GET",
        dataType: "json",
        success: function (response) {

            $("#CountryId").empty().append('<option value="">-- Select Country --</option>');

            if (response.success) {
                $.each(response.data, function (i, item) {
                    $("#CountryId").append(
                        $("<option></option>").val(item.CountryId).text(item.CountryName)
                    );
                });

                if (selectedCountryId) {
                    $("#CountryId").val(selectedCountryId);
                }
            }
        }
    });
}

function LoadStates(countryId, selectedStateId) {

    $("#StateId").empty().append('<option value="">-- Select State --</option>');
    $("#CityId").empty().append('<option value="">-- Select City --</option>');

    if (!countryId) return;

    $.ajax({
        url: "/RegisterLead/GetStates",
        type: "GET",
        dataType: "json",
        data: { countryId: countryId },
        success: function (response) {
            if (response.success) {
                $.each(response.data, function (i, item) {
                    $("#StateId").append(
                        $("<option></option>").val(item.StateId).text(item.StateName)
                    );
                });

                if (selectedStateId) {
                    $("#StateId").val(selectedStateId);
                }
            }
        }
    });
}

function LoadCities(stateId, selectedCityId) {

    $("#CityId").empty().append('<option value="">-- Select City --</option>');

    if (!stateId) return;

    $.ajax({
        url: "/RegisterLead/GetCities",
        type: "GET",
        dataType: "json",
        data: { stateId: stateId },
        success: function (response) {
            if (response.success) {
                $.each(response.data, function (i, item) {
                    $("#CityId").append(
                        $("<option></option>").val(item.CityId).text(item.CityName)
                    );
                });

                if (selectedCityId) {
                    $("#CityId").val(selectedCityId);
                }
            }
        }
    });
}

function ResetForm() {

    $("#LeadId").val(0);

    var today = new Date().toISOString().split('T')[0];
    $("#LeadDate").val(today);

    $("#CategoryId").val("");
    $("#CompanyId").val("");
    $("#ProductId").empty().append('<option value="">-- Select Product --</option>');

    $("#CaseType").val("").trigger("change");
    $("#ClientType").val("");
    $("#ExistingCompany").val("");
    $("#PolicyNo").val("");
    $("#Amount").val("");
    $(".portFields").css("display", "none");

    $("#Name").val("");
    $("#ContactNo").val("");
    $("#EmailId").val("");
    $("#Address").val("");

    $("#CountryId").val("");
    $("#StateId").empty().append('<option value="">-- Select State --</option>');
    $("#CityId").empty().append('<option value="">-- Select City --</option>');

    $("#Pincode").val("");
    $("#Remarks").val("");
    $("#Status").val("Open");
    $("#DispositionId").val("");
    $("#PriorityId").val("");

    $("#VisitDate").val("");
    $("#VisitTime").val("");
    $("#Fixed").val("");
    $(".visitFields").hide();
    $(".fixedField").hide();

    $("#registerLeadFormCard").find("input, textarea, select").prop("disabled", false);
    $("#LeadDate").prop("readonly", true);

    $("#btnSave").show().prop("disabled", false).html("<i class='fa fa-save'></i> Save");
    $("#btnReset").html("<i class='fa fa-refresh'></i> Reset");
}