var RemoveLogo = false;

$(document).ready(function () {

    LoadCompany();

    $(document).on("click", "#btnSave", function (e) {
        e.preventDefault();
        SaveCompany();
    });

    $(document).on("click", "#btnReset", function (e) {
        e.preventDefault();
        resetOrClose();
    });

    $(document).on("click", "#btnDeleteLogo", function () {

        RemoveLogo = true;

        $("#CompanyLogoPreview").attr("src", "");
        $("#logoContainer").hide();

        $("#CompanyLogo")
            .val("")
            .show()
            .prop("disabled", false);

        $("#btnDeleteLogo").hide();

    });

    $(document).on("change", "#CompanyLogo", function () {

        var file = this.files[0];

        if (file) {

            RemoveLogo = false;

            var reader = new FileReader();

            reader.onload = function (e) {

                $("#CompanyLogoPreview").attr("src", e.target.result);
                $("#CompanyLogoLink").attr("href", e.target.result);

                $("#logoContainer").show();

                $("#CompanyLogo").hide();

                $("#btnDeleteLogo").show();

            };

            reader.readAsDataURL(file);

        }
        else {

            $("#logoContainer").hide();

            $("#btnDeleteLogo").hide();

        }

    });


    $(document).on("click", ".btn-view", function () {

        ViewCompany($(this).data("id"));

    });

    $(document).on("click", ".btn-edit", function () {

        EditCompany($(this).data("id"));

    });

    $(document).on("click", ".btn-delete", function () {

        DeleteCompany($(this).data("id"));

    });

});

function SaveCompany() {

    if ($("#CompanyName").val().trim() == "") {

        alert("Enter Company Name");

        $("#CompanyName").focus();

        return;

    }

    var formData = new FormData();

    formData.append("CompanyId", $("#CompanyId").val());
    formData.append("CompanyName", $("#CompanyName").val());
    formData.append("CompanyCode", $("#CompanyCode").val());
    formData.append("Description", $("#Description").val());
    formData.append("Status", $("#Status").val() === "true");
    formData.append("RemoveLogo", RemoveLogo);

    var fileInput = $("#CompanyLogo")[0];

    if (fileInput.files.length > 0) {

        formData.append("Logo", fileInput.files[0]);

    }

    $.ajax({

        url: "/Company/SaveCompany",

        type: "POST",

        data: formData,

        processData: false,

        contentType: false,

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadCompany();

                ResetForm();

            }

        },

        error: function () {

            alert("Save Error");

        }

    });

}

