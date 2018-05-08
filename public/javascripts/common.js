/**
 * Created by huangxiaoyan on 2018/4/18
 */
define(function (require, exports, module) {
    // var ajax = require("instance/ajax");
    var common = {
        init: function () {

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
        },
        //计算百分比
        percentage:function (number1, number2) {
            return (Math.round(number1 / number2 * 10000) / 100.00 + "%");// 小数点后两位百分比
        },
        //头部导航
        navigation:function (id) {
        },
        //解析url地址
        getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }
    };
    var nullUtil = {

        /**
         * 判断参数是否为null或者undefined或者""或者" "；(除去0的情况)
         */
        isNullOrEmpty: function(obj){
            var flag = false;
            if (obj == null || obj == undefined || typeof (obj) == 'undefined' || obj === '') {
                flag = true;
            } else if (typeof (obj) == 'string') {
                //obj = obj.trim();//IE6和7不支持
                var spaceRe = new RegExp("^[ ]+$");
                if (spaceRe.test(obj)) {//为空
                    flag = true;
                } else {//不为空
                    obj = obj.toUpperCase();
                    if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
                        flag = true;
                    }
                }
            }
            else {
                flag = false;
            }
            return flag;
        },

        /**
         * 判断参数是否为null或者undefined
         */
        isNull: function(obj){
            var flag = false;
            if (obj == null || obj == undefined || typeof (obj) == 'undefined') {
                flag = true;
            }
            return flag;
        },

        /**
         * 判断对象是否为空对象，即{}
         */
        isEmptyObject: function(obj){
            for(var n in obj){return false}
            return true;
        },

        /**
         * 判断数组是否不为空且有值
         */
        havaArray: function(obj){
            var flag = false;
            if (obj!=null && obj.length>0) {
                flag = true;
            }
            return flag;
        }
    };
    /**
     * Date对象方法扩展
     */
    $.extend(Date.prototype,{

        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
        // 例子：
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        // var time1 = new Date().Format("yyyy-MM-dd hh:mm:ss");
        // var time2 = new Date().Format("yyyy-MM-dd");
        // var time3 = new Date("2012-12-12").Format("yyyy-MM-dd hh:mm:ss");
        Format: function(fmt) {
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        },

        //日期加减
        //<param name="datepart" type="string">
        //日期加减的部分:
        //Year, yy, yyyy--年
        //quarter, qq, q --季
        //Month, mm, m --    月
        //dayofyear, dy, y--    日
        //Day, dd, d --    日
        //Week, wk, ww --    周
        //Hour, hh --    小时
        //minute, mi, n --    分钟
        //second, ss, s --    秒
        //millisecond, ms --    毫秒
        //</param>
        //<param name="number" type="int">
        //要加减的数量
        //</param>
        //<param name="returnNewObjec" type="bool">
        //若参数为true值，则操作结果由一个新的日期对象返回，原日期对象不变；
        //否则返回的是原日期对象,此时原日期对象的值是操作结果.
        //</param>
        //<returns type="Date">返回一个日期对象
        //调用例子：new Date().add('dayofyear',1,true)
        add: function(datepart, number, returnNewObjec) {

            datepart = datepart.toLowerCase();
            var tDate;
            if (typeof (returnNewObjec) == "boolean") {
                if (returnNewObjec == true) {
                    tDate = new Date(this);
                }
                else { tDate = this; }
            }
            else { tDate = this; }

            switch (datepart) {
                case "year":
                case "yy":
                case "yyyy":
                    tDate.setFullYear(this.getFullYear() + number);
                    break;
                case "quarter":
                case "qq":
                case "q":
                    tDate.setMonth(this.getMonth() + (number * 3));
                    break;
                case "month":
                case "mm":
                case "m":
                    tDate.setMonth(this.getMonth() + number);
                    break;
                case "dayofyear":
                case "dy":
                case "y":
                case "day":
                case "dd":
                case "d":
                    tDate.setDate(this.getDate() + number);
                    break;
                case "week":
                case "wk":
                case "ww":
                    tDate.setDate(this.getDate() + (number * 7));
                    break;
                case "hour":
                case "hh":
                    tDate.setHours(this.getHours() + number);
                    break
                case "minute":
                case "mi":
                case "n":
                    tDate.setMinutes(this.getMinutes() + number);
                    break
                case "second":
                case "ss":
                case "s":
                    tDate.setSeconds(this.getSeconds() + number);
                    break;
                case "millisecond":
                case "ms":
                    tDate.setMilliseconds(this.getMilliseconds() + number);
                    break;
            }
            return tDate;
        },

        //计算开始日期与当前日期的差,返回差的绝对值。
        //<param name="datepart" type="string">
        //日期加减的部分:
        //Year, yy, yyyy--年 ;
        //quarter, qq, q --季
        //Month, mm, m --    月
        //dayofyear, dy, y--    日
        //Day, dd, d --    日
        //Week, wk, ww --    周
        //Hour, hh --    小时
        //minute, mi, n --    分钟
        //second, ss, s --    秒
        //millisecond, ms --    毫秒
        //</param>
        //<param name="beginDate" type="DateTime">
        //要用于比较的日期
        //</param>
        //<returns type="int">
        //返回日期差的绝对值。
        //</returns>
        //调用例子：new Date().dateDiff('dayofyear',new Date('2014-9-26'))
        dateDiff: function(datepart, beginDate) {
            datepart = datepart.toLowerCase();
            var yearDiff = Math.abs(this.getFullYear() - beginDate.getFullYear());
            switch (datepart) {
                case "year":
                case "yy":
                case "yyyy":
                    return yearDiff;
                case "quarter":
                case "qq":
                case "q":
                    var qDiff = 0;
                    switch (yearDiff) {
                        case 0:
                            qDiff = Math.abs(this.getSeason() - beginDate.getSeason());
                            break;
                        case 1:
                            qDiff = (this.getSeason() - new Date(this.getFullYear(), 0, 1).getSeason()) +
                                (new Date(beginDate.getFullYear(), 11, 31).getSeason() -
                                    beginDate.getSeason()) + 1;
                            break;
                        default:
                            qDiff = (this.getSeason() - new Date(this.getFullYear(), 0, 1).getSeason()) +
                                (new Date(beginDate.getFullYear(), 11, 31).getSeason() -
                                    beginDate.getSeason()) + 1 + (yearDiff - 1) * 4;
                            break;
                    }
                    return qDiff;
                case "month":
                case "mm":
                case "m":
                    var monthDiff = 0;
                    switch (yearDiff) {
                        case 0:
                            monthDiff = Math.abs(this.getMonth() - beginDate.getMonth());
                            break;
                        case 1:
                            monthDiff = (this.getMonth() - new Date(this.getFullYear(), 0, 1).getMonth()) +
                                (new Date(beginDate.getFullYear(), 11, 31).getMonth() -
                                    beginDate.getMonth()) + 1;
                            break;
                        default:
                            monthDiff = (this.getMonth() - new Date(this.getFullYear(), 0, 1).getMonth()) +
                                (new Date(beginDate.getFullYear(), 11, 31).getMonth() -
                                    beginDate.getMonth()) + 1 + (yearDiff - 1) * 12;
                            break;
                    }
                    return monthDiff;
                case "dayofyear":
                case "dy":
                case "y":
                case "day":
                case "dd":
                case "d":
                    return Math.abs((this.setHours(0, 0, 0, 0) - beginDate.setHours(0, 0, 0, 0)) / 1000 / 60 / 60 / 24);
                case "week":
                case "wk":
                case "ww":
                    var weekDiff = 0;
                    switch (yearDiff) {
                        case 0:
                            weekDiff = Math.abs(this.getWeek() - beginDate.getWeek());
                            break;
                        case 1:
                            weekDiff = (this.getWeek() - new Date(this.getFullYear(), 0, 1).getWeek()) +
                                (new Date(beginDate.getFullYear(), 11, 31).getWeek() -
                                    beginDate.getWeek()) + 1;
                            break;
                        default:

                            weekDiff = (this.getWeek() - new Date(this.getFullYear(), 0, 1).getWeek()) +
                                (new Date(beginDate.getFullYear(), 11, 31).getWeek() -
                                    beginDate.getWeek()) + 1;
                            var thisYear = this.getFullYear();
                            for (var i = 1; i < yearDiff; i++) {
                                weekDiff += new Date(thisYear - i, 0, 1).getWeeksOfYear();
                            }
                            break;
                    }
                    return weekDiff;
                case "hour":
                case "hh":
                    return Math.abs((this - beginDate) / 1000 / 60 / 60);
                case "minute":
                case "mi":
                case "n":
                    return Math.abs((this - beginDate) / 1000 / 60);
                case "second":
                case "ss":
                case "s":
                    return Math.abs((this - beginDate) / 1000);
                case "millisecond":
                case "ms":
                    return Math.abs(this - beginDate);
            }
        }
    });
    /**
     * Date静态方法扩展
     */
    $.extend(Date,{
        /**
         * 获取格式化时间（根据时间戳）
         */
        formatTime: function(time, fmt) {
            if(nullUtil.isNullOrEmpty(time)){
                return "";
            }
            if(nullUtil.isNullOrEmpty(fmt)){
                fmt = "yyyy-MM-dd";
            }
            return new Date(time).Format(fmt);
        },
        /**
         * 获取当前时间（YYYY-MM-DD）
         */
        getNowDate: function() {
            var nowDate = new Date();
            var temp = nowDate.getFullYear()+'-'+(nowDate.getMonth() >= 9?(nowDate.getMonth() + 1):'0'+(nowDate.getMonth() + 1))+'-'+(nowDate.getDate()>=10?nowDate.getDate():'0'+nowDate.getDate());
            return temp;
        },

        /**
         * 字符串日期转换为日期格式，或者直接new Date('2012-12-12')
         */
        str2Date: function(dateN) {
            var dateTemp = new Date(Date.parse(dateN.replace(/-/g, "/")));
            return dateTemp;
        },

        /**
         * 字符串日期转换为日期格式（兼容时间戳、时分秒以及IE浏览器等形式）
         */
        strToDate: function(strDate) {
            if (!!window.ActiveXObject || "ActiveXObject" in window){
                if(!isNaN(strDate)){
                    return new Date(strDate);
                }else{
                    if(strDate.indexOf(" ")!=-1){
                        return newDateAndTime(strDate);
                    }else{
                        return newDate(strDate);
                    }
                }
            }else{
                return new Date(strDate);
            }
        },

        /**
         * 获取当月最后一天是几号，例：getLastDay(2013,11)
         */
        getLastDay: function(year,month) {
            var new_year = year;    //取当前的年份
            var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
            if(month>12)            //如果当前大于12月，则年份转到下一年
            {
                new_month -=12;        //月份减
                new_year++;            //年份增
            }
            var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天
            var date_count =   (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月的天数
            var last_date =   new Date(new_date.getTime()-1000*60*60*24);//获得当月最后一天的日期
            return date_count;
        }
    });
    module.exports = common;
});