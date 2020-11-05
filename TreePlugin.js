$(function(){
    /**
     * 
     * @param {Object} opions //data 数据  time 展开时间 
     */
    $.fn.TreePlugin = function(opions){
        opions = opions || {};
        function initTree(data,fa){
            var $u = $("<ul></ul>");  
                data.forEach((item,index)=>{
                var $a = item.children?$("<a class='dome'><p>▷</p></a>"):$("<a class='no'></a>");
                var $l = $('<li></li>');
                $a.append(item.title);
                $l.html($a);
                $u.append($l);
                if(item.children){
                    initTree(item.children,$l);
                }  
            })
            $(fa).append($u);
        }
        initTree(opions.data,$(this));
        $('body').on('click','.dome', function(e){
            e.stopPropagation();
            $(this).toggleClass('active').siblings('ul').slideToggle(opions.time);
        });
        }
        
   }) 