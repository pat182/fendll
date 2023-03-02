let $body,$nav,$side_bar,$nav_left;
// let not_count = $('body').find('.extended-notifications li').length;
let start = function(){
    let self = this;
    $body = $('body');
    $nav = $body.find('#nav-accordion');
    $side_bar  = $body.find('#sidebar');
    $nav_left  = $body.find('.leftside-navigation');
    $btn_sidebar_toggle = $body.find(".btn-sidebar-toggle");
    eventer();
    let token = main.getCookie('token');
    
    let permissions = '';
    if(token != ''){
        permissions = JSON.parse(main.getCookie('permissions'));
        dashboard.init();
        users.init();
        permission.init();
        menu(permissions);
        app.run();
       
    }
    else{
        location.href = main.main_path;
    }
    // __socket = io.connect(__config.socket_url); 
    // __socket.on('server', function(data){

    //         not_count++;
    //         let html = '',
    //         counter = $body.find('.notifications-counter');
    //         counter.text(not_count);
    //         counter.show();
    //         html = Mustache.render(__notifications_template,{
    //             'username' : data.username,
    //             'activity' : data.action 
    //         });
    //         $body.find('.extended-notifications').append(html);
            
    // });
    $(window).resize(function(){
        if($(window).width() < 956){
            $btn_sidebar_toggle.removeClass("open");
            $("#main-content").removeClass("open");
            $side_bar.delay(300).removeClass("open");
        }else{
            if(!$btn_sidebar_toggle.hasClass('open')){
                $btn_sidebar_toggle.addClass("open");
                $("#main-content").addClass("open");
                $side_bar.delay(300).addClass("open");
            }
        }
    });
    // $body.find('.notifications-counter').hide();
    // $body.find('.sub-menu .sub').hide();
}
let eventer = function(){
    let self = this;
    $body.delegate('.sidebar-menu li', 'click',function(){
        $('.sidebar-menu li').find('.sub').hide();
        $(this).find('.sub').show();

    });
    $body.delegate(".btn-sidebar-toggle","click",function(){
        if($side_bar.hasClass("open")) {
            $btn_sidebar_toggle.removeClass("open");
            $("#main-content").removeClass("open");
            $side_bar.delay(300).removeClass("open");
        }
        else {
            $btn_sidebar_toggle.addClass("open");
            $("#main-content").addClass("open");
            $side_bar.delay(300).addClass("open");
        }
    });
    $body.delegate('.logout_user', 'click', function(e) {
        main.logout();
    });
    
}
let menu = function(perm){
    
    $nav.html(__admin_template);
    if ($.fn.dcAccordion) {
        $nav.dcAccordion({
            eventType: 'click',
            autoClose: true,
            saveState: true,
            disableLink: true,
            speed: 'slow',
            showCount: false,
            autoExpand: true,
            classExpand: 'dcjq-current-parent'
        });
    }
        if ($.fn.niceScroll) {
        $nav_left.niceScroll({
            cursorcolor: __primary_color,
            cursorborder: '0px solid #fff',
            cursorborderradius: '0px',
            cursorwidth: '3px'
        });
        $nav_left.getNiceScroll().resize();
        if ($side_bar.hasClass('hide-left-bar')) {
            $nav_left.getNiceScroll().hide();
        }
        $nav_left.getNiceScroll().show();
    }

    if(perm.length == 0 || perm[0].permission_type_id != 1 ){
        $side_bar.find('.menu-permissions').remove();
        $side_bar.find('.menu-user').remove();
    }
}
start();