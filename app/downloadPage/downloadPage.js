/**
 * Created by huangxiaoyan on 2018/4/13
 */
var express = require('express');
var router = express.Router();
var apiHelper = require("../../../instance/api-helper");

router.get("/index.html",function(req,res,next){
    res.render("downloadPage/downloadPage");
});
