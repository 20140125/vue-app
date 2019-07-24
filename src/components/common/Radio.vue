<template>
    <div>
        <el-radio-group v-model="item.status" size="mini" @change="setStatus(item)">
            <el-radio-button label="2">关闭</el-radio-button>
            <el-radio-button label="1">开启</el-radio-button>
        </el-radio-group>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: "Radio",
        props:{
            item:Object,
            url:String,
        },
        data(){
            return {
                table:this.$route.meta.mode,
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            /**
             * todo：修改状态
             * @param item
             */
            setStatus:function (item) {
                let params = {status:item.status,id:item.id,token:this.$store.state.login.token,'act':'status'};
                this.$http.post(this.url,params).then(response=>{
                    if (response.data.code === 200){
                        let data = { msg:JSON.stringify({ info:response.data.msg,result:response.data.result}),token:this.$store.state.login.token };
                        this.saveSystemLog(data);
                        this.$message({type:'success',message:response.data.msg});
                        return ;
                    }
                    item.status = params.status===1?2:1;
                },error=>{
                    item.status = params.status===1?2:1;
                    console.log(error);
                })
            }
        }
    }
</script>

<style scoped>

</style>
