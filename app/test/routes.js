/**
 * Created by huangxiaoyan on 2018/4/11
 */
var first=require("./first");
exports.route=function(app){
    var path=app.locals.projectPath+"/test";
    app.use(path+"/first",first);
};