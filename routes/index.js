var express = require('express');
var router = express.Router();
var apiHelper = require(".././app/api-helper");
var items=[{title:'文章1'},{title:'文章2'}];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{title:'文章列表',items:items});
});
//更多赛事页
router.get('/eventMore.html', function(req, res, next) {
    res.render('eventMore/eventMore');
});
//赛事详情页
router.get('/eventDetail.html', function(req, res, next) {
    res.render('eventMore/eventDetail');
});
//下载页
router.get('/downloadPage.html', function(req, res, next) {
    res.render('downloadPage/downloadPage');
});
//手机下载页
router.get('/phoneDownload.html', function(req, res, next) {
    res.render('downloadPage/phoneDownload');
});
//文章详情页
router.get('/articleDetails.html', function(req, res, next) {
    res.render('articleDetails/articleDetails');
});
//进入论坛
router.get('/forumlist.html', function(req, res, next) {
    res.render('forum/forumlist');
});
//图片精选
router.get('/forumWaterfall.html', function(req, res, next) {
    res.render('forum/forumWaterfall');
});
//首页轮播图
router.post('/banner.do', function(req, res, next) {
    apiHelper.getPlatformApi("banner", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//web精选频道
router.post('/findWebTopChannel.do', function(req, res, next) {
    apiHelper.getPlatformApi("findWebTopChannel", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//web精选频道
router.post('/findWebTopNewsList.do', function(req, res, next) {
    apiHelper.getPlatformApi("findWebTopNewsList", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//名人堂
router.post('/fameHall.do', function(req, res, next) {
    apiHelper.getPlatformApi("fameHall", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//论坛主题（频道）
router.post('/channelList.do', function(req, res, next) {
    apiHelper.getPlatformApi("channelList", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//论坛主题（频道）详情
router.post('/channelDetail.do', function(req, res, next) {
    apiHelper.getPlatformApi("channelDetail", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//文章详情
router.post('/forumDetail.do', function(req, res, next) {
    apiHelper.getPlatformApi("forumDetail", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//赔率公司
router.post('/findAllLottCpy.do', function(req, res, next) {
    apiHelper.getPlatformApi("findAllLottCpy", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
// 即时赛事
router.post('/instant.do', function(req, res, next) {
    apiHelper.getPlatformApi("instant", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
// 基本面
router.post('/basicPanel.do', function(req, res, next) {
    apiHelper.getPlatformApi("basicPanel", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
// 赔率盘
router.post('/oddsPanel.do', function(req, res, next) {
    apiHelper.getPlatformApi("oddsPanel", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
// 单个主题的帖子列表(全部、最新、历史)
router.post('/channelForumList.do', function(req, res, next) {
    apiHelper.getPlatformApi("channelForumList", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//阵容
router.post('/getSquad.do', function(req, res, next) {
    apiHelper.getPlatformApi("getSquad", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
//图例说明
router.post('/eventLiveLogoIlt.do', function(req, res, next) {
    apiHelper.getPlatformApi("eventLiveLogoIlt", null, function (err, ret) {
        res.send(ret);
    }, req, res);
});
module.exports = router;
