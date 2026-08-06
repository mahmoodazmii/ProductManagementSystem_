var RemoveImage = false;

$(document).ready(function () {

    LoadNotice();

    $(document).on("click", "#btnAddNew", function (e) {
        e.preventDefault();
        showFormForCreate();
    });

    $(document).on("click", "#btnSave", function (e) {
        e.preventDefault();
        SaveNotice();
    });

    $(document).on("click", "#btnReset", function (e) {
        e.preventDefault();
        resetOrClose();
    });

    $(document).on("click", "#btnDeleteImage", function () {

        RemoveImage = true;

        $("#CoverPreview").attr("src", "");

        $("#coverContainer").hide();

        $("#defaultPreview").show();

        $("#CoverImage")
            .val("")
            .show()
            .prop("disabled", false);

        $("#btnDeleteImage").hide();

    });

    $(document).on("change", "#CoverImage", function () {

        var file = this.files[0];

        if (file) {

            RemoveImage = false;

            var reader = new FileReader();

            reader.onload = function (e) {

                $("#CoverPreview").attr("src", e.target.result);

                $("#coverContainer").show();

                $("#defaultPreview").hide();

                $("#btnDeleteImage").show();

            };

            reader.readAsDataURL(file);

        }
        else {

            $("#CoverPreview").attr("src", "");

            $("#coverContainer").hide();

            $("#defaultPreview").show();

            $("#btnDeleteImage").hide();

        }

    });

    $(document).on("click", ".btn-view", function () {
        ViewNotice($(this).data("id"));
    });

    $(document).on("click", ".btn-edit", function () {
        EditNotice($(this).data("id"));
    });

    $(document).on("click", ".btn-delete", function () {
        DeleteNotice($(this).data("id"));
    });

});
function showFormForCreate() {

    ResetForm();

    $("#noticeFormCard").slideDown(200);

    $("#noticeListCard").hide();

    $("#btnAddNew").hide();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#btnSave").show();

    $("#statusRow").show();

    $("#Topic").focus();

}

function closeForm() {

    ResetForm();

    $("#noticeFormCard").slideUp(200);

    $("#noticeListCard").show();

    $("#btnAddNew").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

}

function resetOrClose() {

    if ($("#btnReset").hasClass("close-mode")) {

        closeForm();

    }
    else {

        ResetForm();

    }

}

