<template>
    <div ref="messageLists">
        <!--群聊模板信息展示-->
        <div ref="message" v-contextmenu:contextmenu :source="source" class="item" v-if="source.to_client_name === 'all'" :class="source.from_client_name === userInfo.username ? 'creator' : '' ">
            <div class="avatar">
                <el-avatar :src="source.client_img" />
            </div>
            <div class="body">
                <div class="name" v-if="source.from_client_name !== userInfo.username">{{source.from_client_name}} {{source.time}}</div>
                <div class="content">
                    <div class="text"><span v-html="source.from_client_name === userInfo.username ? unescape(source.content.replace('%ACCOUNT%','你')) : unescape(source.content.replace('%ACCOUNT%',source.from_client_name))"/></div>
                </div>
            </div>
        </div>
        <!--私聊模板信息展示-->
        <div ref="message" v-contextmenu:contextmenu :source="source" class="item" v-else  :class="source.to_client_name === userInfo.username ? '' : 'creator' ">
            <div class="avatar">
                <el-avatar :src="source.client_img" />
            </div>
            <div class="body">
                <div class="name" v-if="source.to_client_name === userInfo.username">{{source.from_client_name}} {{source.time}}</div>
                <div class="content">
                    <div class="text"><span v-html="source.from_client_name === userInfo.username ? unescape(source.content.replace('%ACCOUNT%','你')) : unescape(source.content.replace('%ACCOUNT%',source.from_client_name))"/></div>
                </div>
            </div>
        </div>
        <!--右键菜单-->
        <v-contextmenu ref="contextmenu" theme="bright" @contextmenu="menuRightChange" v-if="source.from_client_name === userInfo.username && showContextMenu">
            <v-contextmenu-item @click="setMessages('recall')">消息撤回</v-contextmenu-item>
            <v-contextmenu-item divider></v-contextmenu-item>
            <v-contextmenu-item @click="setMessages('delete')">消息删除</v-contextmenu-item>
        </v-contextmenu>
        <v-contextmenu ref="contextmenu" v-else/>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import func from '../../api/func'
import mixins from "../../api/dispatch";
export default {
    name: 'ChatRoomItem',
    props: {
        source: {
            type: Object,
            default:()=>{}
        },
    },
    mixins:[mixins],
    data(){
        return {
            targetMessage:{},
            showContextMenu:true
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
        /**
         * todo:右键菜单
         * @param item
         */
        menuRightChange:function (item) {
            if (item.data.attrs && item.data.attrs.source) {
                this.targetMessage = item.data.attrs.source;
            }
            this.showContextMenu = this.targetMessage.type !== 'recall';
            //三分钟后消息不可删除亦不可撤回
            if (this.targetMessage.type!=='recall') {
                this.showContextMenu = Date.parse(this.targetMessage.time)/1000 + 180 > Date.parse(new Date())/1000;
            }
        },
        /**
         * todo:消息撤回/消息删除
         */
        setMessages:function (item) {
            switch (item) {
                //撤回消息
                case 'recall' :
                    let recallMessage = JSON.parse(JSON.stringify(this.targetMessage));
                    recallMessage.content = '%ACCOUNT%撤回了一条消息';
                    recallMessage.time = func.set_time(new Date());
                    this.dispatch('chatRoom','recallMessage',recallMessage,this.targetMessage)
                    break;
                //删除消息
                case 'delete':
                    let deleteMessage = JSON.parse(JSON.stringify(this.targetMessage));
                    this.dispatch('chatRoom','deleteMessage',deleteMessage,this.targetMessage)
                    break
            }
        }
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
            cursor: default;
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