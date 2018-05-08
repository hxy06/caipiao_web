/**
 * Created by huangxiaoyan on 2018/4/13
 */
var downloadPage = require("./downloadPage");
exports.route=function(app){
    var path=app.locals.projectPath+"/downloadPage";
    app.use(path+"/downloadPage",downloadPage);
};