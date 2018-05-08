/**
 * Created by huangxiaoyan on 2018/4/11
 */

define(function (require, exports, module) {
    // var ajax = require("instance/ajax");
    var test = {
        init: function () {
            var _sel = this;
            $(function () {
                _sel.demo();
                var obj = {name: "zhangsan", age: 8, ace: 5, nbme: "lisi"};//要排序的对象
                var newObj = _sel.objKeySort(obj);
                console.log(newObj);
            });
        },
        demo:function () {
            var _sel = this;
            var parameter = {};
            parameter.time = Date.parse(new Date())/1000;
            parameter.locationId = 1;
            parameter = _sel.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/banner.do',
                data:parameter,
                success: function(data){
                    console.log(data)
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //排序的函数
        objKeySort:function (obj) {//排序的函数
            var newkey = Object.keys(obj).sort();
            //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
            var newObj = {};//创建一个新的对象，用于存放排好序的键值对
            for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
                newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
            }
            newObj.sign = this.signStrMd5(newObj);//加密
            return newObj;//返回排好序的新对象
        },
        //md5 组装密文字符串
        signStrMd5:function (obj) {
            var str = "";
            for(var name in obj){//遍历对象属性名
                str += name+"="+obj[name]+"&";
            }
            // 1b5c68449a9df94143f478121749c260 密钥
            str = str.substr(0,str.length-1)+"1b5c68449a9df94143f478121749c260";
            return $.md5(str);
        }
    };
    module.exports = test;
});

