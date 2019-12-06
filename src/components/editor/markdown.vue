<template>
    <mavon-editor @imgAdd="uploadFile" ref="md" @change="getData" v-model="value" style="z-index:1"/>
</template>

<script>
    import $url from '../../api/url'
    import func from '../../api/func'
    export default {
        name: "markdown",
        data(){
            return {
                value:'```JavaScript\n' +
                  '<template>\n' +
                  '    <mavon-editor @imgAdd="uploadFile" ref="md" v-model="value"/>\n' +
                  '</template>\n' +
                  '\n' +
                  '<script>\n' +
                  '    import $url from "../../api/url"\n' +
                  '    import func from "../../api/func"\n' +
                  '    export default {\n' +
                  '        name: "markdown",\n' +
                  '        data(){\n' +
                  '            return {\n' +
                  '                value:"",\n' +
                  '                uploadUrl:process.env.API_ROOT+$url.fileUpload,\n' +
                  '                token:""\n' +
                  '            }\n' +
                  '        },\n' +
                  '        created(){\n' +
                  '            this.token = this.$store.state.login.token;\n' +
                  '        },\n' +
                  '        methods:{\n' +
                  '            /**\n' +
                  '             * TODO:图片上传\n' +
                  '             * @param post\n' +
                  '             * @param file\n' +
                  '             */\n' +
                  '            uploadFile:function (post,file) {\n' +
                  '                let type = file.type;\n' +
                  '                let typeArr = ["image/jpg","image/gif","image/png","image/jpeg"];\n' +
                  '                if (!typeArr.includes(type)){\n' +
                  '                    this.$message({type:"warning",message:"upload image format error"});\n' +
                  '                    return false;\n' +
                  '                }\n' +
                  '                if (file.size>2*1024*1024){\n' +
                  '                    this.$message({type:"warning",message:"upload image size error"});\n' +
                  '                    return false;\n' +
                  '                }\n' +
                  '                let params = new FormData();\n' +
                  '                params.append("file",file);\n' +
                  '                params.append("token",this.token);\n' +
                  '                params.append("rand",true);\n' +
                  '                let config = {headers: {"Content-Type": "multipart/form-data","Authorization":`${func.set_password(func.set_random(32),func.set_random(12))}${this.token}${func.set_password(func.set_random(32),func.set_random(12))}`}}\n' +
                  '                this.$http.post(this.uploadUrl,params,config).then(response=>{\n' +
                  '                    this.$refs["md"].$img2Url(post, response.data.item.src);\n' +
                  '                })\n' +
                  '            },\n' +
                  '        },\n' +
                  '    }\n' +
                  '<\/script>\n'+
'```',
                uploadUrl:process.env.API_ROOT+$url.fileUpload.replace('/',''),
                token:''
            }
        },
        created(){
            this.token = this.$store.state.login.token;
        },
        methods:{
            /**
             * TODO:图片上传
             * @param post
             * @param file
             */
            uploadFile:function (post,file) {
                let type = file.type;
                let typeArr = ['image/jpg','image/gif','image/png','image/jpeg'];
                if (!typeArr.includes(type)){
                    this.$message({type:'warning',message:'upload image format error'});
                    return false;
                }
                if (file.size>2*1024*1024){
                    this.$message({type:'warning',message:'upload image size error'});
                    return false;
                }
                let params = new FormData();
                params.append("file",file);
                params.append("token",this.token);
                params.append("rand",true);
                let config = {headers: {"Content-Type": "multipart/form-data","Authorization":`${func.set_password(func.set_random(32),func.set_random(12))}${this.token}${func.set_password(func.set_random(32),func.set_random(12))}`}}
                this.$http.post(this.uploadUrl,params,config).then(response=>{
                    this.$refs['md'].$img2Url(post, response.data.item.src);
                })
            },
            getData:function (data,render) {
                console.log(data,render);
            }
        },
    }
</script>

<style scoped>

</style>
