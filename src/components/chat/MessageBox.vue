<template>
    <div id="messageBox">
        <div>
            <div ref="message" class="messageLists">
                <div v-for="(item, index) in messageLists" :key="index">
                    <div class="userinfo">
                        <el-avatar class="client-img" :src="item.client_img" :size="30"></el-avatar>
                        <span class="from-client-name" v-html="item.from_client_name"></span>
                        <span class="message-time" v-html="item.time"></span>
                    </div>
                    <div class="client-content" v-html="replaceContent(item.content)"></div>
                </div>
            </div>
        </div>
        <div class="sendMessage">
            <div>
                <el-tooltip effect="dark" content="发送表情" placement="top-start">
                    <i @click="showEmotion = !showEmotion" class="el-icon-picture-outline-round icon"></i>
                </el-tooltip>
                <el-upload :action="uploadFile"
                           :data="uploadData"
                           accept="image/jpeg, image/jpg, image/png, image/gif, audio/mp4, video/mp4"
                           :headers="headers"
                           :show-file-list="false"
                           :on-success="uploadSuccess"
                           :before-upload="beforeUpload" style="float: left">
                    <el-tooltip effect="dark" content="发送文件和图片" placement="top-start">
                        <i @click="showEmotion = false" class="el-icon-picture-outline icon"></i>
                    </el-tooltip>
                </el-upload>
            </div>
            <!--文本输入框-->
            <div contentEditable="true" ref="message" class="input-content"></div>
            <!--文本输入框-->
            <div class="input-button">
                <el-tooltip effect="dark" content="Shift + Enter 快捷发送" placement="top-start">
                    <el-button type="primary" :disabled="!receiveName" plain size="mini" @click="sendMessage">发送(S)</el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import URLS from '@/api/urls';

export default {
    name: 'MessageBox',
    props: ['messageLists', 'userInfo', 'receiveName'],
    computed: {
        uploadFile() {
            return URLS.baseURL + URLS.file.upload;
        }
    },
    data() {
        return {
            headers: {
                Authorization: this.$store.getters.token
            },
            uploadData: {
                token: this.$store.getters.token,
                file_type: 'text',
                round_name: true
            }
        };
    },
    methods: {
        /**
         * todo:字符串替换
         */
        replaceContent(content) {
            return content.replace(new RegExp(/&lt;/g), '<').replace(new RegExp(/&gt;/g), '>').replace(new RegExp(/&quot;/g), '"');
        },
        /**
         * todo:发送消息
         */
        sendMessage() {
            this.$refs.message.innerHTML.trim() !== '' ? this.$emit('sendMessage', this.$refs.message.innerHTML.trim()) : this.$refs.message.focus();
        },
        /**
         * todo:图片上传成功
         * @param response
         */
        uploadSuccess(response) {
            if (response.code === 200) {
                switch ((((response || {}).item || {}).lists || {}).file_type) {
                    case 'image':
                        this.$refs.message.innerHTML += '<img src=\'' + (((response || {}).item || {}).lists || {}).src + '\' width=\'100px\' height=\'100px\' style=\'object-fit: contain;\' alt=\'' + this.userInfo.username + '\'>';
                        break;
                    case 'video':
                        this.$refs.message.innerHTML += '<video src=\'' + (((response || {}).item || {}).lists || {}).src + '\' width=\'200px\' height=\'200px\' autoplay controls=\'controls\'>';
                        break;
                    default:
                        this.$refs.message.innerHTML += '';
                        break;
                }
            }
        },
        /**
         * todo；上传之前
         * @param file
         */
        beforeUpload(file) {
            if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
                this.uploadData.file_type = 'image';
                if (file.size > 2 * 1024 * 1024) {
                    this.$message.error('upload image size error');
                    return false;
                }
            }
            if (['audio/mp4', 'video/mp4'].includes(file.type)) {
                this.uploadData.file_type = 'video';
                if (file.size > 5 * 1024 * 1024) {
                    this.$message.error('upload video size error');
                    return false;
                }
            }
        }
    }
};
</script>

<style lang="less">
#messageBox {
    height: 535px;
    max-height: 535px;
    overflow: hidden;
    overflow-y: auto;
    padding: 0 !important;

    .messageLists {
        border: 1px solid #eee;
        height: 300px;
        padding: 10px;
        overflow: scroll;
        overflow-x: hidden;
        margin-bottom: 10px;

        .userinfo {
            display: flex;
            align-items: center;
            position: relative;
            margin: 15px 0;

            .client-img {
                margin-left: 10px;
                text-align: left;
            }

            .from-client-name {
                margin-left: 10px;
            }

            .message-time {
                margin-left: 15px;
                font-size: 12px;
            }
        }

        .client-content {
            margin-left: 20px;
            line-height: 30px;
            font-size: 14px;
        }
    }

    .sendMessage {
        .input-content {
            border: 1px solid #585252;
            height: 95px;
            padding: 10px;
            overflow: scroll;
            overflow-x: hidden;
            font-size: 14px;
            font-family: "新宋体", serif;
        }

        .input-button {
            margin-top: 15px;
            float: right;
        }

        .el-icon-picture-outline-round, .el-icon-picture-outline {
            font-size: 30px;
            margin: 0 10px 10px 0;
        }
    }

}
</style>
