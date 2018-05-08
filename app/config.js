var config = {
    port: process.env.PORT||3003,//nodejs项目启动端口
    version: '0.1.168',//111
    nodeEnv:process.env.NODE_ENV||"production",//production:发布模式 development:开发模式
    projectPath: "",//项目路径
    page: {
        error: "error",
        noFind: "404",
        successCode: "0",
        defaultLangType: "zh",//默认语言类型
        isProjectComJs: true,//true：加载项目自己的公共js
        isProjectComHead: true,//true:加载项目自己公共头部
        //userInfo: ['name', 'deptName']//页面需要的信息与api头部的信息一起传给前端，因为有时候需要
        userInfo: ['name',"deptCode", 'deptName']//TODO 为了兼容旧版页面，暂时在页面上还是显示，以免有问题，vue的公共文件commonjs.html，记得一并去掉
    },
    /**
     * 平台API地址
     */
    apiPlatformUrl: {
        host:'api.qiuyoule.com',
        port:""//api开发期地址
        // host:'192.168.1.125',
        // port:8080//线下
    },
    //api要传的用户信息字段
    //operator:人名字
    //deptCode:科室代码
    //apiUserInfo: ["operator", "deptCode", "orgCode"],
    apiUserInfo: ["operator", "orgCode"],
    /**
     * 文件上传路径
     */
    upload: {
        path: "public/tmp/file"//文件保存的路径
    },

    /**
     * log4js配置信息
     */
    log4jsOptions: {
        "defaultLevel": "INFO",//默认日志级别
        "appenders": [//多个日志类型
            {
                "type": "console",//打印到控制台
                "category": "console"//组
            },
            {
                "type": "dateFile",//输出按时间分文件的日志
                "filename": "logs/",//生成的文件为在logs下
                "pattern": "public-app-yyyy-MM-dd.log",//文件名
                "alwaysIncludePattern": true,//这个是个开关配置 ture(默认值)是开启pattern,false是不开启pattern,不开启时datefile文件将无任何时间后缀,也不会分文件.
                // "pollInterval": 1,//此属性未知其含义，没有找到相关解释
                "category": "interceptor",
                //  maxLogSize: 1024,//dateFile 无效
                // backups:4//dateFile 无效
            },
            {
                "type": "dateFile",//输出按时间分文件的日志
                "filename": "logs/",//生成的文件为在logs下
                "pattern": "public-app-yyyy-MM-dd.log",//文件名
                "alwaysIncludePattern": true,//这个是个开关配置 ture(默认值)是开启pattern,false是不开启pattern,不开启时datefile文件将无任何时间后缀,也不会分文件.
                // "pollInterval": 1,//此属性未知其含义，没有找到相关解释
                "category": "api-helper",
                //  maxLogSize: 1024,//dateFile 无效
                // backups:4//dateFile 无效
            }
        ],
        replaceConsole: true//这个配置是表示是否替换控制台输出.
    },

    /**
     * session配置
     */
    sessionOptions: {
        port: process.env.REDISPORT||6000,//redis端口号
        host: process.env.REDISHOST||'localhost',//redis主机
        //ttl : 60 * 60 * 24 * 30,   //Session的有效期为30天
        ttl: 60 * 60 * 24,//1天
        pass: 'zndz'  //密码
    },
    locals: function (app) {
        app.locals.version = this.version;
        app.locals.projectPath = this.projectPath;//nodejs 项目路径
        app.locals.env = app.get('env');
        app.locals.isProjectComJs = this.page.isProjectComJs;
        app.locals.isProjectComHead = this.page.isProjectComHead;
        app.locals.isTranslate = this.isTranslate;
        app.locals.isZhTranslate = this.isZhTranslate;
        app.locals.skin=this.skin;//TODO 后续可能从用户登录的cookies来;
        if (app.get('env') == 'development') {
            app.locals.static="vue";
            app.locals.version = new Date().getTime();
        }else{
            app.locals.static="dist";
        }
    }

};

module.exports = config;