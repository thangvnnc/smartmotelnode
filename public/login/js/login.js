
$(document).ready(function () {
    const MES_MODAL_TITLE_LOGIN = 'Đang xử lý';
    const MES_MODAL_MESSAGE_LOGIN = 'Đang đăng nhập vui lòng chờ đợi...';

    const MES_MODAL_TITLE_LOGIN_ERROR = 'Thông báo';
    const MES_MODAL_MESSAGE_LOGIN_ERROR = 'Đăng nhập thất bại';

    /*********************************************************
     ********************** Process **************************
     *********************************************************/

    /**
     * Xử lý đăng nhập
     */
    function login() {
        let edtUsername = $(".edt-username").val();
        let edtPassword = $(".edt-password").val();
        let chkRemember = $(".chk-remember").is(":checked");

        let reqLogin = {
            username: edtUsername,
            password: edtPassword,
            remember: chkRemember
        };
        showModalWait(MES_MODAL_TITLE_LOGIN, MES_MODAL_MESSAGE_LOGIN, false, false);
        $.ajax({
            type: "POST",
            async: false,
            url: urlReqLogin,
            data: reqLogin,
            success: loginSuccess,
            error: loginError
        });
    }

    function loginSuccess(data, status, xhr) {
        hideModalWait();
        if (data.code === 0){
            if (data.response.rights === 1) {
                window.location.href = "/admin";
            }
            else {
                window.location.href = "/app";
            }
        }
        else {
            showModalWait(MES_MODAL_TITLE_LOGIN_ERROR, MES_MODAL_MESSAGE_LOGIN_ERROR, true, true);
        }
    }

    function loginError(xhr, status, error) {
        hideModalWait();
        showModalWait(MES_MODAL_TITLE_LOGIN_ERROR, error, true, true);
    }

    /*********************************************************
     ********************** Event **************************
     *********************************************************/

    /**
     * Event enter trên form đăng nhập
     */
    $(".login-form").keypress(function (event) {
        // key == 13 enter
        if (event.which == 13) {
            event.preventDefault();
            login();
        }
    });

    /**
     * Event click login button
     */
    $(".login-btn").click(function () {
        login();
    });
});