/**
 * ajax 请求
 */
define(function (require, exports, module) {
    var Ajax = require("common/ajax-class");
    // var zyBase = require("common/base");
    // var PromptClass = require("projectCom/comPrompt/js/promptClass");
    // var i18nClass = require("instance/i18n");
    // var i18n = new i18nClass("common");
    // var util = require("common/util");
    zyBase.override(Ajax, {
        //统一错误提示
        /**
         *
         * @param res 后端返回的结果
         * @param config
         * errorTipCfg 错误配置信息json格式，具体参数说明如下
         *             errContent:后端code不是为"10000"，前端错误提示内容区域显示的自定义信息，默认为“未知错误”统一从后端的message读取，没有则读取此字段信息
         *             warnSureFn：方法；错误代码为10000，点击确定按钮后的方法。当需要用户确认的校验需要此方法
         *             warnCancelFn：方法；错误代码为10000，点击取消按钮后的方法。当需要用户确认的校验需要此方法
         */
        errorTip: function (res, config) {
            var code = res.code;
            var errCfg = config.errorTipCfg || {};
            switch (code) {
                case "10000":
                    var warnCfg = {
                        title: i18n.translate("warn", "警告"),
                        // content:res.data||i18n.translate("emptyReturnErr","无警告信息返回"),
                        type: "warn",
                        detailInfo: res.error,
                        buttons: [{
                            type: "sure",
                            text: i18n.translate("sure", "确定")
                        }]
                    };
                    var warnData = res.data, msg = "", checkName = "";
                    if (warnData && warnData.length > 0) {
                        for (var i = 0, j = warnData.length; i < j; i++) {
                            msg += warnData[i].message + "；<br>";
                        }
                        checkName = warnData[0].checkName;
                    }
                    msg += res.message;
                    warnCfg.content = msg || i18n.translate("emptyReturnErr", "无警告信息返回");
                    if (!util.isNull(checkName)) {
                        if(!util.isNull(warnData[0].fix) && warnData[0].fix=="1"){ //如果fix存在而且等于“1” 则表示有三个按钮“是”“否”“取消”
                            warnCfg.buttons =[{
                                type:"cancel",
                                text:i18n.translate("cancel","取消")
                            },{
                                type:"no",
                                text:i18n.translate("no","否")
                            },{
                                type:"yes",
                                text:i18n.translate("yes","是")
                            }];
                        }else {
                            warnCfg.buttons =[{
                                type:"cancel",
                                text:i18n.translate("cancel","取消")
                            },{
                                type:"sure",
                                text:i18n.translate("sure","确定")
                            }];
                        }
                        warnCfg.btnClickEve = function (type,dlg,e) {
                            if((type=="sure"||type=="yes")&&errCfg.warnSureFn){
                                errCfg.warnSureFn(warnData,e);
                            }else if(type=="no"&&errCfg.warnNoFn){
                                errCfg.warnNoFn(warnData,e);
                            }else if(type=="cancel"&&errCfg.warnCancelFn){
                                errCfg.warnCancelFn(warnData,e);
                            }
                        }
                    }
                    new PromptClass(warnCfg);
                    break;
                case "20000":
                    break;
                default:
                    new PromptClass({
                        title: i18n.translate("error", "错误"),
                        type: "error",
                        content: res.message ||errCfg.errContent|| i18n.translate("otherErr", "未知错误"),
                        detailInfo: res.error,
                        buttons: [{
                            type: "sure",
                            text: i18n.translate("sure", "确定")
                        }],
                        btnClickEve:function(type,dlg,e){
                            errCfg.errorSureFn && errCfg.errorSureFn(e);
                        }
                    });

            }

        }
    })
    module.exports = new Ajax({
        openParameter: true
    });
});