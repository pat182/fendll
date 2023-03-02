var $body,is_reg_valid = false;

$(function() {
    $body = $('body');
	let token  = main.getCookie('token'),
		permissions   = '';
	if(token && permissions) {
        permissions = JSON.parse(main.getCookie('permissions'));
        location.href = main.main_path +'user/main.html';
	}
    
	eventer();
});	
let _pop_url= function(url){
    url.pop();
    url = url.join('/');
    return url;
}

let _render_sign_in = function(){
    let self = this,
    html = '';
    main.pre_loader('default-two', true);
    $.ajax({
        type : 'POST',
        url : main.base_url+'permission/role-auto',
        dataType: "JSON",
        timeout : main.timeout,
        success : function(data_set){
            for(let k in data_set.data){
                html += Mustache.render(__sign_in_as_template,{
                    'def' : k == 0 ? 'signin-user-type-active' : '',
                    'perm_id' : data_set.data[k]['permission_type_id'],
                    'permission' : String(data_set.data[k]['permission']).initCap()
                });
            }
            $body.find('.signin-user-type').html(html);
            $body.find('.signin-user-type').attr('data-perm-type',$body.find('.signin-user-type-active').attr('data-id'));
        },
        error : function(e, k, m){
            main.pre_loader(null,false);
            main.error_message(e.responseJSON.message);
        }
    });
}

