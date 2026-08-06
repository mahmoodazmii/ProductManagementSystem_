var RemoveImage = false;

function linkify(text) {
    if (!text) return "";

    var urlPattern = /(\b(https?|ftp):\/\/[^\s<>]+)/gi;
    text = text.replace(urlPattern, function (url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });

    var wwwPattern = /(^|[^\/])(www\.[^\s<>]+)/gi;
    text = text.replace(wwwPattern, function (match, prefix, url) {
        return prefix + '<a href="https://' + url + '" target="_blank">' + url + '</a>';
    });

    return text;
}

$(document).ready(function () {

    LoadNews();

    $(document).on("click", "#btnAddNew", function (e) {
        e.preventDefault();
        showFormForCreate();
    });

    $(document).on("click", "#btnSave", function (e) {
        e.preventDefault();
        SaveNews();
    });

    $(document).on("click", "#btnReset", function (e) {
        e.preventDefault();
        resetOrClose();
    });

    $(document).on("click", "#btnDeleteImage", function () {

        RemoveImage = true;

        $("#CoverPreview").attr("src", "");
        $("#coverContainer").hide();

        $("#CoverImage").val("").show().prop("disabled", false);

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

                $("#CoverImage").hide();

                $("#btnDeleteImage").show();

            };

            reader.readAsDataURL(file);

        }
        else {

            $("#coverContainer").hide();
            $("#btnDeleteImage").hide();

        }

    });

    $(document).on("click", ".btn-view", function () {
        ViewNews($(this).data("id"));
    });

    $(document).on("click", ".btn-edit", function () {
        EditNews($(this).data("id"));
    });

    $(document).on("click", ".btn-delete", function () {
        DeleteNews($(this).data("id"));
    });

});

function showFormForCreate() {

    ResetForm();

    $("#newsFormCard").slideDown(200);

    $("#newsListCard").hide();

    $("#btnAddNew").hide();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#Topic").focus();

}

function closeForm() {

    ResetForm();

    $("#newsFormCard").slideUp(200);

    $("#newsListCard").show();

    $("#btnAddNew").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

}

function resetOrClose() {

    if ($("#btnReset").hasClass("close-mode")) {

        closeForm();

    } else {

        ResetForm();

    }

}

function SaveNews() {

    if ($("#Topic").val().trim() == "") {

        alert("Enter Topic");

        $("#Topic").focus();

        return;

    }

    var formData = new FormData();

    formData.append("NewsId", $("#NewsId").val());

    formData.append("Topic", $("#Topic").val());

    formData.append("Content", $("#Content").val());

    formData.append("Status", $("#Status").val() === "true");

    formData.append("RemoveImage", RemoveImage);

    var fileInput = $("#CoverImage")[0];

    if (fileInput && fileInput.files && fileInput.files[0]) {

        formData.append("CoverImage", fileInput.files[0]);

    }

    $.ajax({

        url: "/News/SaveNews",

        type: "POST",

        data: formData,

        processData: false,

        contentType: false,

        success: function (r) {

            alert(r.message);

            if (r.success) {

                LoadNews();

                closeForm();

            }

        },

        error: function () {

            alert("Save Error");

        }

    });

}

