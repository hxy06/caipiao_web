/**
 * Created by huangxiaoyan on 2018/4/11
 */
var test=require("./test/routes");
var downloadPage=require("./downloadPage/routes");
exports.route=function(app){
    app.use("/test",test);
    app.use("/downloadPage",downloadPage);

};