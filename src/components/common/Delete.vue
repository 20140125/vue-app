<template>
    <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="remove(item,index)">删 除</el-button>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name: "Delete",
        props:{
            item:Object,
            url:String,
            index:Number,
            Lists:Array,
        },
        data(){
            return {
                table:this.$route.meta.mode,
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            /**
             * todo：删除记录
             * @param item
             * @param index
             */
            remove:function (item,index) {
                this.$confirm('此操作将永远删除该条记录，是否继续？','删除记录',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    let params = {id:item.id,token : this.$store.state.login.token};
                    this.$http.post(this.url,params).then(response=>{
                        if (response.data.code === 200) {
                            this.Lists.splice(index,1);
                            let data = { msg:JSON.stringify({info:response.data.msg,result:response.data.result}),token:this.$store.state.login.token };
                            this.saveSystemLog(data);
                            this.$message({type:'success',message:response.data.msg});
                            this.$emit('success');
                            return false;
                        }
                    },error=>{
                        console.log(error);
                    })
                }).catch(()=>{
                    this.$message({type:'info',message:'已取消删除！'});
                })

            }
        }
    }
</script>

<style scoped>

</style>
