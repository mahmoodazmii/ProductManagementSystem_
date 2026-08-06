
var selectedImages = [];
var selectedPDFs = [];

var existingImages = [];
var existingPDFs = [];

function showFormForCreate() {

    ResetForm();

    $("#productFormCard").slideDown(200);
    $("#productListCard").show();
    $("#btnAddNew").hide();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("#ProductName").focus();
}

function closeForm() {

    ResetForm();

    $("#productFormCard").slideUp(200);
    $("#productListCard").show();
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

function ResetForm() {

    selectedImages = [];
    selectedPDFs = [];

    existingImages = [];
    existingPDFs = [];

    $("#ProductId").val(0);

    $("#CategoryId").val("");
    $("#CompanyId").val("");

    $("#ProductName").val("");
    $("#ProductCode").val("");
    $("#SchemeOffer").val("");

    $("#MRP").val("");
    $("#Offer").val("");

    $("#CostPrice").val("");
    $("#SalePrice").val("");

    $("#Profit").val("");

    $("#BPRate").val("");
    $("#BPCommission").val("");

    $("#Tax").val("");

    $("#Description").val("");

    $("#Status").val("true");

    $("#Images").val("");
    $("#PdfFiles").val("");

    $("#ImagePreview").html("");
    $("#PdfPreview").html("");

    $("#btnSave").show();

    $("#btnReset")
        .removeClass("close-mode")
        .html('<i class="fa fa-refresh"></i> Reset');

    $("input, textarea, select").prop("disabled", false);

    $("#Profit").prop("readonly", true);
    $("#BPCommission").prop("readonly", true);

    adjustPreviewHeight();
}

function escapeHtml(text) {

    if (!text)
        return "";

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function nl2brSafe(text) {

    if (!text)
        return "";

    return text.replace(/\r\n|\n|\r/g, "<br/>");
}


function CalculateBP() {

    var cost = parseFloat($("#CostPrice").val()) || 0;
    var rate = parseFloat($("#BPRate").val()) || 0;

    var commission = (cost * rate) / 100;

    $("#BPCommission").val(commission.toFixed(2));
}

function CalculateProfit() {

    var sale = parseFloat($("#SalePrice").val()) || 0;
    var cost = parseFloat($("#CostPrice").val()) || 0;

    var profit = sale - cost;

    $("#Profit").val(profit.toFixed(2));
}
function PreviewImages(files) {

    if (!files || files.length === 0)
        return;

    for (var i = 0; i < files.length; i++) {

        selectedImages.push(files[i]);

    }
    renderImagePreview();

    $("#Images").val("");

}

function PreviewPDF(files) {

    if (!files || files.length === 0)
        return;
    for (var i = 0; i < files.length; i++) {

        selectedPDFs.push(files[i]);

    }
    renderPDFPreview();
    $("#PdfFiles").val("");

}

function renderImagePreview() {

    $("#ImagePreview").html("");

    $.each(existingImages, function (index, file) {

        var html = "";

        html += '<div class="preview-box">';
        html += '<a href="/Content/Uploads/Images/' + file + '" target="_blank">';
        html += '<img src="/Content/Uploads/Images/' + file + '" class="preview-img" />';

        html += '</a>';

        html += '<button type="button" class="remove-existing-img" data-index="' + index + '">';

        html += '<i class="fa fa-trash"></i>';

        html += '</button>';

        html += '</div>';

        $("#ImagePreview").append(html);

    });

    $.each(selectedImages, function (index, file) {

        var reader = new FileReader();

        reader.onload = function (e) {

            var html = "";

            html += '<div class="preview-box">';

            html += '<img src="' + e.target.result + '" class="preview-img" />';

            html += '<button type="button" class="remove-img" data-index="' + index + '">';

            html += '<i class="fa fa-trash"></i>';

            html += '</button>';

            html += '</div>';

            $("#ImagePreview").append(html);
        };

        reader.readAsDataURL(file);

    });

    adjustPreviewHeight();
}


function renderPDFPreview() {

    $("#PdfPreview").html("");

    $.each(existingPDFs, function (index, file) {

        var html = "";

        html += '<div class="pdf-box">';

        html += '<a href="/Content/Uploads/PDFs/' + file + '" target="_blank" class="pdf-icon-link">';

        html += '<i class="fa fa-file-pdf-o pdf-big-icon"></i>';

        html += '<span class="pdf-open-text">Open PDF</span>';

        html += '</a>';

        html += '<button type="button" class="remove-existing-pdf" data-index="' + index + '">';

        html += '<i class="fa fa-trash"></i>';

        html += '</button>';

        html += '</div>';

        $("#PdfPreview").append(html);

    });

    $.each(selectedPDFs, function (index, file) {

        var html = "";

        html += '<div class="pdf-box">';

        html += '<div class="pdf-icon-link">';

        html += '<i class="fa fa-file-pdf-o pdf-big-icon"></i>';

        html += '<span class="pdf-open-text">' + file.name + '</span>';

        html += '</div>';

        html += '<button type="button" class="remove-pdf" data-index="' + index + '">';

        html += '<i class="fa fa-trash"></i>';

        html += '</button>';

        html += '</div>';

        $("#PdfPreview").append(html);

    });

    adjustPreviewHeight();
}
function adjustPreviewHeight() {

    $("#ImagePreview,#PdfPreview").css({

        "height": "110px",

        "max-height": "110px",

        "overflow-y": "auto",

        "overflow-x": "hidden"
    });
}

function LoadProduct() {

    $.ajax({

        url: "/Product/GetProduct",

        type: "GET",

        dataType: "json",

        cache: false,

        success: function (data) {

            $("#tblProduct tbody").empty();

            var html = "";

            if (!data || data.length === 0) {

                html += "<tr>";

                html += "<td colspan='15' class='text-center text-danger'>";

                html += "No Product Found.";

                html += "</td>";

                html += "</tr>";

                $("#tblProduct tbody").html(html);

                return;
            }

            $.each(data, function (i, item) {

                html += "<tr>";

                html += "<td>" + item.ProductId + "</td>";

                html += "<td>" + escapeHtml(item.Category) + "</td>";

                html += "<td>" + escapeHtml(item.Company) + "</td>";

                html += "<td>" + escapeHtml(item.ProductName) + "</td>";

                html += "<td>" + escapeHtml(item.ProductCode) + "</td>";

                html += "<td>" + escapeHtml(item.SchemeOffer) + "</td>";

                html += "<td>" + item.MRP + "</td>";

                html += "<td>" + item.Offer + "</td>";

                html += "<td>" + item.CostPrice + "</td>";

                html += "<td>" + item.SalePrice + "</td>";

                html += "<td>" + item.Profit + "</td>";

                html += "<td>" + item.BPRate + "</td>";

                html += "<td>" + item.BPCommission + "</td>";

                html += "<td>" + item.Tax + "</td>";

                html += "<td class='action-cell'>";

                html += "<button type='button' class='btn btn-info btn-sm btn-view me-1' data-id='" + item.ProductId + "'>";

                html += "<i class='fa fa-eye'></i>";

                html += "</button>";

                html += "<button type='button' class='btn btn-warning btn-sm btn-edit me-1' data-id='" + item.ProductId + "'>";

                html += "<i class='fa fa-edit'></i>";

                html += "</button>";

                html += "<button type='button' class='btn btn-danger btn-sm btn-delete' data-id='" + item.ProductId + "'>";

                html += "<i class='fa fa-trash'></i>";

                html += "</button>";

                html += "</td>";

                html += "</tr>";

            });

            $("#tblProduct tbody").html(html);


        },

        error: function (xhr) {

            console.log(xhr.responseText);

            alert("Unable to Load Product.");

        }

    });

}

function EditProduct(id) {

    $.ajax({

        url: "/Product/EditProduct",

        type: "GET",

        data: { id: id },

        dataType: "json",

        success: function (res) {

            if (!res.success) {

                alert(res.message);

                return;
            }

            ResetForm();

            $("#ProductId").val(res.ProductId);

            $("#CategoryId").val(res.CategoryId);

            $("#CompanyId").val(res.CompanyId);

            $("#ProductName").val(res.ProductName);

            $("#ProductCode").val(res.ProductCode);

            $("#SchemeOffer").val(res.SchemeOffer);

            $("#MRP").val(res.MRP);

            $("#Offer").val(res.Offer);

            $("#CostPrice").val(res.CostPrice);

            $("#SalePrice").val(res.SalePrice);

            $("#BPRate").val(res.BPRate);

            $("#Tax").val(res.Tax);

            $("#Description").val(res.Description);

            $("#Status").val(res.Status ? "true" : "false");

            CalculateProfit();

            CalculateBP();

            existingImages = [];

            if (Array.isArray(res.Images)) {

                existingImages = res.Images.slice();

            }

            existingPDFs = [];

            if (Array.isArray(res.Pdfs)) {

                existingPDFs = res.Pdfs.slice();

            }

            renderImagePreview();

            renderPDFPreview();

            $("input,textarea,select").prop("disabled", false);

            $("#Profit").prop("readonly", true);

            $("#BPCommission").prop("readonly", true);

            $("#btnSave").show();

            $("#btnReset")
                .removeClass("close-mode")
                .html('<i class="fa fa-refresh"></i> Reset');

            $("#productFormCard").show();

            $("#productListCard").show();

            $("html,body").animate({

                scrollTop: $("#productFormCard").offset().top - 20

            }, 300);

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            alert("Unable to load product.");

        }

    });

}
function ViewProduct(id) {

    $.ajax({

        url: "/Product/ViewProduct",

        type: "GET",

        data: { id: id },

        dataType: "json",

        success: function (res) {

            if (!res.success) {

                alert(res.message);

                return;
            }

            ResetForm();

            $("#ProductId").val(res.ProductId);

            $("#CategoryId").val(res.CategoryId);

            $("#CompanyId").val(res.CompanyId);

            $("#ProductName").val(res.ProductName);

            $("#ProductCode").val(res.ProductCode);

            $("#SchemeOffer").val(res.SchemeOffer);

            $("#MRP").val(res.MRP);

            $("#Offer").val(res.Offer);

            $("#CostPrice").val(res.CostPrice);

            $("#SalePrice").val(res.SalePrice);

            $("#Profit").val(res.Profit);

            $("#BPRate").val(res.BPRate);

            $("#BPCommission").val(res.BPCommission);

            $("#Tax").val(res.Tax);

            $("#Description").val(res.Description);

            $("#Status").val(res.Status ? "true" : "false");
            existingImages = [];

            if (Array.isArray(res.Images)) {

                existingImages = res.Images.slice();

            }

            existingPDFs = [];

            if (Array.isArray(res.Pdfs)) {

                existingPDFs = res.Pdfs.slice();

            }

            renderImagePreview();

            renderPDFPreview();

            $("input, textarea, select").prop("disabled", true);

            $("#Profit").prop("readonly", true);

            $("#BPCommission").prop("readonly", true);

            $("#btnSave").hide();

            $("#btnReset").addClass("close-mode").html('<i class="fa fa-times"></i> Close');

            $("#productFormCard").slideDown(200);

            $("#productListCard").hide();

            $("html,body").animate({

                scrollTop: $("#productFormCard").offset().top - 20

            }, 300);

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            alert("Unable to load product.");

        }

    });

}

function DeleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    $.ajax({

        url: "/Product/DeleteProduct",

        type: "POST",

        data: { id: id },

        dataType: "json",

        success: function (res) {

            if (res.success) {

                alert(res.message);

                ResetForm();

                LoadProduct();

                $("#productFormCard").show();

                $("#productListCard").show();

                $("#ProductName").focus();
            }
            else {

                alert(res.message);
            }

        },

        error: function (xhr) {

            console.log(xhr.responseText);

            alert("Unable to delete product.");

        }

    });

}

function SaveProduct() {

    if ($("#CategoryId").val() === "") {
        alert("Please Select Category.");
        $("#CategoryId").focus();
        return;
    }

    if ($("#CompanyId").val() === "") {
        alert("Please Select Company.");
        $("#CompanyId").focus();
        return;
    }

    if ($.trim($("#ProductName").val()) === "") {
        alert("Please Enter Product Name.");
        $("#ProductName").focus();
        return;
    }

    if ($.trim($("#ProductCode").val()) === "") {
        alert("Please Enter Product Code.");
        $("#ProductCode").focus();
        return;
    }

    var formData = new FormData();

    formData.append("ProductId", $("#ProductId").val());

    formData.append("CategoryId", $("#CategoryId").val());

    formData.append("CompanyId", $("#CompanyId").val());

    formData.append("ProductName", $("#ProductName").val().trim());

    formData.append("ProductCode", $("#ProductCode").val().trim());

    formData.append("SchemeOffer", $("#SchemeOffer").val());

    formData.append("MRP", $("#MRP").val() || 0);

    formData.append("Offer", $("#Offer").val() || 0);

    formData.append("CostPrice", $("#CostPrice").val() || 0);

    formData.append("SalePrice", $("#SalePrice").val() || 0);

    formData.append("BPRate", $("#BPRate").val() || 0);

    formData.append("BPCommission", $("#BPCommission").val() || 0);

    formData.append("Tax", $("#Tax").val() || 0);

    formData.append("Description", $("#Description").val());

    formData.append("Status", $("#Status").val() === "true");

    formData.append("ExistingImages", existingImages.join("|"));

    formData.append("ExistingPDFs", existingPDFs.join("|"));

    for (var i = 0; i < selectedImages.length; i++) {

        formData.append("Images", selectedImages[i]);

    }
    for (var i = 0; i < selectedPDFs.length; i++) {

        formData.append("PdfFiles", selectedPDFs[i]);

    }

    $("#btnSave").prop("disabled", true);

    $.ajax({

        url: "/Product/SaveProduct",

        type: "POST",

        data: formData,

        processData: false,

        contentType: false,

        cache: false,

        success: function (response) {

            $("#btnSave").prop("disabled", false);

            if (response.success) {

                alert(response.message);

                ResetForm();

                LoadProduct();

                $("#productFormCard").show();

                $("#productListCard").show();

                $("#ProductName").focus();
            }
            else {

                alert(response.message);
            }

        },

        error: function (xhr) {

            $("#btnSave").prop("disabled", false);

            console.log(xhr.responseText);

            alert("Something went wrong while saving Product.");

        }

    });

}

$(document).ready(function () {

    LoadProduct();

    $("#btnAddNew").click(function (e) {

        e.preventDefault();

        showFormForCreate();

    });

    $("#btnSave").click(function (e) {

        e.preventDefault();

        SaveProduct();

    });

    $("#btnReset").click(function (e) {

        e.preventDefault();

        resetOrClose();

    });

    $(document).on("click", ".btn-view", function () {

        ViewProduct($(this).data("id"));

    });

    $(document).on("click", ".btn-edit", function () {

        EditProduct($(this).data("id"));

    });

    $(document).on("click", ".btn-delete", function () {

        DeleteProduct($(this).data("id"));

    });

    $("#Images").change(function () {

        PreviewImages(this.files);

    });

    $("#PdfFiles").change(function () {

        PreviewPDF(this.files);

    });

    $(document).on("click", ".remove-img", function () {

        RemoveImage($(this).data("index"));

    });

    $(document).on("click", ".remove-existing-img", function () {

        RemoveExistingImage($(this).data("index"));

    });

    $(document).on("click", ".remove-pdf", function () {

        RemovePDF($(this).data("index"));

    });

    $(document).on("click", ".remove-existing-pdf", function () {

        RemoveExistingPDF($(this).data("index"));

    });

    $("#BPRate,#CostPrice").on("input", function () {

        CalculateBP();

        CalculateProfit();

    });

    $("#SalePrice").on("input", function () {

        CalculateProfit();

    });

    adjustPreviewHeight();

});
function RemoveImage(index) {

    selectedImages.splice(index, 1);

    renderImagePreview();

}

function RemovePDF(index) {

    selectedPDFs.splice(index, 1);

    renderPDFPreview();

}

function RemoveExistingImage(index) {

    existingImages.splice(index, 1);

    $("#ImagePreview").html("");

    $.each(existingImages, function (i, file) {

        $("#ImagePreview").append(

            '<div class="preview-box">' +

            '<a href="/Content/Uploads/Images/' + file + '" target="_blank">' +

            '<img src="/Content/Uploads/Images/' + file + '" class="preview-img">' +

            '</a>' +

            '<button type="button" class="remove-existing-img" data-index="' + i + '">' +

            '<i class="fa fa-trash"></i>' +

            '</button>' +

            '</div>'

        );

    });

}

function RemoveExistingPDF(index) {

    existingPDFs.splice(index, 1);

    $("#PdfPreview").html("");

    $.each(existingPDFs, function (i, file) {

        $("#PdfPreview").append(

            '<div class="pdf-box">' +

            '<a href="/Content/Uploads/PDFs/' + file + '" target="_blank" class="pdf-icon-link">' +

            '<i class="fa fa-file-pdf-o pdf-big-icon"></i>' +

            '<span class="pdf-open-text">Open PDF</span>' +
                
            '</a>' +

            '<button type="button" class="remove-existing-pdf" data-index="' + i + '">' +

            '<i class="fa fa-trash"></i>' +

            '</button>' +

            '</div>'

        );

    });

}