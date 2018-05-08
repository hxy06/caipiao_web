/**
 * Created by huangxiaoyan on 2018/4/17
 */

define(function (require, exports, module) {
    var common = require("../common");
    var index = {
        init: function () {
            var _sel = this;
            $(function () {
                common.navigation();
                _sel.getBanner();
            });
        },
        initAfter:function(){
            var _sel = this;
            _sel.getChannelList();
            _sel.getLatestNews();
            _sel.getPicturesSel();
            _sel.instant();
            // _sel.getFameHall();  todo 先隐藏
            // _sel.getAllLottCpy();
            _sel.eventEvent();
            _sel.newsEvent();
            _sel.otherEvent();
        },
        //其他事件绑定
        otherEvent:function(){
            $(".TriangleText").on("click",function () {
                window.location.href="/forumlist.html";
            });
            $("body").on("click",".ArticleDetails",function () {
                window.location.href="/articleDetails.html?newId="+$(this).attr("data-newid");
            })
            $("body").on("click",".EventDetails",function () {
                window.location.href="/eventDetail.html?matchId="+$(this).attr("data-matchId");
            })
        },
        //获取首页轮播图
        getBanner:function(){
            var _sel = this;
            var parameter = {};
            parameter.time = Date.parse(new Date())/1000;
            parameter.locationId = 1;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/banner.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var bannerHtml = [];
                    var bannerItemHtml = [];
                    var bannerData = data.data;
                    for(var i= 0,len=bannerData.length;i<4;i++){
                        var className = "";
                        if(i==0){
                            className = "active";
                        }else {
                            className = "";
                        }
                        bannerHtml.push('<li data-target="#myCarousel" data-slide-to="'+i+'" class="'+className+'"></li>');
                        bannerItemHtml.push(
                            '<div class="item '+className+'">' +
                            '   <img src="'+bannerData[i].imgUrl+'">' +
                            '   <div class="carousel-caption">'+bannerData[i].title+'</div>' +
                            '</div>'
                        )
                    }
                    var bannerDateHtml = bannerHtml.join('');
                    var bannerItemDateHtml = bannerItemHtml.join('');
                    $(".Indicators").html(bannerDateHtml);
                    $(".CarouselInner").html(bannerItemDateHtml);
                    _sel.initAfter();//轮播图优先渲染
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //新闻推荐事件绑定
        newsEvent:function () {
            var _sel = this;
            var $NewsListItem = $('.NewsListItem');
            var $NewsColumn = $(".NewsColumn");
            //鼠标滑过事件
            $NewsListItem.on("mouseover", ".NewsItem", function (event) {
                $(this).find(".news-title").addClass("news-title-hover");
                $(this).find(".news-user-info").show();
            });
            $NewsListItem.on("mouseout", ".NewsItem", function (event) {
                $(this).find(".news-title").removeClass("news-title-hover");
                $(this).find(".news-user-info").hide();
            });
            $NewsColumn.on("click", "li", function (e) {
                $(this).addClass("selected").siblings().removeClass("selected");
                _sel.getChannelForum($(this).attr("data-id"));
            });
        },
        //赛事推荐中心事件绑定
        eventEvent:function(){
            var _sel = this;
            var $EventItems = $('.event-list');
            $EventItems.on("click",".event-item",function (e) {
                _sel.getBasicPanel($(this).attr("data-matchId"),$(this));
            });
            $('body').on("click",".Bets",function (e) {
                $(this).addClass("selected").siblings().removeClass("selected");
                var dataType =$(this).attr("data-type");
                if(dataType=="view"){
                    console.log("todo")
                    // _sel.getAppEventViews($(".event-item.selected").attr("data-matchId"))
                }else {
                    _sel.getOddsPanel($(".event-item.selected").attr("data-matchId"),dataType);
                }
            });
        },
        //最新新闻
        latestNews:function () {
            /** 插件carouFredSel参数说明
             *
             参数名     默认值     说明
             circular     true     循环模式，true为无限循环，false为单轮循环。
             infinite     true     是否启用循环，默认起用。当circular设置为false的时候，再把infinite设置为false，就可以关闭循环。
             direction     "left"     滚动方向，可选值："right", "left", "up" , "down".
             width     null     内容的宽度，如果为null，宽度自动计算
             height     null     内容的高度，如果为null，高度自动计算
             padding     0     内容区域的padding
             items     5     显示个数。默认显示5个。
             scroll     默认等于显示的个数     一次滚动个数。
             auto     true     是否自动播放。设置成false，不自动播放。
             prev     null     指定某一元素控制内容向前
             next     null     指定某一元素控制内容向后
             */
            $('.Carousel ul').carouFredSel({
                prev: '.Prev',
                next: '.Next',
                scroll: 1000,
                auto:false,
            });
        },
        //获取最新新闻
        getLatestNews:function () {
            var _sel = this;
            var parameter = {};
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/findWebTopNewsList.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var newsHtml = [];
                    var newsData = data.data;
                    for(var i= 0,len=newsData.length;i<len;i++){
                        newsHtml.push(
                            '<li class="ArticleDetails" data-newid="'+newsData[i].newsId+'"> ' +
                            '<div class="title" >' +
                            '   <img src="'+newsData[i].imgUrl+'"><span>福彩3D</span>' +
                            '</div> ' +
                            '<div>'+
                            '   <div class="news-ul">' +
                            '   <span class="num">1</span>' +
                            '   <span class="num-title">福彩3D断路周期研究</span>' +
                            '   </div>'+
                            '</div> ' +
                            '</li>');
                    }
                    var newsDateHtml = newsHtml.join('');
                    $(".CarouselUl").html(newsDateHtml);
                    _sel.latestNews();//初始化轮播
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取论坛主题（频道）
        getChannelList:function(){
            var _sel = this;
            var parameter = {};
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/findWebTopChannel.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var newsHtml = [];
                    var newsData = data.data;
                    for(var i= 0,len=newsData.length;i<len;i++){
                        if(i==0){
                            newsHtml.push(
                                '<li class="selected" data-id="'+newsData[i].channelId+'"> ' + newsData[i].channelName +'</li>');
                        }else {
                            newsHtml.push(
                                '<li data-id="'+newsData[i].channelId+'"> ' + newsData[i].channelName +'</li>');
                        }
                    }
                    var newsDateHtml = newsHtml.join('');
                    $(".NewsList").html(newsDateHtml);
                    _sel.getChannelForum(newsData[0].channelId)
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取赔率公司  todo
        getAllLottCpy:function(){
            var _sel = this;
            var parameter = {};
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/findAllLottCpy.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取基本面
        getBasicPanel:function(id,$dom){//比赛id:id,插入细表的dom节点：$dom
            var _sel = this;
            var parameter = {};
            parameter.matchId = id;
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/basicPanel.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var detailsHtml = [];
                    var detailsData = data.data;
                    // 历史交锋胜率
                    var hisRateWin="50%",hisRateLost="50%";
                    //最近6场 主队
                    var tolScore = 0,winScore = 0,loseScore = 0;
                    var strMatchRst = "";
                    //最近6场 客队
                    var tolScoreAway = 0,winScoreAway = 0,loseScoreAway = 0;
                    var strMatchRst = "",strAwayMatchRst="";
                    //右边胜率数据填充
                    if(detailsData.vs.battle==null||detailsData.vs.battle==undefined||detailsData.vs.battle==""){

                    }else {
                        var tol = detailsData.vs.tolLost + detailsData.vs.tolWon;
                        // 历史交锋胜率
                        hisRateWin = common.percentage(detailsData.vs.tolWon,tol);
                        hisRateLost = common.percentage(detailsData.vs.tolLost,tol);
                    }
                    if(detailsData.homeVs.battle==null||detailsData.homeVs.battle==undefined||detailsData.homeVs.battle==""){

                    }else {
                        var homeBattleList = detailsData.homeVs.battle;
                        //最近六场比赛结果 主
                        for (var i=0;i<6&&i<homeBattleList.length-1;i++){
                            switch (homeBattleList[i].matchRst){
                                case 1:
                                    strMatchRst += '<span class="red-text">W</span>';
                                    break;
                                case 0:
                                    strMatchRst += '<span class="green-text">D</span>';
                                    break;
                                case -1:
                                    strMatchRst += '<span class="blue-text">L</span>';
                                    break;
                            }
                            loseScore += homeBattleList[i].awayScore;
                            winScore += homeBattleList[i].homeScore;
                            if(i!=5){
                                strMatchRst += '<span>-</span>';
                            }
                        }
                    }
                    if(detailsData.awayVs.battle==null||detailsData.awayVs.battle==undefined||detailsData.awayVs.battle==""){

                    }else {
                        var awayBattleList = detailsData.awayVs.battle;
                        //最近六场比赛结果 客
                        for (var i=0;i<6&&i<awayBattleList.length-1;i++){
                            switch (awayBattleList[i].matchRst){
                                case 1:
                                    strAwayMatchRst += '<span class="red-text">W</span>';
                                    break;
                                case 0:
                                    strAwayMatchRst += '<span class="green-text">D</span>';
                                    break;
                                case -1:
                                    strAwayMatchRst += '<span class="blue-text">L</span>';
                                    break;
                            }
                            loseScoreAway += awayBattleList[i].awayScore;
                            winScoreAway += awayBattleList[i].homeScore;
                            if(i!=5){
                                strAwayMatchRst += '<span>-</span>';
                            }
                        }
                        // 最近6场比赛进球数
                        var winScoreHome = common.percentage(winScore,winScore+winScoreAway);
                        // 最近6场比赛失利数
                        var loseScoreHome = common.percentage(loseScore,loseScore+loseScoreAway);
                    }
                    detailsHtml.push(
                        '<div class="event-details">' +
                        '   <div class="details-left">' +
                        '       <ul>',
                        '           <li class="Bets selected" data-type="eu">欧赔</li>',
                        '           <li class="Bets" data-type="asia">竞猜亚盘</li>',
                        '           <li class="Bets" data-type="bs">大小盘</li>',
                        '           <li class="Bets" data-type="view">观点</li>',
                        '       </ul>',
                        '       <div class="TableDiv">',
                        '       </div>' +
                        '</div>',
                        '   <div class="details-right">',
                        '       <div class="details-team">',
                        '                                <div class="team-left">',
                        '                                    <img src="'+ detailsData.homeLogo +'">',
                        '                                    <div>'+ detailsData.homeNm +'</div>',
                        '                                </div>',
                        '                                <div class="team-vs">',
                        '                                    <img src="./stylesheets/index/images/vs.png">',
                        '                                </div>',
                        '                                <div class="team-left">',
                        '                                    <img src="'+ detailsData.awayLogo +'">',
                        '                                    <div>'+ detailsData.awayNm +'</div>',
                        '                                </div>',
                        '                            </div>',
                        '                            <div class="win-rate">',
                        '                                <div>历史交锋胜率</div>',
                        '                                <div class="progress-div">',
                        '                                    <div class="progress-value ProgressValue">'+ hisRateWin +'</div>',
                        '                                    <div class="progress">',
                        '                                        <div class="progress-bar" style="width:'+ hisRateWin +'"></div>',
                        '                                    </div>',
                        '                                    <div class="progress-value ProgressValue">'+ hisRateLost +'</div>',
                        '                                    <div style="clear: both"></div>',
                        '                                </div>',
                        '                            </div>',
                        '                            <div class="win-rate">',
                        '                                <div>最近6场比赛进球数</div>',
                        '                                <div class="progress-div">',
                        '                                    <div class="progress-value ProgressValue">'+ winScore+'</div>',
                        '                                    <div class="progress">',
                        '                                        <div class="progress-bar" style="width:'+ winScoreHome +'"></div>',
                        '                                    </div>',
                        '                                    <div class="progress-value ProgressValue">'+ winScoreAway+'</div>',
                        '                                    <div style="clear: both"></div>',
                        '                                </div>',
                        '                            </div>',
                        '                            <div class="win-rate">',
                        '                                <div>最近6场比赛失利数</div>',
                        '                                <div class="progress-div">',
                        '                                    <div class="progress-value ProgressValue">'+ loseScore+'</div>',
                        '                                    <div class="progress">',
                        '                                        <div class="progress-bar" style="width:'+ loseScoreHome +'"></div>',
                        '                                    </div>',
                        '                                    <div class="progress-value ProgressValue">'+ loseScoreAway+'</div>',
                        '                                    <div style="clear: both"></div>',
                        '                                </div>',
                        '                            </div>',
                        '                            <div class="win-rate">',
                        '                                <div>最近6场比赛战绩</div>',
                        '                                <div class="win-span">',
                        '                                    <span class="win-left">'+strMatchRst+'</span>',
                        '                                    <span class="win-right">'+strAwayMatchRst+'</span>',
                        '                                </div>',
                        '                            </div>',
                        '                            <div class="win-last">',
                        '                                （右边为最近一场比赛赛果，w-赢，D-平，L-输）',
                        '                            </div>',
                        '                        </div>',
                        '</div>');
                    var detailsDateHtml = detailsHtml.join('');
                    $dom.addClass("selected").parent().siblings().find(".event-item").removeClass("selected");
                    $(".event-details").remove();
                    $dom.after(detailsDateHtml);
                    _sel.getOddsPanel(id,"eu");//默认选择欧赔
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取及时赛事
        instant:function(){
            var _sel = this;
            var parameter = {
                companyId:2,
                page:1,
                limit:5
            };
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/instant.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var eventHtml = [];
                    var eventData = data.data;
                    for(var i= 0,len=eventData.length;i<5 && i<len;i++){
                        eventHtml.push(
                            ' <div class="event-items">' +
                            '   <div class="event-item" data-matchId="'+eventData[i].matchId+'">' +
                            '   <div class="event-info">' +
                            '   <div class="event-left event-time">'+ Date.formatTime(eventData[i].matchTime*1000,'hh:mm') + '</div>' +
                            '<div class="event-left event-time">'+ Date.formatTime(eventData[i].matchTime*1000,'MM-dd') + '</div> ' +
                            '<div class="event-left event-name"><img src="'+ eventData[i].event.logo +'">'+ eventData[i].event.shortNameZh +'</div>' +
                            '<div class="event-left event-team ellipsis" title="'+ eventData[i].homeTeam.nameZh+'VS'+eventData[i].visitingTeam.nameZh +'">'+eventData[i].homeTeam.nameZh+'VS'+eventData[i].visitingTeam.nameZh+'</div>' +
                            '<div class="event-left event-rate">' +
                            // '<div>主胜</div>' +
                            // '<div class="red-font">62%</div>' +
                            '</div>' +
                            '<div class="event-left event-rate">' +
                            // '<div>主平</div>' +
                            // '<div class="green-font">62%</div>' +
                            '</div>' +
                            '<div class="event-left event-rate">' +
                            // '<div>主输</div>' +
                            // '<div class="blue-font">62%</div>' +
                            '</div>' +
                            // '<div class="event-left event-icon">' +
                            // ' <i class="iconfont icon-collection_fill star-i"></i>' +
                            // '</div>' +
                            '<div class="event-left event-icon EventDetails" data-matchId="'+eventData[i].matchId+'" title="点击查看更多详情">' +
                            ' <i class="iconfont icon-post"></i>' +
                            '</div>' +
                            '</div>' +
                            '</div></div>')
                    }
                    var eventDateHtml = eventHtml.join('');
                    $(".EventList").html(eventDateHtml);
                    $(".event-item:first").addClass("selected");
                    _sel.getBasicPanel(eventData[0].matchId,$(".event-item:first"));
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取图片精选
        getPicturesSel:function(){
            var _sel = this;
            var parameter = {opid:1};
            parameter.channelId = 8;
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/channelForumList.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var picHtml = [];
                    var num = 8;
                    var channelForumList = data.data.topForumList;
                    num -= channelForumList.length;
                    var img = "";
                    for (var i=0,len=channelForumList.length;i<len;i++){
                        if(channelForumList[i].forumImgs.length==0){
                            img = "./stylesheets/index/images/football-3285088_640.png";
                        }else {
                            img = channelForumList[i].forumImgs[0].imgUrl;
                        }
                        picHtml.push(
                            '<li style="background: url('+img+') no-repeat;background-size: cover;background-position: center;">' +
                            '<div class="news-title">'+channelForumList[i].title+'</div> ' +
                            '</li>'
                        )
                    }
                    channelForumList = data.data.channelForumList;
                    for (var i=0,len=channelForumList.length;i<len && i<num;i++){
                        if(channelForumList[i].forumImgs.length==0){
                            img = "./stylesheets/index/images/football-3285088_640.png";
                        }else {
                            img = channelForumList[i].forumImgs[0].imgUrl;
                        }
                        picHtml.push(
                            '<li style="background: url('+img+') no-repeat;background-size: cover;background-position: center;">' +
                            '<div class="news-title">'+channelForumList[i].title+'</div> ' +
                            '</li>'
                        )
                    }
                    var picDateHtml = picHtml.join('');
                    $(".PicturesSelected").html(picDateHtml);
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取论坛详情（足友反馈，大力神杯，精彩人生）
        getChannelForum:function(id){
            var _sel = this;
            var parameter = {opid:1};
            parameter.channelId = id;
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/channelForumList.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var channelHtml = [];
                    var channelForumList = data.data.channelForumList;
                    for (var i=0;i<4&&i<channelForumList.length;i++){
                        var img = "";
                        if(channelForumList[i].forumImgs.length==0){
                            img = "./stylesheets/index/images/football-3285088_640.png";
                        }else {
                            img = channelForumList[i].forumImgs[0].imgUrl;
                        }
                        channelHtml.push(
                            '<li class="NewsItem ArticleDetails" data-newid="'+channelForumList[i].newsId+'" style="background: url('+ img +');background-size: cover;background-position: center;"> ' +
                                '<div class="news-title">'+channelForumList[i].title+'</div> ' +
                                '<div class="news-user-info"> ' +
                                    '<div class="user-head" style="background: url('+ channelForumList[i].headerPic+');background-size: cover;background-position: center;"></div> ' +
                                    '<div class="user-name"> ' +
                                        '<div class="ellipsis" title="'+channelForumList[i].username+'">'+channelForumList[i].username+'</div> ' +
                                        '<div class="user-date">'+channelForumList[i].createTime.substring(0,10)+'</div> ' +
                                    '</div> ' +
                                    '<div class="user-tool"> ' +
                                        '<span class="tool tool-first"> ' +
                                        '<i class="iconfont icon-yuedu"></i> ' +
                                        '</span> ' +
                                        '<span class="tool tool-two"> ' +
                                        '<i class="iconfont icon-appreciatefill"></i> ' +
                                        '</span> ' +
                                        '<span class="tool tool-three"> ' +
                                        '<i class="iconfont icon-message_fill_light"></i> ' +
                                        '</span> ' +
                                    '</div> ' +
                                '</div>' +
                            '</li>'
                        )
                    }
                    var channelDateHtml = channelHtml.join('');
                    $(".NewsListItem").html(channelDateHtml);
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //名人堂
        getFameHall:function(){
            var _sel = this;
            var parameter = {};
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/fameHall.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var fameHtml = [];
                    var hitTableList = data.data.hitTable;
                    fameHtml.push('<div class="crown"></div>');
                    for (var i=0,len=hitTableList.length;i<len;i++){
                        fameHtml.push(
                            '<div class="user-info user'+i+'"> ' +
                            '<div class="user-head" style="background: url('+hitTableList[i].headerPic+');background-size: cover;background-position: center;"></div> ' +
                            '<div class="user-title">'+hitTableList[i].username+'</div> ' +
                            '<div class="user-rate">周命中率'+hitTableList[i].hitRate+'</div> ' +
                            '</div>'
                        )
                    }
                    var fameDateHtml = fameHtml.join('');
                    $(".HeadFame").html(fameDateHtml);
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取赔率盘
        getOddsPanel:function (id,oddsType) {//比赛id,oddsType赔率类型（asia：亚盘 eu：欧指 bs：大小球）
            var _sel = this;
            var parameter = {};
            parameter.matchId = id;//测试数据  (2214103:asia/2442832:eu/2214103:bs)
            parameter.oddsType = oddsType;
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/oddsPanel.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    var oddsHtml = [];
                    if(data.data.odds==null||data.data.odds==undefined||data.data.odds==""){
                        oddsHtml.push(
                            '<table class="details-table-th">' +
                            '<tr>',
                            '   <th class="no-data">暂无数据</th>',
                            '</tr>' +
                            '</table>');
                    }else {
                        var oddsData = data.data.odds;
                        if(oddsType=="asia"){//亚盘
                            oddsHtml.push(
                                '<table class="details-table-th">' +
                                '   <tr>',
                                '       <th class="th-width4">公司</th>',
                                '       <th class="th-width3">&nbsp;</th>' +
                                '       <th class="th-width5">主</th>' +
                                '       <th class="th-width6">盘</th>' +
                                '       <th class="th-width5">客</th>' +
                                '       <th>主胜率</th>' +
                                '   </tr>' +
                                '   </table>' +
                                '<div class="TabelScroll table-scroll">' +
                                '   <table class="details-table">');
                            for(var i= 0,len=oddsData.length;i<len;i++){
                                var upOrdownHome=_sel.oddStyle(oddsData[i].initalOdds.homeOdds,oddsData[i].immedOdds.homeOdds);
                                var upOrdownAway=_sel.oddStyle(oddsData[i].initalOdds.awayOdds,oddsData[i].immedOdds.awayOdds);
                                var upOrdown = "";
                                if(oddsData[i].immedOdds.hadpFluct==1){
                                    upOrdown = "iconfont icon-up-after"
                                }else if(oddsData[i].immedOdds.hadpFluct==-1){
                                    upOrdown = "iconfont icon-down-after"
                                }else {
                                    upOrdown = ""
                                }
                                oddsHtml.push(
                                    '<tr class="list-item">',
                                    '   <td class="td-name">'+oddsData[i].companyNm+'</td>',
                                    '   <td>',
                                    '       <div class="td-common">',
                                    '           <div>初盘</div>',
                                    '           <div>即时</div>',
                                    '       </div>',
                                    '   </td>',
                                    '   <td>',
                                    '       <div class="td-common">',
                                    '           <div>'+oddsData[i].initalOdds.homeOdds+'</div>',
                                    '           <div class="'+upOrdownHome+'">'+oddsData[i].immedOdds.homeOdds+'</div>',
                                    '       </div>',
                                    '   </td>',
                                    '   <td>',
                                    '       <div class="td-common">',
                                    '           <div>'+oddsData[i].initalOdds.giveBall+'</div>',
                                    '           <div class="'+upOrdown+'">'+oddsData[i].immedOdds.giveBall+'</div>',
                                    '       </div>',
                                    '   </td>',
                                    '   <td>',
                                    '       <div class="td-common">',
                                    '           <div>'+oddsData[i].initalOdds.awayOdds+'</div>',
                                    '           <div class="'+upOrdownAway+'">'+oddsData[i].immedOdds.awayOdds+'</div>',
                                    '       </div>',
                                    '   </td>',
                                    '   <td>',
                                    '       <div class="td-common">',
                                    '           <div>50%</div>',
                                    '           <div>50.55%</div>',
                                    '       </div>',
                                    '   </td>',
                                    '</tr>'
                                )
                            }
                        }else if(oddsType=="eu"){
                            oddsHtml.push(
                                '<table class="details-table-th">' +
                                '   <tr>',
                                '       <th class="th-width2">公司</th>',
                                '       <th>初始赔率</th>' +
                                '       <th class="th-width">即时赔率</th>' +
                                '   </tr>' +
                                '   </table>' +
                                '<div class="TabelScroll table-scroll">' +
                                '   <table class="details-table">');
                            for(var i= 0,len=oddsData.length;i<len;i++){
                                var upOrdownWon=_sel.oddStyle(oddsData[i].initalOdds.won,oddsData[i].immedOdds.won)
                                var upOrdownDrawn=_sel.oddStyle(oddsData[i].initalOdds.drawn,oddsData[i].immedOdds.drawn)
                                var upOrdownLost=_sel.oddStyle(oddsData[i].initalOdds.lost,oddsData[i].immedOdds.lost)
                                oddsHtml.push(
                                    '<tr class="list-item">',
                                    '   <td class="td-name">'+oddsData[i].companyNm+'</td>',
                                    '   <td>',
                                    '       <div class="td-rate">',
                                    '           <div>'+oddsData[i].initalOdds.won+'</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div>'+oddsData[i].initalOdds.drawn+'</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div>'+oddsData[i].initalOdds.lost+'</div>',
                                    '       </div>',
                                    '   </td>',
                                    '   <td>',
                                    '       <div class="td-rate">',
                                    '           <div class="'+upOrdownWon+'">'+oddsData[i].immedOdds.won+'</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div class="'+upOrdownDrawn+'">'+oddsData[i].immedOdds.drawn+'</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div class="'+upOrdownLost+'">'+oddsData[i].immedOdds.lost+'</div>',
                                    '       </div>',
                                    '   </td>',
                                    '</tr>'
                                )
                            }
                        }else if(oddsType=="bs") {
                            oddsHtml.push(
                                '<table class="details-table-th">' +
                                '   <tr>',
                                '       <th class="th-width7">公司</th>',
                                '       <th>初盘</th>' +
                                '       <th class="th-width8">即时盘</th>' +
                                '   </tr>' +
                                '   </table>' +
                                '<div class="TabelScroll table-scroll">' +
                                '   <table class="details-table">');
                            for (var i = 0, len = oddsData.length; i < len; i++) {
                                var upOrdownBig = _sel.oddStyle(oddsData[i].initalOdds.bigOdds, oddsData[i].immedOdds.bigOdds);
                                var upOrdownSmall = _sel.oddStyle(oddsData[i].initalOdds.smallOdds, oddsData[i].immedOdds.smallOdds);
                                var upOrdown = "";
                                if (oddsData[i].immedOdds.hadpFluct == 1) {
                                    upOrdown = "iconfont icon-up-after"
                                } else if (oddsData[i].immedOdds.hadpFluct == -1) {
                                    upOrdown = "iconfont icon-down-after"
                                } else {
                                    upOrdown = ""
                                }
                                oddsHtml.push(
                                    '<tr class="list-item">',
                                    '   <td class="td-name">' + oddsData[i].companyNm + '</td>',
                                    '   <td>',
                                    '       <div class="td-rate">',
                                    '           <div>' + oddsData[i].initalOdds.bigOdds + '</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div>' + oddsData[i].initalOdds.ball + '</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div>' + oddsData[i].initalOdds.smallOdds + '</div>',
                                    '       </div>',
                                    '   </td>',
                                    '   <td>',
                                    '       <div class="td-rate">',
                                    '           <div class="' + upOrdownBig + '">' + oddsData[i].immedOdds.bigOdds + '</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div class="' + upOrdown + '">' + oddsData[i].immedOdds.ball + '</div>',
                                    '       </div>',
                                    '       <div class="td-rate">',
                                    '           <div class="' + upOrdownSmall + '">' + oddsData[i].immedOdds.smallOdds + '</div>',
                                    '       </div>',
                                    '   </td>',
                                    '</tr>'
                                )

                            }
                        }
                        oddsHtml.push(
                            ' </table></div>');
                    }
                    var oddsDateHtml = oddsHtml.join('');
                    $(".TableDiv").html(oddsDateHtml);
                    $(".TabelScroll").niceScroll({
                        cursorcolor: "#999999",
                        autohidemode: false, // 不隐藏滚动条:
                    });//初始化滚动条
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //获取观点
        getAppEventViews:function (id) {//todo
            var _sel = this;
            var parameter = {};
            parameter.matchId = id;
            parameter.time = Date.parse(new Date())/1000;
            parameter = common.objKeySort(parameter);//排序加密
            $.ajax({
                type:"post",
                url:'/oddsPanel.do',
                data:parameter,
                success: function(data){
                    if(data.data == 0) return;
                    // var oddsHtml = [];
                    // var oddsDateHtml = oddsHtml.join('');
                    // $(".details-table").html(oddsDateHtml);
                },
                error(msg){
                    console.log(msg)
                }
            });
        },
        //初始即时数据对比返回样式
        oddStyle:function (initalData,immedData) {
            if(initalData<immedData){
                return "iconfont icon-up-after"
            }else if(initalData>immedData){
                return "iconfont icon-down-after"
            }else {
                return ""
            }
        }
    };
    module.exports = index;
});

