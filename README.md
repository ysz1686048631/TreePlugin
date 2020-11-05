
基于 Jq 的树形控件
jQuery插件的好处是封装功能，代码比原生Js更简洁，提高了代码的复用性，加快了开发速度；最近在复习JQ的时候，简单的写了一个基于Jquery的树形目录插件。
 * 其实在实际开发中一般树形目录都是用在后台管理系统界面中，对于像购物网站或者一些社交网站等等这些网站用的比较少的，可以说是基本不用。

 * 通过$.extend扩展属性或方法给jQuery/$直接被调用
 * 我们通过看Jquery的源码就会知道$.fn就是jQuery的原型，jQuery.fn = jQuery.prototype，$是jQuery的别名。$.fn.extend方法的作用是用于扩展jQuery实例对象，也就是我们从页面中获得的jQuery对象。
 * 其实实现起来不是很难， 咱们先分析一下关于树形目录的数据结构
   ```js
   [
       {
         title:'业务代码'
       },
       {
        title:'技术方向',
        children:[
                {
                    title:'三大框架',
                    children:[
                        {
                            title:'Vue'
                        },{
                            title:'React'
                        },{
                            title:'Angular'
                        }
                    ] 
                },
                {
                    title:'打包工具',
                }
        ]  
    }
   ]
   //我们会发现对象中有的只有一个title有的title和children都有，而且chilren下还有children,根据这种格式我是用的递归来做的，管他有多少层，我只考虑两层，这样事情就变的简单了。
   ```
 * 封装插件
   1. 数据初始化
    ```js
    
    $(function(){

        $.fn.TreePlugin = function(opions){
            opions = opions || {};
            function initTree(data,fa){
                //第一层先创建一个ul来做父级，这个ul会添加到$(this)中去$(this)是谁我已经在下面解释了，
                var $u = $("<ul></ul>");  
                    data.forEach((item,index)=>{
                    var $a = item.children?$("<a class='dome'><p>▷</p></a>"):$("<a class='no'></a>");
                    var $l = $('<li></li>');
                    $a.append(item.title);
                    $l.html($a);
                    $u.append($l);
                    if(item.children){
                        //第二层如果后面遍历的item种的children存在，那继续传给initTree函数执行，依次类推，直到data遍历完；
                        initTree(item.children,$l);
                    }  
                })
                //最后将元素添加到fa中去 ，刚开始fa代表的fa$(this),后面的fa就等于上边遍历对象中带有children的$l，
                $(fa).append($u);
            }
            //$(this)就是调用TreePlugin的元素我们通过这个元素起手，进行下面的操作；
            initTree(opions.data,$(this));
            }
            
    })  
        
    ```
    2. 添加事件
    ```js
    //这里不要像原生一样在遍历中添加事件，这样会出现事件叠加，每个元素会存在多个事件
    //这里为啥我使用on而不使用click 因为Jquery中的click是不能为新添加的元素添加事件的
    //on是可以将事件添加到新元素上的，它的执行有点类似于原生的事件委托。
    $('body').on('click','.dome', function(e){
            e.stopPropagation(); //取消联级反应，防止事件冒泡
            $(this).toggleClass('active').siblings('ul').slideToggle(opions.time);
        });
    ```   
   3. 完整代码
   ```js
   //css
    ul li{
          list-style: none;
          font-size: .8rem;
     }
     ul li .dome{
          
          cursor: pointer;
          display:flex;
          flex-direction: row;
          align-items: center;
     }
     ul li .dome p{
           display: inline-block;
           transform: rotate(0deg);
           transition: all .3s ease-in 0s;
           margin-right: .3rem;

     }
     .active p{

        transform: rotate(90deg) !important;
     }
     li>ul{
          display: none;
     } 
     .no{
         margin-left: .5rem;
         
     }
     .no::before{
         content: "";
         display: inline-block;
         width: .5rem;
         height: .5rem;
         background-color: aqua;
         margin-right: .3rem;
     }
   //html
   <div class="warp"></div>

   //js  
   //数据
   var obj = [
       {
              title:'Web前端工程师',
              children:[
                    {
                        title:'业务方向',
                        children:[
                                {
                                    title:'中后台管理系统' 
                                },
                                {
                                    title:'淘宝，京东等' 
                                }
                            ] 
                    },
                ]
          },
          {
              title:'Node工程师'
          }
   ]
 
    //插件
   $(function(){
    //option支持两个参数 data 数据 time 动画展开的时间 就是slideToggle的参数   
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
     //调用
   $(function(){
        $('.warp').TreePlugin({
          data:obj,
          time:300
          })  
    }) 
   ```
* ok 到这里我们树形目录插件就写完了,查看效果[传送门](https://ysz1686048631.github.io/TreePlugin/)。


 
