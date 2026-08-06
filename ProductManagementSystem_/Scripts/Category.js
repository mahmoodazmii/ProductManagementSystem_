$(document).ready(function () {

    LoadCategory();

    $(document).on("click", "#btnSave", function (e) {
        e.preventDefault();
        SaveCategory();
    });

    $(document).on("click", "#btnReset", function (e) {
        e.preventDefault();
        resetOrClose();
    });

    $(document).on("click", ".btn-view", function (e) {
        e.preventDefault();
        ViewCategory($(this).data("id"));
    });

    $(document).on("click", ".btn-edit", function (e) {
        e.preventDefault();
        EditCategory($(this).data("id"));
    });

    $(document).on("click", ".btn-delete", function (e) {
        e.preventDefault();
        DeleteCategory($(this).data("id"));
    });

    $("#Description").on("input", function () {
        this.style.height = "38px";     
        this.style.height = this.scrollHeight + "px"; 
    });

});

function LoadCategory() {

    $.ajax({
        url: "/Category/GetCategory",
        type: "GET",
        success: function (data) {

            var html = "";

            $.each(data, function (i, item) {

                html += "<tr>";

                html += "<td>" + item.CategoryId + "</td>";

                html += "<td>" + item.CategoryName + "</td>";

                html += "<td>" + (item.Description == null ? "" : item.Description) + "</td>";

                html += "<td>" + item.Status + "</td>";

                html += "<td>";

                html += "<button type='button' class='btn btn-info btn-sm me-1 btn-view' data-id='" + item.CategoryId + "'>";
                html += "<i class='fa-solid fa-eye'></i>";
                html += "</button>";

                html += "<button type='button' class='btn btn-warning btn-sm me-1 btn-edit' data-id='" + item.CategoryId + "'>";
                html += "<i class='fa-solid fa-edit'></i>";
                html += "</button>";

                html += "<button type='button' class='btn btn-danger btn-sm btn-delete' data-id='" + item.CategoryId + "'>";
                html += "<i class='fa-solid fa-trash'></i>";
                html += "</button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblCategory tbody").html(html);

        },
        error: function () {
            alert("Unable To Load Category");
        }
    });

}


//====================== Save Category ======================

function SaveCategory() {

    var category = {

        CategoryId: $("#CategoryId").val(),

        CategoryName: $("#CategoryName").val().trim(),

        Description: $("#Description").val().trim(),

        Status: $("#Status").val() === "true"

    };

    if (category.CategoryName == "") {

        alert("Please Enter Category Name");

        $("#CategoryName").focus();

        return;
    }

    $.ajax({

        url: "/Category/SaveCategory",

        type: "POST",

        data: category,

        success: function (response) {

            alert(response.message);

            if (response.success) {

                LoadCategory();

                ResetForm();

            }

        },

        error: function () {

            alert("Something Went Wrong");

        }

    });

}
//====================== Edit Category ======================

function EditCategory(id) {

    $.ajax({

        url: "/Category/EditCategory",

        type: "GET",

        data: { id: id },

        success: function (data) {

            $("#CategoryId").val(data.CategoryId);

            $("#CategoryName").val(data.CategoryName);

            $("#Description").val(data.Description);

            $("#Status").val(data.Status ? "true" : "false");

            $("#CategoryName").prop("readonly", false);

            $("#Description").prop("readonly", false);

            $("#Status").prop("disabled", false);

            $("#btnSave").show();

            $("#btnReset")
                .removeClass("close-mode")
                .html('<i class="fa fa-refresh"></i> Reset');

            $("html,body").animate({
                scrollTop: $("#categoryFormCard").offset().top - 20
            }, 300);

            $("#CategoryName").focus();

        },

        error: function () {

            alert("Edit Error");

        }

    });

}



//====================== View Category ======================

function ViewCategory(id) {

    $.ajax({

        url: "/Category/ViewCategory",

        type: "GET",

        data: { id: id },

        success: function (response) {

            if (!response.success) {

                alert(response.message);

                return;

            }

            var data = response.data;

            $("#CategoryId").val(data.CategoryId);

            $("#CategoryName").val(data.CategoryName);

            $("#Description").val(data.Description);

            $("#Status").val(data.Status === "Active" ? "true" : "false");

            $("#CategoryName").prop("readonly", true);

            $("#Description").prop("readonly", true);

            $("#Status").prop("disabled", true);

            $("#btnSave").hide();

            $("#btnReset")
                .addClass("close-mode")
                .html('<i class="fa fa-times"></i> Close');

            $("html,body").animate({
                scrollTop: $("#categoryFormCard").offset().top - 20
            }, 300);

            $("#CategoryName").focus();

        },

        error: function () {

            alert("View Error");

        }

    });

}



//====================== Delete Category ======================

function DeleteCategory(id) {

    if (!confirm("Are you sure you want to delete this category?"))
        return;

    $.ajax({

        url: "/Category/DeleteCategory",

        type: "POST",

        data: { id: id },

        success: function (response) {

            alert(response.message);

            if (response.success) {

                ResetForm();

                LoadCategory();

            }

        },

        error: function () {

            alert("Delete Error");

        }

    });

}
//====================== Reset Form ======================

function ResetForm() {

    $("#CategoryId").val(0);

    $("#CategoryName").val("");

    $("#Description").val("");

    $("#Status").val("true");

    $("#CategoryName").prop("readonly", false);

    $("#Description").prop("readonly", false);

    $("#Status").prop("disabled", false);

    $("#btnSave").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#CategoryName").focus();

}



//====================== Reset / Close ======================

function resetOrClose() {

    if ($("#btnReset").hasClass("close-mode")) {

        ResetForm();

    }
    else {

        ResetForm();

    }

}