let eventer = function(){
    let self = this;
   
    // _render_sign_in();
    _pp_auth();
    
    $body.find('.confirm-password').hide();
    
    main._render_permission_option($body.find('#permission_type_reg'));
    // $body.delegate('.signin-user-type-el', 'click', function() {
	// 	$('.signin-user-type-el').removeClass('signin-user-type-active');
    //     $(this).parent('.signin-user-type').attr('data-perm-type',$(this).first().data('id')); 
	// 	$(this).addClass('signin-user-type-active');
	// });

    $body.delegate('.reg-element','input',function(){
        let val = [$(this).attr('id')];
        val.map(_signup_validation);
    });
  
    $body.delegate('.login-password, .login-username', 'input', function() {
        var $el       = $(this),
             id       = $el.attr('id');
        _validate_login($el, id); 
    });
    $body.delegate('.login-button', 'click', function(e){
        e.preventDefault();
        e.stopPropagation();
        let username = $.trim($body.find('.login-username').val()),
            password = $.trim($body.find('.login-password').val());
        
        if (username != '' && username != null &&
            password != '' && password != '') {
            _login(username, password);

        } else {
           let elems = $('.login-form input');
           elems.each(function (key, item) {
                if (!elems.value) {
                    $(item).parent().find('.wrong').show();
                    $(item).parent().find('.check').hide(); 
                    $(item).addClass('underline-error');
                }
           });
        }
        
    });
    $body.delegate('.register','click',function(){
        location.href = main.main_path + 'register.html';
    });
    $body.delegate('.register-button','click' , function(){
        let arr = [
            'username',
            'password',
            'email',
            'confirm_password',
            'f_name',
            'l_name',
            'permission_type_reg'
        ],
        data='';
        arr.map(_signup_validation);

        if(is_reg_valid){
            // console.log(is_reg_valid);
            
            data = {
                    user : {
                        "username" : $body.find("#username").val(),
                        "email" : $body.find("#email").val(),
                        "permission_type_id" : $body.find('#permission_type_reg').val(),
                        "password" : $body.find("#password").val()
                    },
                    user_profile : {
                        "f_name" : $body.find("#f_name").val(),
                        "l_name" : $body.find("#l_name").val(),
                        "b_day" : $body.find("#b_day").val(),
                        "contact_number" : $body.find("#contact_number").val()
                    }
            }
            _render_pay(is_reg_valid);
            main.createCookie('reg_det', JSON.stringify(data));
            // _signup(data);
        }
    });
}
let _render_pay = function(flag){
    if(flag){
        console.log()
        $body.find('.registration-container').hide();
        $body.find('#test').html(__pay_pal_template);
    }
}
let _signup_validation = function(item){
    let arr = ['username','password','email','confirm_password','permission_type_reg']
    is_reg_valid = false;
    if(arr.indexOf($('#' + item).attr('id')) !== -1){
        if($('#' + item).val() == '' || $('#' + item).val() == null){
            is_reg_valid = false;
            $('#' + item).addClass('underline-error');
        }else{
            is_reg_valid = true;
            $('#' + item).removeClass('underline-error');
            if($('#' + item).attr('id') == 'email'){
                if(!main.is_email($('#' + item).val())){
                    $('#' + item).addClass('underline-error');
                    is_reg_valid = false;
                }else{
                    $('#' + item).removeClass('underline-error');
                    is_reg_valid = true;
                }
            }
            if($('#' + item).attr('id') == 'password' ){
                if($('#' + item).val().length <= 4){
                    $('#' + item).addClass('underline-error');
                    $body.find('.confirm-password').delay(100).slideUp(200);
                    is_reg_valid = false;
                }else{
                    $('#' + item).removeClass('underline-error');
                    $('.confirm-password').delay(100).slideDown(200);
                    is_reg_valid = true;
                }
            }
            if($('#' + item).attr('id') == 'confirm_password'){
                if($('#' + item).val().length <= 8){
                    $('#' + item).addClass('underline-error');
                    is_reg_valid = false;
                }else{
                    $('#' + item).removeClass('underline-error');
                    is_reg_valid = true;
                    if($('#' + item).val() != $('#password').val()){
                        $('#' + item).addClass('underline-error');
                        is_reg_valid = false;
                    }else{
                        $('#' + item).removeClass('underline-error');
                        is_reg_valid = true;
                    }
                }
            } 
        }
    }
    else{
        if($('#' + item).val() != ''){
            if($('#' + item).attr('id') == 'contact_number'){
                if(main.phone_number($('#' + item).val())){
                    is_reg_valid = true;
                    $('#' + item).removeClass('underline-error');
                }else{
                    is_reg_valid = false;
                    $('#' + item).addClass('underline-error');
                }
            }
            if($('#' + item).attr('id') == 'f_name' || $('#' + item).attr('id') == 'l_name'){
                if(main.is_name($('#' + item).val())){
                    is_reg_valid = true;
                    $('#' + item).removeClass('underline-error');
                }else{
                    is_reg_valid = false;
                    $('#' + item).addClass('underline-error');
                }
            }
        }else{
            is_reg_valid = true;
            $('#' + item).removeClass('underline-error');
        }  
    }
}
let _signup = function(params){
    let self = this;
    main.pre_loader('default-two', true);
    $.ajax({
        type : 'POST',
        url : main.base_url + 'register',
        data :params,
        dataType: "JSON",
        timeout : main.timeout,

        success : function(data_set){

            main.createCookie('user_id',data_set.user.user_id);
            main.createCookie('token', 'Bearer ' + data_set.auth.token);
            main.createCookie('permissions', JSON.stringify(data_set.auth.permissions));
            if(data_set.auth.permission_type_id != 2){
                window.location.href =  main.main_path +'user/main.html';
            }else{
                main.remove_tokens();
                window.location.href = main.main_path + 'user.html';
            }
            main.pre_loader(null,false);
        },
        error : function(e, k, m){
            main.pre_loader(null,false);
            main.error_handler(e);
        }
    })
}
let _validate_login = function($el,id){
    let self = this,
    is_valid = true,
    username = '',
    password = '';
    if(id == 'username'){
        if ($el.val() == '' || $el  == null ) {
            $el.parent().find('.wrong').show();
            $el.parent().find('.check').hide(); 
            $el.addClass('underline-error');
            is_valid = false;
        } else {
            $el.parent().find('.check').show();
            $el.parent().find('.wrong').hide();
            $el.removeClass('underline-error'); 
            username = $el.val();
            is_valid = true;
        }
    }
    else{
        if (id == 'password') {
            if ($el.val() == '' || $el  == null || $el.val().length < 5 ) {
                $el.parent().find('.wrong').show();
                $el.parent().find('.check').hide();
                 $el.addClass('underline-error');

                is_valid = false;
            } else {
                $el.parent().find('.check').show();
                $el.parent().find('.wrong').hide(); 
                $el.removeClass('underline-error');

                password = $el.val();

                is_valid = true;
            } 
        } 
    }
    if (self.is_valid) {
        _login(username, password);
    }
}
let _pp_auth = function(){
    $.ajax({
        type : 'POST',
        url : main.base_url + 'paypal/auth',
        dataType: "JSON",
        timeout : main.timeout,
        success : function(data_set){
            
            main.createCookie('pay_pal', 'Bearer ' + data_set.access_token);
        },
        error : function(e, k, m){
            main.pre_loader(null,false);
            main.error_message(e.responseJSON.error);
        }
    });
}
let _login = function(username, password){
    let self = this;
    main.pre_loader('default-one', true);
    $.ajax({
        type : 'POST',
        url : main.base_url + 'login',
        data : {
            'username' : username,
            'permission_type_id' : $body.find('.signin-user-type').attr('data-perm-type'), 
            'password' : password
        },
        dataType: "JSON",
        timeout : main.timeout,

        success : function(data_set){
            main.createCookie('user_id',data_set.user_id);
            main.createCookie('token', 'Bearer ' + data_set.token);
            main.createCookie('permissions', JSON.stringify(data_set.permissions));
            window.location.href =  main.main_path +'user/main.html';
            main.pre_loader(null,false);
        },
        error : function(e, k, m){
            main.pre_loader(null,false);
            main.error_message(e.responseJSON.error);
            $body.find('.landing-login-el').parent().find('.wrong').show();
            $body.find('.landing-login-el').parent().find('.check').hide();
            $body.find('.landing-login-el').addClass('underline-error');
            $body.find('.landing-login-el').val('');
        }
    });
    
}
    


