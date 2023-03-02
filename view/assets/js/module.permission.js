let app_permission = function(){
    this.is_valid = false;
    this.pm = {};
}
app_permission.prototype = {
    init : function(){
        let self = this;
        self._routes();
        self._events();
        self._variables();   
    },
    _routes : function(){
        let self = this;
        app.get('#/permission', function () {
	        if ($body.find('.wrapper[container-id="permission"]').is(':hidden')) {
                $body.find('.sidebar-menu li a').removeClass('active');
                // $body.find('.menu-permissions a').addClass('active');
                // $body.find('.menu-permissions a').addClass('active');
	            $body.find('.wrapper').hide();
	            $body.find('.wrapper[container-id="permission"]').delay(100).slideDown(200);
                self._get_permission();
	        }
	    });
        app.get('#/crud-role', function () {
	        if ($body.find('.wrapper[container-id="crud-role"]').is(':hidden')) {
	            $body.find('.wrapper').hide();
	            $body.find('.wrapper[container-id="crud-role"]').delay(100).slideDown(200);
                $body.find('.menu-permissions .menu-role a').addClass('active');
                $body.find('.menu-permissions a').addClass('active');
                main.multiple_list($permission,main.base_url+'permission/permissions-auto','permission');
	        }
	    });
        app.get('#/role', function () {
	        if ($body.find('.wrapper[container-id="role"]').is(':hidden')) {
	            $body.find('.wrapper').hide();
	            $body.find('.wrapper[container-id="role"]').delay(100).slideDown(200);
                $body.find('.menu-permissions .menu-role a').addClass('active');
                $body.find('.menu-permissions a').addClass('active');
                $role_mtx_render.html('');
                self._get_perm_auto();
                self._get_all_roles();
                
                
	        }
	    });
    },
    _variables : function(){
        $role_table_body = $body.find('#perm-tbody');
        ///crud
        $permission = $body.find('#permissions-crud');
        $permission_name = $body.find('#permission-name-crd');
        $add_btn         = $body.find('.btn-add-permission');

        //mdl
        $t_body_user_mdl = $body.find('#user-mdl-tbody');
        $table_user_mdl = $body.find('#tbl-users-mdl');
        $error_msg = $body.find('.e-hand');

        ///roles for render
        $role_mtx_render =  $body.find('.role-mtx-render');
        $role_checkbox   =  $body.find('.route-perm');
    },
    _events : function(){
        var self = this;
        $body.delegate('.route-perm','ifToggled',function(){
            let me = $(this),
            url = '',
            met = ''; 
            data = {
                permission_type_id : me.parents('.mm-role-box').attr('data-main'),
                permission_id : me.attr('data-id')
            };
            if($(this).parent('div').hasClass('checked')){
                url = main.base_url + 'permission';
                met = 'DELETE'; 
                console.log('remove',me.parents('.mm-role-box').attr('data-main'));
               
            }else{
                url = main.base_url + 'permission/group';
                met = 'POST';
                console.log('add',me.parents('.mm-role-box').attr('data-main'));
            }
            self._toggle_permission(data,url,met)
        });
        $body.delegate('#permission-name-crd','input', function() {
            self._perm_validation($(this));
        });
        $body.delegate('.btn-add-permission-reset','click',function(){
            self._clear_crud();
        });
        $body.delegate('.btn-add-permission','click',function(){
            let d = '',
            data = {};
            self._perm_validation($permission_name);
            if(self.is_valid){
                d = $permission.select2('data');
                data.permission = $permission_name.val();
                if(d != 0){
                    d = d.map(self._get_perm_ids);
                    data.permission_ids = d  
                }
                self._add_role(data);
            }
        });
        $body.delegate('.perm-action','click',function(){
            let me = $(this);
            if(me.hasClass('view-user-perm')){
                self._clear();
                self._get_usr_mdl('permission_type_id=' + me.parent('td').attr('data-id'));
            }else{
                self._del_perm_confirm("Are You Sure You Want to Delete " +me.parent('td').attr('data-name')
                ,me.parent('td').attr('data-id'));
            }

        });

    },
    _toggle_permission : function (data,url,met){
        let self = this;
        main.pre_loader('default-two', true);
        $.ajax({
            type : met,
            url : url,
            dataType: "JSON",
            data : data,
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                main.pre_loader(null,false);
                main.success_message(data_set.message);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_handler(e);
            }
        });  
    },
    _perm_validation : function ($el){
        let self = this;
        if($el.val() == ''){
            self.is_valid = false;
            $el.addClass('underline-error');
        }else{
            $el.removeClass('underline-error');
            self.is_valid = true;
        }
    },
    _get_perm_ids : function (data){
        return data.id;
    },
    _get_all_roles : function(params = ''){
        let self = this;
        
        // main.pre_loader('default-two', true);
        
        $.ajax({
            type : 'GET',
            url : main.base_url + 'permission?' + params,
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                main.pre_loader(null,false);
                self._render_role_mtx(data_set.data);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_handler(e);

            }
        });
    },
    _render_sub : function(x){
        let self = this,
        sub_html = '';
        for (let k in self.pm){
            sub_html+=Mustache.render(__sub_hml_role,{
                'action_description' : self.pm[k].action_description,
                'perm_id' : self.pm[k].permission_id,
                'checked' : function(){
                    for(let i in x){
                        if(self.pm[k].permission_id == x[i].permission_id){
                            return "checked";
                        }
                    }
                }
            });
        } 
        return sub_html;
    },
    _render_role_mtx : function(data){
        let self = this;
        for(var key in data){
            $role_mtx_render.append(Mustache.render(__main_hml_role,{
                    'role_id' : data[key].permission_type_id,
                    'role' : String(data[key].permission).initCap(),
                    'sub_hml_role' : function(){
                        let x = '';
                        if(data[key].permission_group.length != 0)
                            x = data[key].permission_group;
                        return self._render_sub(x);
                    }
                })).iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    increaseArea: '20%'
                });
        }             
    },
    _get_usr_mdl : function(params){
        let self = this;
        $.ajax({
            type : 'GET',
            url : main.base_url + 'user?' + params,
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                $error_msg.text('');
                $table_user_mdl.show();
                $t_body_user_mdl.html(users._render_user_table(data_set.data));
                main.pre_loader(null,false);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                $error_msg.text(e.responseJSON.message);
                // $table_user_mdl.hide($error_msg);

            }
        });
        
    },
    _del_perm_confirm : function(msg,id){
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
                    self._delete_role(id);
                }
            });
    },
    _delete_role : function(id){
        let self = this;
        main.pre_loader('default-two', true);
        $.ajax({
            type : 'DELETE',
            url : main.base_url +'permission/type/' + id,
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                main.pre_loader(null,false);
                main.success_message(data_set.message);
                self._clear();

            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_handler(e);
            }
        });

    },
    _add_role : function(data){
        let self = this;
        main.pre_loader('default-two', true);
        $.ajax({
            type : 'POST',
            url : main.base_url +'permission/type',
            dataType: "JSON",
            data : data,
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                main.pre_loader(null,false);
                main.success_message(data_set.message);
                self._clear_crud();

            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_handler(e);
            }
        });
    },
    _get_permission : function(params){
        let self = this;
        main.pre_loader('default-two', true);
        $.ajax({
            type : 'POST',
            url : main.base_url +'permission/role-auto',
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                main.pre_loader(null,false);
                $role_table_body.html(self._render_role_table(data_set.data));

            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_message(e.responseJSON.message);
            }
        });
    },
    _get_perm_auto :function(){
        let self = this;
        main.pre_loader('default-two', true);
        $.ajax({
            type : 'POST',
            url : main.base_url +'permission/permissions-auto',
            dataType: "JSON",
            timeout : main.timeout,
            beforeSend : function (xhr) {
                xhr.setRequestHeader('Authorization', main.getCookie('token'));
            },
            success : function(data_set){
                self.pm = data_set.data
            }
        });
    },
    _render_role_table : function(data){
        let html = '';
        for(let key in data){
            html+=Mustache.render(__role_table,{
                'permission_type_id' : data[key]['permission_type_id'],
                'permission' : data[key]['permission']
            })
        }
        return html;
    },
    _clear_crud : function(){
        $permission_name.val('');
        $permission.val(null).trigger("change"); 
        $permission_name.removeClass('underline-error');
    },
    _clear : function(){
        let self = this;
        $t_body_user_mdl.html();
        $table_user_mdl.hide();
        self._get_permission();
    }
    
}
var permission = new app_permission(null);