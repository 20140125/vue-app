<template>
    <el-form :model="formData" ref="reFrom" :rules="rules" :label-width="labelWidth">
        <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'input'" :key="index" :label="search.label" :prop="search.prop">
            <el-input :placeholder="search.tips" v-model="search.model"/>
        </el-form-item>
        <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'datetime'" :key="index" :label="search.label" :prop="search.prop">
            <el-date-picker :type="search.datetype || 'daterange'"
                            :value-format="search.format || 'yyyy-MM-dd'"
                            :format="search.format || 'yyyy-MM-dd'"
                            :start-placeholder="search.tips.split('-')[0]"
                            :end-placeholder="search.tips.split('-')[1]"
                            style="width: 100%"
                            v-model="search.model">
            </el-date-picker>
        </el-form-item>
        <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'select'" :key="index" :label="search.label" :prop="search.prop">
            <el-select :placeholder="search.tips" v-model="search.model"  style="width: 100%">
                <el-option label="Default" value="0" v-if="search.model === '0'" selected/>
                <el-option v-for="(select,index) in search.options" :label="select.label" :value="select.value" :key="index"/>
            </el-select>
        </el-form-item>
        <el-form-item v-for="(search,index) in searchOptions" v-if="search.type === 'radio'" :key="index" :label="search.label" :prop="search.prop">
            <el-radio-group v-model="search.model" size="small" style="width: 100%">
                <el-radio-button v-for="(select,index) in search.options" :key="index" :label="select.label">{{select.value}}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: center">
            <el-button @click="resetForm('reFrom')" plain>Cancel</el-button>
            <el-button type="primary" @click="submitForm('reFrom')" plain>Confirm</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import Submit from '../common/Submit'
    import $url from '../../api/url'
    import apiLists from '../../api/api'
    import {mapActions} from 'vuex'
    export default {
        name: 'form-component',
        components: {Submit},
        props:{
            formData:{
                type:Object,
                default:()=>{}
            },
            searchOptions:{
                type:Array,
                default:()=>[]
            },
            rules:{
                type:Object,
                default:()=>{}
            },
            labelWidth:{
                type:String,
                default:'0',
            },
            //更新
            update:{
                type:String,
                default:$url.componentAction
            },
        },
        data(){
            return {
            }
        },
        methods:{
            ...mapActions(['saveSystemLog']),
            submitForm:function(ref){
                this.$refs[ref].validate((valid)=>{
                    if (valid){
                        for (let i in this.searchOptions) {
                            this.formData[this.searchOptions[i].prop] = this.searchOptions[i].model
                        }
                        this.formData.token = this.$store.state.login.token;
                        apiLists.SaveData(this.formData,this.update).then(response=>{
                            if (response && response.data.code === 200) {
                                let data = { href:$url.componentAction, msg:response.data.msg, token:this.$store.state.login.token };
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
                    this.$message({type:'warning',message:'Please check field integrity ~'});
                });
            },
            resetForm:function (ref) {
                this.$refs[ref].resetFields();
            }
        },
        mounted () {
            this.$nextTick(function () {
                console.log(this.formData)
            })
        }
    }
</script>

<style scoped>

</style>