function LoadNews() {

    $.ajax({

        url: "/News/GetNews",
        type: "GET",

        success: function (data) {

            var html = "";

            $.each(data, function (i, item) {

                html += "<tr>";

                html += "<td>" + item.NewsId + "</td>";

                html += "<td>" +
                    (item.CoverImage
                        ? "<img src='" + item.CoverImage + "' width='100' height='60' style='object-fit:cover;' />"
                        : "") +
                    "</td>";

                var content = item.Content || "";

                if (content.length > 200)
                    content = content.substring(0, 200) + "...";

                html += "<td>";
                html += "<div class='news-content' data-id='" + item.NewsId + "'>";
                html += linkify(content);
                html += "</div>";
                html += "</td>";

                html += "<td>";

                html += "<button class='btn btn-info btn-sm me-1 btn-view' data-id='" + item.NewsId + "'><i class='fa fa-eye'></i></button>";

                html += "<button class='btn btn-warning btn-sm me-1 btn-edit' data-id='" + item.NewsId + "'><i class='fa fa-edit'></i></button>";

                html += "<button class='btn btn-danger btn-sm btn-delete' data-id='" + item.NewsId + "'><i class='fa fa-trash'></i></button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblNews tbody").html(html);

        },

        error: function () {

            alert("Unable to load news");

        }

    });

}

function EditNews(id) {

    $.ajax({

        url: "/News/EditNews",

        type: "GET",

        data: { id: id },

        success: function (data) {

            if (!data) {

                alert("Not found");

                return;

            }

            $("#NewsId").val(data.NewsId);

            $("#Topic").val(data.Topic);

            $("#Content").val(data.Content);

            $("#Status").val(data.Status ? "true" : "false");

            if (data.CoverImage) {

                $("#CoverPreview").attr("src", data.CoverImage);

                $("#coverContainer").show();

                $("#btnDeleteImage").show();

                $("#CoverImage").hide();

                RemoveImage = false;

            }
            else {

                $("#CoverPreview").attr("src", "");

                $("#coverContainer").hide();

                $("#CoverImage").show().val("");

                $("#btnDeleteImage").hide();

                RemoveImage = false;

            }

            $("#newsFormCard").slideDown(200);

            $("#newsListCard").hide();

            $("#btnAddNew").hide();

            $("#btnReset")
                .removeClass("close-mode")
                .html('<i class="fa fa-refresh"></i> Reset');

            $("#btnSave").show();

            $("html,body").animate({

                scrollTop: $("#newsFormCard").offset().top - 20

            }, 300);

        },

        error: function () {

            alert("Edit Error");

        }

    });

}

function ViewNews(id) {

    $.ajax({

        url: "/News/ViewNews",

        type: "GET",

        data: { id: id },

        success: function (res) {

            if (!res.success) {

                alert(res.message);

                return;

            }

            var d = res.data;

            $("#NewsId").val(d.NewsId);

            $("#Topic").val(d.Topic);

            $("#Content").val(d.Content);

            $("#Status").val(d.Status ? "true" : "false");

            if (d.CoverImage) {

                $("#CoverPreview").attr("src", d.CoverImage);

                $("#coverContainer").show();

            }
            else {

                $("#coverContainer").hide();

            }

            $("#Topic").prop("readonly", true);

            $("#Content").prop("readonly", true);

            $("#Status").prop("disabled", true);

            $("#CoverImage").hide();

            $("#btnDeleteImage").hide();

            $("#newsFormCard").slideDown(200);

            $("#newsListCard").hide();

            $("#btnAddNew").hide();

            $("#btnSave").hide();

            $("#btnReset")
                .addClass("close-mode")
                .html('<i class="fa fa-times"></i> Close');

            $("html,body").animate({

                scrollTop: $("#newsFormCard").offset().top - 20

            }, 300);

        },

        error: function () {

            alert("View Error");

        }

    });

}  

function DeleteNews(id) {

    if (!confirm("Delete this news?"))
        return;

    $.ajax({

        url: "/News/DeleteNews",

        type: "POST",

        data: { id: id },

        success: function (r) {

            alert(r.message);

            if (r.success) {

                ResetForm();

                LoadNews();

                closeForm();

            }

        },

        error: function () {

            alert("Delete Error");

        }

    });

}

function ResetForm() {

    $("#NewsId").val(0);

    $("#Topic").val("");

    $("#Content").val("");

    $("#Status").val("true");

    $("#CoverImage").val("");

    $("#CoverPreview").attr("src", "");

    $("#coverContainer").hide();

    $("#Topic").prop("readonly", false);

    $("#Content").prop("readonly", false);

    $("#Status").prop("disabled", false);

    $("#CoverImage")
        .show()
        .prop("disabled", false);

    $("#btnDeleteImage").hide();

    RemoveImage = false;

    $("#btnSave").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#Topic").focus();

}