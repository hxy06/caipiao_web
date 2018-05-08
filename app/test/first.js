/**
 * Created by huangxiaoyan on 2018/4/11
 */
var express = require('express');
var router = express.Router();
var apiHelper = require("../../../instance/api-helper");

/**
 * @menu{url:"/demo/index.html",name:"示范菜单"}
 */
router.get("/index.html",function(req,res,next){
    res.render("test/demo");
});

router.post("/banner.do",function(req,res,next){
    console.log(22222222)
    apiHelper.getPlatformApi("banner", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});