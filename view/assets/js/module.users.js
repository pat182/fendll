let app_users = function(){
    
}
app_users.prototype = {
    init : function(){
        var self = this;
        self._variables();
        self._routes();
        self._events();
    },
    _routes : function(){
        let self = this;
        app.get('#/users', function () {
	        if ($body.find('.wrapper[container-id="users"]').is(':hidden')) {
                $body.find('.sidebar-menu li a').removeClass('active');
                $body.find('.menu-user a').addClass('active');
                $body.find('.menu-user a').addClass('active');
	            $body.find('.wrapper').hide();
	            $body.find('.wrapper[container-id="users"]').delay(100).slideDown(200);
                main._auto_complete('user',$filter_user_id,'POST',main.base_url+'user/user-auto','username');
                main._auto_complete('role',$filter_permission_type,'POST',main.base_url+'permission/role-auto','permission');
                self._clear()

                
	        }
	    });
    },
    _variables : function(){
        //filters
        $filter_user_id = $body.find('#user_id');
        $filter_permission_type = $body.find('#permission_type_id');
        $filter_container = $body.find('.user-filter-container');
        $user_table = $body.find('#tbl-users');
        $user_table_body = $body.find('#user-tbody');
        ///usr mdl
        $permssion_option = $body.find('#permission-type');
        $update_perm_mdl = $body.find('#update-role-mdl');
        $update_perm_btn = $body.find('#btn-update-perm');
        $mdl_header_perm = $body.find('.mdl-up-perm');
        $user_mdl = $body.find('#users-mdl');
        $create_user_mdl = $body.find('#users-mdl');


    },
    _events : function(){
        var self = this;
        
        $body.delegate('.reg-element','input',function(){
            let val = [$(this).attr('id')];
            val.map(self._signup_validation);
        });
        $body.delegate('.register-button','click' , function(){
            let arr = [
                'add-username',
                'add-password',
                'add-confirm_password',
                'add-email',
                'add-f_name',
                'add-l_name',
                'add-permission_type_reg'
            ],
            flag = arr.map(self._signup_validation),
            data='';
            
            if(!flag.includes(false)){
                data = {
                        user : {
                            "username" : $body.find("#add-username").val(),
                            "email" : $body.find("#add-email").val(),
                            "permission_type_id" : $body.find('#add-permission_type_reg').val(),
                            "password" : $body.find("#add-password").val()
                        },
                        user_profile : {
                            "f_name" : $body.find("#add-f_name").val(),
                            "l_name" : $body.find("#add-l_name").val(),
                        }
                }
                
                self._signup(data);
            }
        });
        $body.delegate('#user_id,#permission_type_id', 'input', function(e){
            $(this).attr('data-id','');
        });

        $body.delegate('#btn-update-perm','click',function(){
            let me = $(this),
            params = me.attr('data-user');
            self._update_permission(params,{'permission_type_id' : $permssion_option.val()});
        });
        $body.delegate('.user-action','click',function(){
            let me = $(this);
            if(me.hasClass('update-perm')){
                main._render_permission_option($permssion_option,me.parent('td').attr('data-perm-id'));
                $mdl_header_perm.text('Update ' + me.parent('td').attr('data-name') + ' Permission');
                $update_perm_btn.attr('data-user', me.parent('td').attr('data-id'));
            }else{
                self._fail_s("Are You Sure You Want to Delete " +me.parent('td').attr('data-name')
                ,me.parent('td').attr('data-id'));
            }

        });
        $body.delegate('.btn-show-filter-users','click',function(){
            $filter_container.slideToggle(100);
        });
        $body.delegate('.btn-filter-users','click', function(){
            let params = '?';
            if($filter_user_id.attr('data-id') != '')
                params+='user_id=' + $filter_user_id.attr('data-id') + '&';
            if($filter_permission_type.attr('data-id') != '')
                params+='permission_type_id=' + $filter_permission_type.attr('data-id') + '&';
            self._get_user(params);
            $user_table.show();
        });
        $body.delegate('.btn-filter-users-clear','click', function(){
            self._clear();
        });
    },
    _fail_s : function(msg,id){
        let self = this;
        swal({
            title: "Warning",
            text: String(msg).initCap(),
            buttons: {
                confirm :{
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                },
                cancel : {
                    text: "Cancel",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                }
            },
            icon : "info"})
            .then((value)=>{
                if(value){
                    self._delete_user(id);
                }
            });
    },
    _delete_user : function($id){
        let self = this;
        main.pre_loader('default', true);
        $.ajax({
            type : 'DELETE',
            url : main.base_url + 'user/' + $id,
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                main.success_message(data_set.message);
                self._clear();
                main.pre_loader(null,false);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_message(e.responseJSON.message);
            }
        });
    },
    _get_user : function($params = ''){
        let self = this;
        main.pre_loader('default', true);
        $.ajax({
            type : 'GET',
            url : main.base_url + 'user' + $params,
            dataType: "JSON",
            beforeSend : function (xhr) {
                // console.log(main.getCookie('token'));
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                $user_table_body.html(self._render_user_table(data_set.data));
                main.pre_loader(null,false);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_message(e.responseJSON.message);
            }
        });
    },
    _update_permission : function(params,d){
        let self = this,
        p = '?';
        main.pre_loader('default-two', true);
        $.ajax({
            type : 'PUT',
            url : main.base_url + 'user/'+ params +'/permission',
            dataType: "JSON",
            data : d,
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                $update_perm_mdl.modal('toggle');
                main.success_message(data_set.message);
                if($filter_user_id.attr('data-id') != '')
                    p+='user_id=' + params + '&';
                if($filter_permission_type.attr('data-id') != '')
                    p+='permission_type_id=' + d.perm_type_id + '&';
                self._get_user(p);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_message(e.responseJSON.message);
            }
        });
    },
    _render_user_table : function(data){
        let html = '';
        
        for(let key in data){
            let d = new Date(data[key]['created_at']);
            
            html+=Mustache.render(__user_table,{
                'user_id' : data[key]['user_id'],
                'username' : data[key]['username'],
                'first_name' : (data[key]['user_profile'].f_name == null) ? "N/A" : data[key]['user_profile']['f_name'],
                'last_name' : (data[key]['user_profile'].l_name == null) ? "N/A" : data[key]['user_profile']['l_name'],
                'create_date' : d.getFullYear() + "-" + ( (d.getMonth()+ 1).length !=2 ? "0" + (d.getMonth()+1) : (d.getMonth()+1) )  + "-" + (d.getDate().toString().length != 2 ? ("0" + d.getDate()) : d.getDate()),
                'permission' : data[key]['permission_type']['permission'],
                'perm_type_id' : data[key]['permission_type']['permission_type_id'] 
            })
        }
        return html;
    },
    _clear : function(){
        let self = this;
        $filter_user_id.val('');
        $filter_user_id.attr('data-id','');
        $filter_permission_type.val('');
        $filter_permission_type.attr('data-id','');
        self._get_user()
        $user_table.show();
        main._render_permission_option($body.find('#add-permission_type_reg'));
        $body.find('.confirm-password').hide();
       
    }
    
}
var users = new app_users(null);