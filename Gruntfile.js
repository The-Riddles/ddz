module.exports = function (grunt) {


    //加载 nodejs path模块，用于定位module模块
    var path = require('path');

    // 获取当前目录相对于共享 node_modules 目录的路径
    var nodepath = path.relative(__dirname, '/Users/mars/Documents/grunt_module/node_modules/');

    // 重新设置 grunt 的项目路径，获取当前的 package.json 文件信息
    grunt.file.setBase(__dirname);

    /** 
        自动搭建静态文件服务器，不需在自己电脑上搭建Web服务器。
        不需要浏览器插件的支持（不现定于某个浏览器）。
        不需要给网页手动添加livereload.js。
    **/
    var lrPort = 35729;
    //需要实时刷新的页面添加如下脚本，注意端口
    // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
    var lrSnippet = require('/Users/mars/Documents/grunt_module/node_modules/connect-livereload')({
        port: lrPort
    });
    // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
    var serveStatic = require('/Users/mars/Documents/grunt_module/node_modules/serve-static');
    var serveIndex = require('/Users/mars/Documents/grunt_module/node_modules/serve-index');
    var lrMiddleware = function (connect, options) {
        return [

             lrSnippet,

             serveStatic(options.base[0]),

             serveIndex(options.base[0])

            ];
    };


    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        //js检查
        jshint: {
            //all配置要检查的js
            all: ['js/*'],
            options: {
                //jQuery 是在另外的库中定义的，我们这里只是使用而已。可以配置 jshint 中配置 $ 是一个全局变量。
                globals: {
                    $: false,
                    jQuery: false
                },

                //我们的脚本需要在浏览器环境下执行，这样，我们的脚本中可以使用 console、setTimeout 等等函数了
                browser: true, //这里并不会暴露alert or console等等，需要使用devel来进行暴露
                devel: true

            }

        },

        // 通过connect任务，创建一个静态服务器
        connect: {

            options: {
                // 服务器端口号
                port: 8000,
                // 服务器地址(可以使用主机名localhost，也能使用IP)
                hostname: 'localhost',
                // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                base: '.'

            },


            livereload: {
                options: {
                    // 通过LiveReload脚本，让页面重新加载。
                    middleware: lrMiddleware
                }
            }
        },


        // 通过watch任务，来监听文件是否有更改
        watch: {
            client: {
                // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
                options: {
                    livereload: lrPort
                },
                // '**' 表示包含所有的子目录
                // '*'  表示包含所有的文件
                files: ['*.html', "css/*.css", "js/*.js", "images/*"]
            }
        }

    });


    //加载外部任务
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-concat", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-jshint", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-connect", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-watch", "tasks"));



    //自定义任务（name，description，tasks）
    grunt.registerTask('jshint', "This task used to check js files.", ['jshint']);
    grunt.registerTask('livewatch', "This task used to live watching files changed.", ['connect', 'watch']);

    //注册默认任务
    grunt.registerTask('default', ['livewatch']);
};