function LoadCompany() {

    $.ajax({

        url: "/Company/GetCompany",
        type: "GET",

        success: function (data) {

            var html = "";

            $.each(data, function (i, item) {

                html += "<tr>";

                html += "<td>" + item.CompanyId + "</td>";

                html += "<td>" + item.CompanyName + "</td>";

                html += "<td>" + item.CompanyCode + "</td>";

                html += "<td>";

                if (item.Logo) {

                    html += "<img src='" + item.Logo + "' width='100' height='60' style='object-fit:contain;' />";

                }

                html += "</td>";

                html += "<td>" + (item.Description == null ? "" : item.Description) + "</td>";

                html += "<td>" + item.Status + "</td>";

                html += "<td>";

                html += "<button type='button' class='btn btn-info btn-sm me-1 btn-view' data-id='" + item.CompanyId + "'>";
                html += "<i class='fa-solid fa-eye'></i>";
                html += "</button>";

                html += "<button type='button' class='btn btn-warning btn-sm me-1 btn-edit' data-id='" + item.CompanyId + "'>";
                html += "<i class='fa-solid fa-edit'></i>";
                html += "</button>";

                html += "<button type='button' class='btn btn-danger btn-sm btn-delete' data-id='" + item.CompanyId + "'>";
                html += "<i class='fa-solid fa-trash'></i>";
                html += "</button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblCompany tbody").html(html);

        },

        error: function () {

            alert("Unable to load company");

        }

    });

}


function EditCompany(id) {

    $.ajax({

        url: "/Company/EditCompany",

        type: "GET",

        data: { id: id },

        success: function (data) {

            if (!data) {

                alert("Company Not Found");

                return;

            }

            $("#CompanyId").val(data.CompanyId);

            $("#CompanyName").val(data.CompanyName);

            $("#CompanyCode").val(data.CompanyCode);

            $("#Description").val(data.Description);

            $("#Status").val(data.Status ? "true" : "false");

            $("#CompanyName").prop("readonly", false);

            $("#CompanyCode").prop("readonly", false);

            $("#Description").prop("readonly", false);

            $("#Status").prop("disabled", false);

            if (data.Logo) {

                $("#CompanyLogoPreview").attr("src", data.Logo);
                $("#CompanyLogoLink").attr("href", data.Logo);

                $("#logoContainer").show();
                $("#btnDeleteLogo").show();
                $("#CompanyLogo").show().val("");

                RemoveLogo = false;
            }
            else {

                $("#CompanyLogoPreview").attr("src", "");
                $("#CompanyLogoLink").attr("href", "#");

                $("#logoContainer").hide();

                $("#CompanyLogo")
                    .show()
                    .val("");

                $("#btnDeleteLogo").hide();

                RemoveLogo = false;
            }

            $("#btnSave").show();

            $("#btnReset")
                .removeClass("close-mode")
                .html('<i class="fa fa-refresh"></i> Reset');

            $("html,body").animate({

                scrollTop: $("#companyFormCard").offset().top - 20

            }, 300);

            $("#CompanyName").focus();

        },

        error: function () {

            alert("Edit Error");

        }

    });

}
function ViewCompany(id) {

    $.ajax({

        url: "/Company/ViewCompany",

        type: "GET",

        data: { id: id },

        success: function (res) {

            if (!res.success) {

                alert(res.message);
                return;

            }

            var d = res.data;

            $("#CompanyId").val(d.CompanyId);
            $("#CompanyName").val(d.CompanyName);
            $("#CompanyCode").val(d.CompanyCode);
            $("#Description").val(d.Description);
            $("#Status").val(d.Status ? "true" : "false");

            if (d.Logo) {

                $("#CompanyLogoPreview").attr("src", d.Logo);
                $("#CompanyLogoLink").attr("href", d.Logo);

                $("#logoContainer").show();

            }
            else {

                $("#CompanyLogoPreview").attr("src", "");

                $("#logoContainer").hide();

            }

            $("#CompanyName").prop("readonly", true);
            $("#CompanyCode").prop("readonly", true);
            $("#Description").prop("readonly", true);
            $("#Status").prop("disabled", true);

            $("#CompanyLogo")
                .show()
                .val("")
                .prop("disabled", true);
            $("#btnDeleteLogo").hide();

            $("#btnSave").hide();

            $("#btnReset")
                .addClass("close-mode")
                .html('<i class="fa fa-times"></i> Close');

            $("html,body").animate({

                scrollTop: $("#companyFormCard").offset().top - 20

            }, 300);

        },

        error: function () {

            alert("View Error");

        }

    });

}

function DeleteCompany(id) {

    if (!confirm("Delete this company?"))
        return;

    $.ajax({

        url: "/Company/DeleteCompany",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadCompany();

                ResetForm();

            }

        },

        error: function () {

            alert("Delete Error");

        }

    });

}

function ResetForm() {

    RemoveLogo = false;

    $("#CompanyId").val(0);

    $("#CompanyName").val("");
    $("#CompanyCode").val("");
    $("#Description").val("");

    $("#Status").val("true");

    $("#CompanyLogo").val("");

    $("#CompanyLogoPreview").attr("src", "");

    $("#logoContainer").hide();

    $("#CompanyName").prop("readonly", false);
    $("#CompanyCode").prop("readonly", false);
    $("#Description").prop("readonly", false);

    $("#Status").prop("disabled", false);

    $("#CompanyLogo")
        .show()
        .prop("disabled", false);

    $("#btnDeleteLogo").hide();

    $("#btnSave").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#CompanyName").focus();

}

function resetOrClose() {

    if ($("#btnReset").hasClass("close-mode")) {

        ResetForm();

    }
    else {

        ResetForm();

    }

}