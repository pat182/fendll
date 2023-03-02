var main_app = function(config){
	this.protocol = config;
};
main_app.prototype={
    initConfig : function() {
        let self = this;
        if(__config){
            self.base_url = __config.base_url;
            // self.socket_url = __config.socket_url;
            self.timeout = __config.timeout;
            self.main_path = __config.main_path;
			self.index_url = __config.index_url;
        }
    },
    createCookie: function(name, value, days) {
		let self = this,
			loc = (self.hostname === "localhost" ? self.local : self.dev);
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toUTCString();
		} else {
			var expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	},
    getCookie: function(cname) {
		let name = cname + "=";
		let ca = document.cookie.split(';');
		let value = '';
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) != -1) {
				value = c.substring(name.length, c.length);
			}
		}
		return value;
	},
    pre_loader : function(loc, type, sub_module) {
        // main.pre_loader('default', true);
		let $el = $body.find('#pre-loader'),
			$h3 = $el.find('h3'),
            $pr = $el.find('.progress-container'),
			txt = '';
		if (loc === 'default-one') {
			txt = "logging-in"
		}
		if (loc === 'default-two') {
			txt = ""
		}
		$h3.html(txt);
		if (type) {
			$el.slideDown(10);
		} else {
			if ($el.is(':visible')) {
				$pr.attr('style', 'display:none;');
				$el.slideUp(10);
				$h3.html('');
			}
		}
	},
    error_handler : function(e,k,m){
        let self = this,
        status = e.status,
        fn_event = true,
        msg = '',
        error = e.responseJSON;
        if(status >= 400){
			if(Array.isArray(e.responseJSON.errors)){
				for(var key in e.responseJSON.errors){
					self.error_message(e.responseJSON.errors[key][0]);
				}
			}
			self.error_message(e.responseJSON.message);
			
        }
    },
	error_message : function(e) {
		swal({
		  title: "Error",
		  text: String(e).initCap(),
		  // type: "error",
		  icon: "error",
  		  dangerMode: true,
		  button:"Ok"
		});
	},
	success_message : function(msg) {
		swal({
		  title: "Success",
		  text: String(msg).initCap(),
		  icon: 'success'
		});
	},
	logout: function() {
		var self = this;
		self.pre_loader('default-one', true);
		$.ajax({
			type: 'POST',
			url: main.base_url + 'logout',
			timeout: self.timeout,
			dataType: 'json',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', self.getCookie('token'));
			},
			success: function(newdata) {
				// var path = /*main.getCookie('path');*/ main.index_url;
				self.pre_loader(null,false);
				self.remove_tokens();

				location.href = main.main_path;
			},
			error: function(e) {
				self.pre_loader(null,false);
				// self.error_handler(e);
			}
		});
	},
	eraseCookie: function(name) {
		this.createCookie(name, "", -1);
	},
	remove_tokens: function() {
		var self = this,
			token = self.getCookie('token'),
			type = self.getCookie('permissions');
		if (token && type) {
			self.eraseCookie('io')
			self.eraseCookie('token');
			self.eraseCookie('permissions');
			self.eraseCookie('user_id');
		}
		sessionStorage.clear();
		
	},
	is_email: function(email) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		if (pattern.test(email)) {
			return true;
		} else {
			return false;
		}
	},
	is_name : function(name){
		var pattern = new RegExp(/^[a-z0-9 .\-,]+$/i);
		if(pattern.test(name))
			return true;
		else
			return false;
	},
	_auto_complete : function(mod,$el,type,url,str){
        let self = this; 
	    $el.autocomplete({ 
	     	minLength: 1, 
	     	appendTo : 'body',  
	     	source: debounce(function(request, response) { 
	        $.ajax({ 
	          type: type, 
	          url: url, 
	          dataType: 'JSON', 
              data : {
                [str] : $el.val()
              },
	          timeout: self.timeout, 
	          beforeSend: function(xhr) { 
	            xhr.setRequestHeader('Authorization', main.getCookie('token')); 
	          }, 
	          success: function(data_set) {
				// if(t ==  role){
					for(var key in data_set.data){
						// console.log(data_set.data[key].user_profile.f_name);
						$.extend(data_set.data[key],{label:String( 
														(data_set.data[key].permission == null ? 
														data_set.data[key].f_name + " " + data_set.data[key].l_name: data_set.data[key].permission) 
													)})
					}
	            response(data_set.data); 
	          }, 
	          error: function(e, t, m) { 
	            response(e.responseJSON);
	          } 
	        }); 
	      }, 250, false), 
			change: function(event, ui) {
				if(ui.item != null){
					if(mod=='role')
						$el.attr('data-id',ui.item.permission_type_id);  
					else
						$el.attr('data-id',ui.item.user_id);
				}
			}, 
			select: function(event, ui) { 
					if(mod== 'role'){
						$el.attr('data-id',ui.item.permission_type_id);  
					}
					else{
						$el.attr('data-id',ui.item.user_id);
					}
			} 
	    });
    },
	_render_permission_option : function($el,user_perm_id = null){
        let self = this,
            html = (user_perm_id ? '' : '<option disabled selected value="">Select A Role</option>');
        main.pre_loader('default', true);
        $.ajax({
            type : 'POST',
            url : main.base_url+'permission/role-auto',
            dataType: "JSON",
            timeout : main.timeout,
            // beforeSend : function (xhr) {
            //     xhr.setRequestHeader('Authorization', main.getCookie('token'));
            // },
            success : function(data_set){
                main.pre_loader(null,false);
					for(let k in data_set.data){
						html+=Mustache.render(__option_select_template,{
							'value' : data_set.data[k]['permission_type_id'],
							'attr' : data_set.data[k]['permission'],
							'name' : data_set.data[k]['permission'],
							'selected' : (data_set.data[k]['permission_type_id'] == user_perm_id ? "selected" : '')
						});
					}
                $el.html(html);
            },
            error : function(e, k, m){
                main.pre_loader(null,false);
                main.error_message(e.responseJSON.message);
            }
        });
    },
	multiple_list : function($el, url, requestType) {
		var self = this;
		$el.select2({
			tags: true,
			maximumSelectionSize: '',
			minimumResultsForSearch: Infinity,
			multiple: true,
			// minimumInputLength: 1,
			// placeholder: "Search " + requestType,
			ajax: {
			  type: 'post',
			  tags: false,
			  url: url,
			  allowClear: true,
			  dataType: 'json',
			  delay: 250,
			  params: {
				contentType: "application/json"
			  },
			  data: function (params) {
				
					return {permission: params.term}
				  
			  },
			  beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', self.getCookie('token'));
			  },	
			processResults: function(data) {
				return ({
				  results: $.map(data.data, function(item) {
								return [
									{
										"id" : item.permission_id,
										'text' : item.action_description
									}
								];
							})
				});
			  },
			  cache: false
			},
			createTag: function () {
				// Disable tagging
				return null;
			},
			templateResult: function(i) {
				return '<div data-attr='+ i.id +'>' + i.text + '</div>'
			}, 
			templateSelection: function(i) {
			  return '<span class="data-item" data-attr='+ i.id +'>' + i.text + '</span>';
			}, //Formats result that is selected
			dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
			escapeMarkup: function(m) {
				return m;
			  } 		
		});
	},
	icheck_render: function() {
		$('.i-check, .i-radio').iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'i-radio',
			increaseArea: '20%'
		});
	}
}
var main = new main_app(window.location.protocol);
main.initConfig();

String.prototype.initCap = function() {
	return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function(m) {
		return m.toUpperCase();
	});
};
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

