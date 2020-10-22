<template>
    <el-tooltip content="look before you leap" placement="top">
        <el-radio-group v-model="item.status" size="mini" @change="setStatus(item)">
            <el-radio-button label="2">否</el-radio-button>
            <el-radio-button label="1">是</el-radio-button>
        </el-radio-group>
    </el-tooltip>
</template>

<script>
    import apiLists from '../../api/api'
    import {mapActions} from 'vuex'
    export default {
        name: "Radio",
        props:{
            item:{
                type:Object,
                default:()=>{}
            },
            url:{
                type:String,
                default:()=>''
            },
        },
        data(){
            return {
                table:this.$route.meta.mode,
            }
        },
        methods:{
            ...mapActions(['saveSystemLog','checkAuth']),
            /**
             * todo：修改状态
             * @param item
             */
            setStatus:function (item) {
                this.checkAuth({url:this.url});
                let params = {status:item.status,id:item.id,token:this.$store.state.login.token,'act':'status'};
                apiLists.SaveData(params,this.url).then((response)=> {
                    if (response && response.data.code === 200) {
                        let data = {href:this.url, msg:response.data.msg, token:this.$store.state.login.token};
                        this.saveSystemLog(data);
                        this.$message({type:'success',message:response.data.msg});
                        this.$emit('success');
                        return ;
                    }
                    item.status = parseInt(params.status) === 1 ? 2 : 1;
                },error=>{
                    item.status = parseInt(params.status) === 1 ? 2 : 1;
                    console.log(error);
                })
            }
        }
    }
</script>

<style scoped>

</style>
