$(document).ready(function () {
    var RemoveImage = false;
    LoadNotification();

    $(document).on("click", "#btnAddNew", function (e) {
        e.preventDefault();
        showFormForCreate();
    });

    $(document).on("click", "#btnSave", function (e) { e.preventDefault(); SaveNotification(); });
    $(document).on("click", "#btnReset", function (e) { e.preventDefault(); resetOrClose(); });
    $(document).on("click", "#btnDeleteImage", function () {

        RemoveImage = true;

        $("#CoverPreview").attr("src", "");
        $("#coverContainer").hide();
        $("#defaultPreview").show();
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
                $("#defaultPreview").hide();
                $("#btnDeleteImage").show();

            };

            reader.readAsDataURL(file);
        }
        else {

            $("#coverContainer").hide();

            $("#defaultPreview").show();

            $("#btnDeleteImage").hide();

        }

    });

    $(document).on("click", ".btn-view", function () { ViewNotification($(this).data("id")); });
    $(document).on("click", ".btn-edit", function () { EditNotification($(this).data("id")); });
    $(document).on("click", ".btn-delete", function () { DeleteNotification($(this).data("id")); });
});

function showFormForCreate() {
    ResetForm();
    $("#notificationFormCard").slideDown(200);
    $("#notificationListCard").hide();
    $("#btnAddNew").hide();
    $("#btnReset").removeClass("close-mode").html('<i class="fa fa-refresh"></i> Reset');
    $("#Topic").focus();
}

function closeForm() {
    ResetForm();
    $("#notificationFormCard").slideUp(200);
    $("#notificationListCard").show();
    $("#btnAddNew").show();
    $("#btnReset").removeClass("close-mode").html('<i class="fa fa-refresh"></i> Reset');
}

function resetOrClose() {
    if ($("#btnReset").hasClass("close-mode")) {

        closeForm();
    } else {
        ResetForm();
    }
}

function SaveNotification() {
    if ($("#Topic").val().trim() == "") { alert("Enter Topic"); $("#Topic").focus(); return; }
    var formData = new FormData();
    formData.append("NotificationId", $("#NotificationId").val());
    formData.append("Topic", $("#Topic").val());
    formData.append("Content", $("#Content").val());
    formData.append("Status", $("#Status").val() === "true");
    formData.append("RemoveImage", RemoveImage);

    var fileInput = $("#CoverImage")[0];
    if (fileInput && fileInput.files && fileInput.files[0]) formData.append("CoverImage", fileInput.files[0]);

    $.ajax({
        url: "/Notification/SaveNotification",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (r) {
            alert(r.message);
            if (r.success) {
                LoadNotification();
                closeForm();
            }
        }, error: function () { alert("Save Error"); }
    });
}

function LoadNotification() {
    $.ajax({
        url: "/Notification/GetNotification",
        type: "GET",
        success: function (data) {
            data.sort(function (a, b) {
                return a.NotificationId - b.NotificationId;
            });

            var html = "";

            $.each(data, function (i, item) {

                html += "<tr>";
                html += "<td>" + item.NotificationId + "</td>";
                html += "<td>" + (item.CoverImage ? "<img src='" + item.CoverImage + "' width='100' height='60' style='object-fit:cover;' />" : "") + "</td>";
                html += "<td>" + (item.Content ? (item.Content.length > 200 ? item.Content.substring(0, 200) + "..." : item.Content) : "") + "</td>";
                html += "<td><button class='btn btn-info btn-sm me-1 btn-view' data-id='" + item.NotificationId + "'><i class='fa fa-eye'></i></button><button class='btn btn-warning btn-sm me-1 btn-edit' data-id='" + item.NotificationId + "'><i class='fa fa-edit'></i></button><button class='btn btn-danger btn-sm btn-delete' data-id='" + item.NotificationId + "'><i class='fa fa-trash'></i></button></td>";
                html += "</tr>";

            });

            $("#tblNotification tbody").html(html);
        },
        error: function () {
            alert("Unable to load notifications");
        }
    });
}

function EditNotification(id) {
    $.ajax({ url: "/Notification/EditNotification", type: "GET", data: { id: id }, success: function (data) {
        if (!data) { alert("Not found"); return; }
        $("#NotificationId").val(data.NotificationId);
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

        $("#notificationFormCard").slideDown(200);
        $("#notificationListCard").hide();
        $("#btnAddNew").hide();
        $("#btnReset").removeClass("close-mode").html('<i class="fa fa-refresh"></i> Reset');
        $("#btnSave").show();
        $("html,body").animate({ scrollTop: $("#notificationFormCard").offset().top - 20 }, 300);
    }, error: function () { alert("Edit Error"); } });
}

function ViewNotification(id) {
    $.ajax({ url: "/Notification/ViewNotification", type: "GET", data: { id: id }, success: function (res) {
        if (!res.success) { alert(res.message); return; }
        var d = res.data;
        $("#NotificationId").val(d.NotificationId);
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
        $("#notificationFormCard").slideDown(200);
        $("#notificationListCard").hide();
        $("#btnAddNew").hide();
        $("#btnSave").hide();
        $("#btnReset").addClass("close-mode").html('<i class="fa fa-times"></i> Close');
        $("html,body").animate({ scrollTop: $("#notificationFormCard").offset().top - 20 }, 300);
    }, error: function () { alert("View Error"); } });
}

function DeleteNotification(id) {
    if (!confirm("Delete this notification?")) return;
    $.ajax({ url: "/Notification/DeleteNotification", type: "POST", data: { id: id }, success: function (r) { alert(r.message); if (r.success) { ResetForm(); LoadNotification(); } }, error: function () { alert("Delete Error"); } });
}

function ResetForm() {
    $("#NotificationId").val(0);
    $("#Topic").val("");
    $("#Content").val("");
    $("#Status").val("true");
    $("#CoverImage").val("");
    $("#CoverPreview").attr("src", "");
    $("#coverContainer").hide();
    $("#Topic").prop("readonly", false);
    $("#Content").prop("readonly", false);
    $("#Status").prop("disabled", false);
    $("#CoverImage").val("");

    $("#CoverPreview").attr("src", "");


    $("#coverContainer").hide();
    $("#defaultPreview").show();
    $("#btnDeleteImage").hide();

    RemoveImage = false;

    $("#btnSave").show();
    $("#btnReset").removeClass("close-mode").html('<i class="fa fa-refresh"></i> Reset');
    $("#Topic").focus();
}