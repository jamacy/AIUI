require([
    'js/init'
], function(){
    $.check();
    $.select();

    $.collapse();
    $("#myDialog").on("click",function(){
        var dia=$.dialog({
            title:'温馨提示',
            content:'温馨提示内容',
            button:["确认","取消"]
        });

        dia.on("dialog:action",function(e){
            console.log(e.index)
        });
        dia.on("dialog:hide",function(e){
            console.log("dialog hide")
        });
    });
    //loading十列
   /* var el=$.loading({
        content:'加载中...'
    })
    setTimeout(function(){
        el.loading("hide");
    },2000);
    el.on("loading:hide",function(){
        console.log("loading hide");
    });*/
    $("#myDialog2").on("click",function(){
        var el=$.loading({
            content:'加载中...'
        })
        setTimeout(function(){
            //el.loading("hide");
        },2000);
        el.on("loading:hide",function(){
            console.log("loading hide");
        });
    });
    $("#myDialog1").on("click",function(){
        var dia=$.dialog({
            title:'温馨提示',
            content:'温馨提示内容',
            button:["关闭"]
        });

        dia.on("dialog:action",function(e){
            console.log(e.index)
        });
        dia.on("dialog:hide",function(e){
            console.log("dialog hide")
        });
    });
    /********Tab案例*/
    var tabOptions={
        speedline:300,
        speedbox:500
    }
    $.tab("#tab1","tmb-on",0);
    $.tab("#tab2","tmb-on-bule",0,tabOptions);
    $.tab("#tab3","tmb-on-bule-inner",0,tabOptions);
    $.tab("#tab6","",1,tabOptions);
});