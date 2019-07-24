<template>
    <div>
        <el-button @click="resetForm(reFrom)" plain>取 消</el-button>
        <el-button type="primary" @click="submitForm(reFrom)" plain>确 定</el-button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: "Submit",
        props:{
            reFrom:String,
            model:Object,
            url:String,
            refs:Object
        },
        data(){
            return {

            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            submitForm:function(ref){
                this.refs[ref].validate((valid)=>{
                    if (valid){
                        this.model.token = this.$store.state.login.token;
                        this.$http.post(this.url,this.model).then(response=>{
                            if (response.data.code === 200) {
                                let data = { msg:JSON.stringify({info:response.data.msg,result:response.data.result}),token:this.$store.state.login.token };
                                this.saveSystemLog(data);
                                this.$message({type:'success',message:response.data.msg});
                                this.$emit('success');
                                return false;
                            }
                        },error=>{
                            console.log(error);
                        });
                        return true;
                    }
                    this.$message({type:'warning',message:'请检查字段完整性~'});
                });
            },
            resetForm:function (ref) {
                this.refs[ref].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