function SaveNotice() {

    if ($("#Topic").val().trim() == "") {

        alert("Enter Topic");

        $("#Topic").focus();

        return;

    }

    var formData = new FormData();

    formData.append("NoticeId", $("#NoticeId").val());

    formData.append("Topic", $("#Topic").val());

    formData.append("Content", $("#Content").val());

    formData.append("Status", $("#Status").val() === "true");

    formData.append("RemoveImage", RemoveImage);

    var fileInput = $("#CoverImage")[0];

    if (fileInput &&
        fileInput.files &&
        fileInput.files[0]) {

        formData.append("CoverImage", fileInput.files[0]);

    }

    $.ajax({

        url: "/Notice/SaveNotice",

        type: "POST",

        data: formData,

        processData: false,

        contentType: false,

        success: function (r) {

            alert(r.message);

            if (r.success) {

                LoadNotice();

                closeForm();

            }

        },

        error: function () {

            alert("Save Error");

        }

    });

}
function LoadNotice() {

    $.ajax({

        url: "/Notice/GetNotice",

        type: "GET",

        success: function (data) {

            data.sort(function (a, b) {
                return a.NoticeId - b.NoticeId;
            });

            var html = "";

            $.each(data, function (i, item) {

                html += "<tr>";

                html += "<td>" + item.NoticeId + "</td>";

                html += "<td>";

                if (item.CoverImage) {

                    html += "<img src='" + item.CoverImage +
                        "' width='100' height='60' style='object-fit:cover;' />";

                }

                html += "</td>";

                html += "<td>";

                if (item.Content) {

                    if (item.Content.length > 200) {

                        html += item.Content.substring(0, 200) + "...";

                    }
                    else {

                        html += item.Content;

                    }

                }

                html += "</td>";

                html += "<td>";

                html += "<button class='btn btn-info btn-sm me-1 btn-view' data-id='" + item.NoticeId + "'>";
                html += "<i class='fa fa-eye'></i>";
                html += "</button>";

                html += "<button class='btn btn-warning btn-sm me-1 btn-edit' data-id='" + item.NoticeId + "'>";
                html += "<i class='fa fa-edit'></i>";
                html += "</button>";

                html += "<button class='btn btn-danger btn-sm btn-delete' data-id='" + item.NoticeId + "'>";
                html += "<i class='fa fa-trash'></i>";
                html += "</button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblNotice tbody").html(html);

        },

        error: function () {

            alert("Unable to load notices");

        }

    });

}
function EditNotice(id) {

    $.ajax({

        url: "/Notice/EditNotice",
        type: "GET",
        data: { id: id },

        success: function (data) {

            if (!data) {
                alert("Not found");
                return;
            }

            $("#NoticeId").val(data.NoticeId);
            $("#Topic").val(data.Topic);
            $("#Content").val(data.Content);
            $("#Status").val(data.Status ? "true" : "false");

            if (data.CoverImage) {

                $("#CoverPreview").attr("src", data.CoverImage);

                $("#coverContainer").show();

                $("#defaultPreview").hide();

                $("#btnDeleteImage").show();

                RemoveImage = false;
            }
            else {

                $("#CoverPreview").attr("src", "");

                $("#coverContainer").hide();

                $("#defaultPreview").show();

                $("#btnDeleteImage").hide();
            }

            $("#noticeFormCard").slideDown(200);

            $("#noticeListCard").hide();

            $("#btnAddNew").hide();

            $("#btnReset")
                .removeClass("close-mode")
                .html('<i class="fa fa-refresh"></i> Reset');

            $("#btnSave").show();

            $("html,body").animate({
                scrollTop: $("#noticeFormCard").offset().top - 20
            }, 300);

        },

        error: function () {

            alert("Edit Error");

        }

    });

}

function ViewNotice(id) {

    $.ajax({

        url: "/Notice/ViewNotice",
        type: "GET",
        data: { id: id },

        success: function (res) {

            if (!res.success) {

                alert(res.message);
                return;
            }

            var d = res.data;

            $("#NoticeId").val(d.NoticeId);
            $("#Topic").val(d.Topic);
            $("#Content").val(d.Content);
            $("#Status").val(d.Status ? "true" : "false");

            if (d.CoverImage) {

                $("#CoverPreview").attr("src", d.CoverImage);

                $("#coverContainer").show();

                $("#defaultPreview").hide();
            }
            else {

                $("#coverContainer").hide();

                $("#defaultPreview").show();
            }

            $("#Topic").prop("readonly", true);

            $("#Content").prop("readonly", true);

            $("#Status").prop("disabled", true);

            $("#CoverImage").hide();

            $("#btnDeleteImage").hide();

            $("#noticeFormCard").slideDown(200);

            $("#noticeListCard").hide();

            $("#btnAddNew").hide();

            $("#btnSave").hide();

            $("#btnReset")
                .addClass("close-mode")
                .html('<i class="fa fa-times"></i> Close');

            $("html,body").animate({
                scrollTop: $("#noticeFormCard").offset().top - 20
            }, 300);

        },

        error: function () {

            alert("View Error");

        }

    });

}
function ViewNotice(id) {

    $.ajax({

        url: "/Notice/ViewNotice",
        type: "GET",
        data: { id: id },

        success: function (res) {

            if (!res.success) {

                alert(res.message);
                return;

            }

            var d = res.data;

            $("#NoticeId").val(d.NoticeId);
            $("#Topic").val(d.Topic);
            $("#Content").val(d.Content);
            $("#Status").val(d.Status ? "true" : "false");

            if (d.CoverImage) {

                $("#CoverPreview").attr("src", d.CoverImage);

                $("#coverContainer").show();

                $("#defaultPreview").hide();

            }
            else {

                $("#CoverPreview").attr("src", "");

                $("#coverContainer").hide();

                $("#defaultPreview").show();

            }

            $("#Topic").prop("readonly", true);

            $("#Content").prop("readonly", true);

            $("#Status").prop("disabled", true);

            $("#CoverImage").hide();

            $("#btnDeleteImage").hide();

            $("#noticeFormCard").slideDown(200);

            $("#noticeListCard").hide();

            $("#btnAddNew").hide();

            $("#btnSave").hide();

            $("#btnReset")
                .addClass("close-mode")
                .html('<i class="fa fa-times"></i> Close');

            $("html,body").animate({

                scrollTop: $("#noticeFormCard").offset().top - 20

            }, 300);

        },

        error: function () {

            alert("View Error");

        }

    });

}
function DeleteNotice(id) {

    if (!confirm("Delete this notice?"))
        return;

    $.ajax({

        url: "/Notice/DeleteNotice",
        type: "POST",
        data: { id: id },

        success: function (r) {

            alert(r.message);

            if (r.success) {

                ResetForm();
                LoadNotice();

            }

        },

        error: function () {

            alert("Delete Error");

        }

    });

}

function ResetForm() {

    $("#NoticeId").val(0);

    $("#Topic").val("");

    $("#Content").val("");

    $("#Status").val("true");

    $("#CoverImage").val("");

    $("#CoverPreview").attr("src", "");

    $("#coverContainer").hide();

    $("#defaultPreview").show();

    $("#btnDeleteImage").hide();

    $("#Topic").prop("readonly", false);

    $("#Content").prop("readonly", false);

    $("#Status").prop("disabled", false);

    $("#CoverImage")
        .show()
        .prop("disabled", false);

    RemoveImage = false;

    $("#btnSave").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#Topic").focus();

}