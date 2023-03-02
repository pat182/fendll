let app_dashboard = function(){

}
app_dashboard.prototype = {
    
    init : function(){
        let self = this;
        self._routes();
        self._variables();
        // self._events();
    },
    _routes : function(){
        let self = this;
        app.get('#/dashboard', function () {
            self._get_user_profile(main.getCookie('user_id'));
	        if ($body.find('.wrapper[container-id="dashboard"]').is(':hidden')) {
                $body.find('.sidebar-menu li a').removeClass('active');
                $body.find('.menu-dashboard a').addClass('active');
	            $body.find('.wrapper').hide();
	            $body.find('.wrapper[container-id="dashboard"]').delay(100).slideDown(200);
	        }
	    });
    },
    _variables : function(){
        $txt_uname = $body.find('.username');
        $full_name = $body.find('.full-name');
    },
    // _events : function(){

    // },
    _get_user_profile : function($params){
        let self = this;
        main.pre_loader('default', true);
        $.ajax({
            type : 'GET',
            url : main.base_url + 'user/' + $params,
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                // console.log(main.getCookie('token'));
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                $txt_uname.html(data_set['data'].username);
                $full_name.html(
                    String(data_set['data']['user_profile'].f_name + ' ' +data_set['data']['user_profile'].l_name).initCap());
                main.pre_loader(null,false);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_message(e.responseJSON.message);
            }
        });
    }
}
var dashboard = new app_dashboard(null);