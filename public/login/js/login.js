
$(document).ready(function () {
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

        $.ajax({
            type: "POST",
            url: urlReqLogin,
            data: reqLogin,
            success: loginSuccess,
            error: loginError
        });
    }

    function loginSuccess(res) {
        console.log(res);
    }

    function loginError(error) {
        console.log(error);
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