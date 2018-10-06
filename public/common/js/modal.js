function showModalWait(title, message, closeTabOutSize, buttonClose) {
    if($("body").find(".modal-auto-create").length > 0) {
        $("body").find(".modal-auto-create").remove();
    };

    $("body").append(makeModalWaiting(title, message, closeTabOutSize, buttonClose));
    $("body").find(".modal-auto-create").modal("show");
};

function hideModalWait() {
    $("body").find(".modal-auto-create").modal("hide");
    $("body").find(".modal-auto-create").remove();
    $("body").removeClass('modal-open');
    $("body").find(".modal-backdrop").remove();
}

function makeModalWaiting(title, message, closeTabOutSize, buttonClose) {
    let titleModal = "Đang xử lý";
    if (title !== null && title !== undefined) {
        titleModal = title;
    }

    let messageModal = "Vui lòng đợi...";
    if (message !== null && message !== undefined) {
        messageModal = message;
    }

    let htmlTapOutsizeModalHide = '';
    if (closeTabOutSize === false) {
        htmlTapOutsizeModalHide = 'data-backdrop="static" data-keyboard="false"';
    }

    let htmlButtonCloseModal = '';
    if (buttonClose === true) {
        htmlButtonCloseModal =
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
            '    <span aria-hidden="true">&times;</span>\n' +
            '</button>\n';
    }
    let result =
    '<div class="modal fade modal-auto-create" ' + htmlTapOutsizeModalHide + ' tabindex="-1" role="dialog">\n' +
    '  <div class="modal-dialog modal-sm" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <h4 class="modal-title"><b>' + titleModal + '</b></h4>\n' + htmlButtonCloseModal +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <p>' + messageModal + '</p>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>';
    return result;
}