<template>
    <body>
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
            <title>404 Not Found</title><base target="_blank">
            <link type="text/css" rel="stylesheet" href="https://cdn.zhaolinlang.com/cdn.dnpw.org/project/404/0/common/404.css"/>
        </head>
        <main>
            <section class="collage-404">
                <h1>404</h1>
                <div class="collage-404-images">
                </div>
            </section><section class="message-404">
            <h1>页面找不到或已被删除</h1>
            <p>
                Oops,Page not found or deleted <a id="color-choice"></a>
            </p>
        </section>
            <div class="explore-cta">
                <div>
                    <a href='/login' target='_self' class="back">返回首页</a>
                    <label>
                        <input class="color-range">
                    </label>
                </div>
            </div>
        </main>
    </body>
</template>
<script>
    export default {
        name: 'empty',
        data () {
            return {}
        },
        mounted () {
            this.$nextTick(() => {
                let js = '<script src="https://cdn.zhaolinlang.com/cdn.dnpw.org/project/404/0/common/404.js"></scr' + 'ipt>'
                document.write(js)
            })
        }
    }
</script>

<style scoped>
</style>
