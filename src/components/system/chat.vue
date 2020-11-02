<template>
    <div v-loading="loading" :element-loading-text="loadingText">
        <el-form :inline="true" style="margin-top: 10px">
        </el-form>
        <el-table :data="chatLists">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="发送方：">
                            <span>{{ props.row.content['from_client_name'] }}</span>
                        </el-form-item>
                        <el-form-item label="接收ID：">
                            <span>{{ props.row.content['to_client_id'] }}</span>
                        </el-form-item>
                        <el-form-item label="发送ID：">
                            <span>{{ props.row.content['from_client_id'] }}</span>
                        </el-form-item>
                        <el-form-item label="接收方：">
                            <span>{{ props.row.content['to_client_name'] }}</span>
                        </el-form-item>
                        <el-form-item label="用户头像：">
                            <el-avatar :src="props.row.content['client_img']" class="image" :size="40" :alt="props.row.content['from_client_name'] "></el-avatar>
                        </el-form-item>
                        <el-form-item label="消息类型：">
                            <span>{{ props.row.content['msg_type'] }}</span>
                        </el-form-item>
                        <el-form-item label="发送内容：" class="image">
                            <span v-html="unescape(props.row.content['content'])"></span>
                        </el-form-item>
                        <el-form-item label="发送时间：">
                            <span>{{ props.row.content['time'] }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="发送者" prop="from_client_id"> </el-table-column>
            <el-table-column label="接收者" prop="to_client_id"> </el-table-column>
            <el-table-column label="房间号" prop="room_id"> </el-table-column>
            <el-table-column label="发送时间">
                <template slot-scope="scope">
                    <span v-html="scope.row.content['time']"/>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin: 25px 0">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :page-size="limit"
                    layout="total, prev, pager, next"
                    :total="total"
                    :current-page="page">
            </el-pagination>
        </div>
        <!--table 分页-->
    </div>
</template>

<script>
    import apiLists from '../../api/api';
    import $url from '../../api/url';
    import func from '../../api/func'
    import Delete from "../common/Delete";
    export default {
        name: "lists",
        components: {Delete},
        data(){
            return {
                chatLists:[],
                page:1,
                limit:10,
                total:0,

                title:'',
                syncVisible:false, //是否显示弹框
                modal:true, //遮盖层是否需要
                labelWidth:'80px',
                loading:true,
                destroy_on_close:true,
                center:true,
                loadingText:'玩命加载中。。。',

                cgi:{
                    remove:$url.remove,
                    status:$url.status
                },
                rules:{},
            }
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
             * todo：关闭弹框
             */
            success:function(){
                this.syncVisible = false;
            },
            /**
             * todo：设置时间
             * @param timestamp
             */
            setTimes:function(timestamp){
                return func.set_time(timestamp*1000);
            },
            /**
             * todo：获取角色列表
             * @param page
             * @param limit
             */
            getChatLists:function (page,limit) {
                apiLists.ChatLists({ page:page,limit:limit }).then(response=>{
                    this.loading = false;
                    this.chatLists = response.data.item.data;
                    this.total = response.data.item.total;
                });
            },
            /**
             * todo：每页记录数
             * @param val
             */
            sizeChange:function(val){
                this.limit = val;
                this.getChatLists(this.page,this.limit)
            },
            /**
             * todo：当前页码
             * @param val
             */
            currentChange:function(val){
                this.page = val;
                this.getChatLists(this.page,this.limit)
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.getChatLists(this.page,this.limit)
            });
        }
    }
</script>
<style scoped>
.image{
    display: flex;
    align-items: center;
    position: relative;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
