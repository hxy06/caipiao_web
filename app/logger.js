var log4js = require("log4js");
var config = require("./config");
module.exports = {
    /**
     * 初始化日志接口
     */
    configure: function () {
        log4js.configure(config.log4jsOptions);
    },
    /**
     * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
     * @param name 指定log4js配置文件中的category。依此找到对应的appender。
     *              如果appender没有写上category，则为默认的category。可以有多个
     * @returns {Logger}
     */
    logger: function (name,level) {
        var dateFileLog = log4js.getLogger(name);
        // dateFileLog.setLevel(level||config.log4jsOptions.defaultLevel);  todo  报错
        return dateFileLog;
    },
    /**
     * 用于express中间件，调用该方法前必须确保已经configure过
     * @returns {Function|*}
     */
    useLog: function (name,level) {
        return log4js.connectLogger(log4js.getLogger(name), {level: level||config.log4jsOptions.defaultLevel});
    }
}