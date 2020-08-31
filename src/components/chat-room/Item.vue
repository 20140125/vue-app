<template>
    <div class="item" :class="userInfo.username === source.to_client_name ? '' : 'creator' ">
        <div class="avatar">
            <el-avatar :src="source.client_img" />
        </div>
        <div class="body">
            <div class="name" v-if="userInfo.username === source.to_client_name">{{source.from_client_name}} {{source.time}}</div>
            <div class="content">
                <div class="text"><span v-html="unescape(source.content)"/></div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'Item',
    props: {
        source: {
            type: Object,
            default () {
                return {
                }
            }
        }
    },
    computed:{
        ...mapGetters(['userInfo']),
    },
    methods:{
        /**
         * TODO:字符串标签转换
         * @param html
         */
        unescape:function (html) {
            return html
                .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&amp;nbsp;/g," ")
                .replace(/&#39;/g, "\'");
        },
    }
}
</script>

<style lang="less" scoped>
.item {
    display: flex;
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 192, 203, .2);
        img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .body {
        flex: 1;
        padding-left: 1em;
        font-size: 16px;
        max-width: 560px;
        word-break: break-word;
        .name {
            padding-bottom: .2em;
            font-size: 12px;
        }
        .content {
            position: relative;
            color: #000;
            background-color: aliceblue;
            border-radius: 15px;
            padding: .5em 1em;
            &:after{
                content: '';
                position: absolute;
                right: 100%;
                top: 10px;
                width: 14px;
                height: 14px;
                border-width: 0;
                border-style: solid;
                border-color: transparent;
                border-bottom-width: 10px;
                border-bottom-color: currentColor;
                border-radius: 0 0 0 32px;
                color: aliceblue;
            }
        }
    }
    &.creator {
        transform: rotateX(180deg);
        direction: rtl;
        align-items: flex-end;
        .avatar {
            transform: rotateX(180deg);
        }
        .body {
            transform: rotate(180deg);
        }
        .text {
            transform: rotateY(180deg);
            direction: ltr;
        }
    }
}
</style>