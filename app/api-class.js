var querystring = require("querystring");
var util = require("./util");
var appConfig = require("./config");
var apiHostMapping = require("./api-host-mapping");
var logger = require("./logger").logger('api-helper');
var request = require("request");
var sucCode = appConfig.page.successCode;
var defaultLangType=appConfig.page.defaultLangType;
var ApiHelper = function (config) {
    config = config || {};
    this.openAuth = config.openAuth || false;//true用密钥
    this.openParameter = config.openParameter || false;//true用parameter包装一层参数
}
ApiHelper.prototype = {
    constructor: ApiHelper,
    setHeaders: function (headers, req) {
        var apiUserInfo = appConfig.apiUserInfo;
        var userInfo = req.session ?req.session.userInfo : null;//获取用户信息
        headers = headers || {};
        var langType=req.cookies.langType||defaultLangType;
        headers.langType=encodeURI(langType);
        if (this.openAuth) {
            //headers.callTime = new Date().getTime();
            headers.apiKey = req.session ? req.session.apiKey:"";
            headers.requestId = new Date().getTime();
        }
        if(userInfo){
            if (apiUserInfo && apiUserInfo.length > 0) {
                for (var i = 0, j = apiUserInfo.length; i < j; i++) {
                    var va = userInfo[apiUserInfo[i]];
                    var key = apiUserInfo[i];
                    if (!util.isNull(va)) {
                        headers[key] = encodeURI(va);
                    }
                }
            }
         //TODO 为了兼容旧版页面，暂时在页面上还是显示，以免有问题，vue的公共文件commonjs.html，记得一并去掉
            var deptCode=req.get('deptCode')||userInfo.deptCode;
            if(deptCode){
                headers.deptCode = encodeURI(deptCode);
            }
        }
        return headers;
    },
    getApi: function (option, req, callBack) {
        var url = this.getUrl(option.pathAlias, option.protocol);
        // console.log(url)
        var par = {
            url: url,
            json: true,
            gzip: true

        }
        delete option.pathAlias;
        if (option.method == "GET") {
            if (par.url.indexOf("?") != -1) {
                par.url += "&" + option.parameter;
            } else {
                par.url += "?" + option.parameter;
            }
            delete option.parameter;
        }
        option = util.extend(par, option);//par中没有的才复制
        option.headers = this.setHeaders(option.headers, req);
        // console.log("----");
        // console.log(option);
        request(option, function (error, response, data) {
            // console.log(data);
            callBack(error, data, response);
        });
    },
    /**
     * 获取api接口端口及ip
     * @param pathAlias 接口别名
     * @returns {{host: string, port: string}}
     */
    getApiHost: function (pathAlias) {
        var api = apiHostMapping[pathAlias];
        var host = appConfig.apiPlatformUrl.host;
        var port = appConfig.apiPlatformUrl.port;
        //  apiList.forEach(function (api) {
        // if (path.indexOf(api.ctrlUrl) == 0) {
        host = util.typeOf(api.host) == 'undefined' ? host : api.host;
        port = util.typeOf(api.port) == 'undefined' ? port : api.port;
        //  }
        // })
        return {host: host, port: port, url: api.ctrlUrl};
    },
    /**
     * post 请求api
     * @param pathAlias
     * @param parameter
     * @param callBack
     * @param req
     * @param res
     */
    getPlatformApi: function (pathAlias, parameter, callBack, req, res) {
        parameter = this.getParams(parameter, req);
        var opt = {
            method: "POST",
            form: parameter,
            pathAlias: pathAlias
        }
        this.getPlatformApiBase(opt, callBack, req, res);
    },
    /**
     *get APi
     * @param pathAlias
     * @param parameter
     * @param callBack
     * @param req
     * @param res
     */
    getPlatformApiOfGet: function (pathAlias, parameter, callBack, req, res) {
        parameter = this.getParams(parameter, req);
        parameter = querystring.stringify(parameter);
        //if(path.indexOf("?")!=-1){
        //    path+="&"+parameter;
        //}else{
        //    path+="?"+parameter
        //}
        var opt = {
            method: "GET",
            pathAlias: pathAlias,
            parameter: parameter
        }
        this.getPlatformApiBase(opt, callBack, req, res);
    },
    getPlatformApiBase: function (opt, callBack, req, res) {
        var isAjaxRequest = req.param("isAjaxRequest");
        var _sel = this;
        var opt_b = {};
        opt_b = util.extend(opt_b, opt);
        this.getApi(opt, req, function (error, data, response) {
            if (error) {
                var er = {code: "nodeError", message: error.message};
                if (isAjaxRequest) {
                    res.send(er);
                } else {
                    res.render(appConfig.page.error, er);
                }
                var params = opt_b.method == 'GET' ? opt_b.parameter : JSON.stringify(opt_b.form);
                logger.error("错误信息：" + JSON.stringify(er) + ",URL:" + req.url + ",APIURL:" + _sel.getUrl(opt_b.pathAlias, opt_b.oprotocol) + ",参数:" + params);
            } else {
                // console.log(response.body.code)
                var er = {code: response.statusCode, message: "请求失败"};
                //console.log(response.statusCode+"-----------------");
                switch (response.statusCode) {

                    case 200:
                        if (data && data.code == sucCode) {
                            data.code = "success";
                            er.message = "";
                            logger.info("API调用信息：" + JSON.stringify(er) + ",URL:" + req.url + ",APIURL:" + _sel.getUrl(opt_b.pathAlias, opt_b.oprotocol));
                            callBack(null, data);
                        } else {
                            var code = data.code || "apiFormatError";
                            var message=data.message||"请求失败";
                            er = {code: code, message: message};
                            if(typeof(data)=="string"){//后端经常不按标准返回错误，直接把信息抛出
                                er.error=data;
                                data.error=data;
                            }
                            data.code=code;
                            data.message=message;
                            var params = opt_b.method == 'GET' ? opt_b.parameter : JSON.stringify(opt_b.form);
                            logger.error("错误信息：" + JSON.stringify(er) + ",URL:" + req.url + ",APIURL:" + _sel.getUrl(opt_b.pathAlias, opt_b.oprotocol) + ",参数:" + params);
                            if (isAjaxRequest) {
                                res.send(data);
                            } else {
                                res.render(appConfig.page.error, data);
                            }
                        }
                        break;
                    case 404:
                        if (isAjaxRequest) {
                            er.error=data||error||er.message;
                            res.send(er);
                        } else {
                            res.render(appConfig.page.noFind);
                        }
                        break;
                    default:
                        if (isAjaxRequest) {
                            res.send(er);
                        } else {
                            res.render(appConfig.page.error, er);
                        }

                }

            }

        })
    },
    /**
     * 组装参数
     * @param parameter 扩展的参数
     * @param req
     * @returns {*}
     */
    getParams: function (parameter, req) {
        var newPar = util.extend(req.body, req.query);
        if (parameter) {
            newPar = util.extend(newPar, parameter);
        }
        //todo  封装成一个对象  目前后端不需要
        // if (this.openParameter) {
        //     if (!newPar.parameter) {
        //         var paramStr = JSON.stringify(newPar);
        //         var isAjaxRequest = newPar.isAjaxRequest || false;
        //         newPar = {
        //             parameter: paramStr,
        //             isAjaxRequest: isAjaxRequest
        //         }
        //     }
        // }
        return newPar;
    },
    getUrl: function (pathAlias, protocol) {
        var api = this.getApiHost(pathAlias);
        protocol = protocol || "https";
        var url = protocol + "://" + api.host + api.port + api.url;
        // console.log(url);
        return url;
    }

}
module.exports = ApiHelper;