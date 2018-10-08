const urlApi = "/apiv1";
const urlUsers = urlApi + "/users";
const urlReqLogout = urlUsers + "/logout";

const MES_MODAL_TITLE_LOGOUT = 'Đang xử lý';
const MES_MODAL_MESSAGE_LOGOUT = 'Đang đăng xuất vui lòng chờ đợi...';

const MES_MODAL_TITLE_LOGOUT_ERROR = 'Thông báo';
const MES_MODAL_MESSAGE_LOGOUT_ERROR = 'Đăng xuất bị lỗi';

$(document).ready(function () {
    $(".nav-menu").on("click", "li", function () {
        $(".nav-menu").find(".active").removeClass("active");
        $(this).addClass("active");
        $(".nav-item-content").hide(100);
        let attr = $(this).attr("focus");
        $("." +attr).show(100);
    });

    $(".logout-btn").click(function () {
        logout();
    });

    /**
     * Xử lý đăng xuất
     */
    function logout() {
        let reqLogin = {};
        showModalWait(MES_MODAL_TITLE_LOGOUT, MES_MODAL_MESSAGE_LOGOUT, false, false);
        $.ajax({
            type: "POST",
            async: false,
            url: urlReqLogout,
            data: reqLogin,
            success: logoutSuccess,
            error: logoutError
        });
    }

    function logoutSuccess(data, status, xhr) {
        hideModalWait();
        if (data.code === 0){
            window.location.href = "/login";
        }
        else {
            showModalWait(MES_MODAL_TITLE_LOGOUT_ERROR, MES_MODAL_MESSAGE_LOGOUT_ERROR, true, true);
        }
    }

    function logoutError(xhr, status, error) {
        hideModalWait();
        showModalWait(MES_MODAL_TITLE_LOGOUT_ERROR, error, true, true);
    }
});