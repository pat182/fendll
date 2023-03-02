
var __admin_template = 
				        '<li class="menu-dashboard">\
				            <a href="#/dashboard" class="active" menu="dashboard">\
				                <i class="fa fa-dashboard"></i>\
				                <span>Dashboard</span>\
				            </a>\
				        </li>\
				        <li class="sub-menu menu-user">\
				            <a href="#/users" menu="user">\
				                <i class="fa fa-user"></i>\
				                <span>User Management</span>\
				            </a>\
							<ul class="sub">\
								<li class="menu-users">\
									<a href="#/users" menu="users">\
										<span">Users</span>\
									</a>\
								</li>\
							</ul>\
				        </li>\
						<li class="sub-menu menu-permissions">\
							<a href="#/permission" menu="permission">\
								<i class="fa fa-lock"></i>\
								<span>Manage Permissions</span>\
							</a>\
							<ul class="sub">\
								<li class="menu-role">\
									<a href="#/role" menu="role">\
										<span">Permission Group</span>\
									</a>\
								</li>\
							</ul>\
					</li>';
var __user_table = `<tr>
						<td style=''>{{user_id}}</td>
						<td style=''>{{username}}</td>
						<td style=''>{{first_name}}</td>
						<td style=''>{{last_name}}</td>
						<td style=''>{{permission}}</td>
						<td style=''>{{create_date}}</td>
						<td data-name='{{username}}' data-id='{{user_id}}' data-perm-id='{{perm_type_id}}'>
							<i title="Update User Permission" data-bs-toggle="modal" data-bs-target="#update-role-mdl" class="pointer user-action update-perm fa fa-edit"></i>
							<i title="Delete User" class="pointer user-action delete-user fa fa-trash"></i>
						</td>
					</tr>`;
var __option_select_template = '<option value="{{value}}" data-name="{{attr}}" {{selected}}>{{name}}</option>';


var __role_table = `<tr>
						<td class='width-200' style=''>{{permission_type_id}}</td>
						<td style=''>{{permission}}</td>
						<td class='text-center width-145' data-name='{{permission}}' data-id='{{permission_type_id}}'>
							<i title="Delete Permission" class="pointer perm-action delete-perm fa fa-trash"></i>
							<i title="View Users" data-bs-toggle="modal" data-bs-target="#view-users-mdl" class="pointer perm-action view-user-perm fa fa-user"></i>
						</td>
					</tr>`;
var __main_hml_role = `<div class='col-md-6 mm-role-box' data-main='{{role_id}}' margin-bottom-35>
							<div class ='col-md-12 role-head margin-bottom-35'>
								<h3>{{role}}</h3>
							</div>
							<div class='row check-containers'>
								{{{sub_hml_role}}}
							</div>
						</div>`;
var __sub_hml_role = `<div class='col-md-6 margin-bottom-25'>
						<label class="chk-lbl">{{action_description}}</label>
						<input class="i-check route-perm" type="checkbox" data-id='{{perm_id}}' {{checked}}/>
					</div>`;
var __pay_pal_template = `<div id="paypal-button-container"></div><script defer type="text/javascript" src="view/assets/js/paypal.js"><script>`;