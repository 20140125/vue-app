<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="s" auto-complete="true"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select style="width: 200px" v-model="form" @change="searchMusic()">
                    <el-option value="api">api</el-option>
                    <el-option value="mysql">mysql</el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchMusic"></el-button>
                <el-button type="primary" icon="el-icon-service" v-if="showBtn!==false" @click="showDialog">正在播放：{{title}}</el-button>
            </el-form-item>
        </el-form>
        <!--列表-->
        <el-table :data="musicModel" v-loading="loading" :element-loading-text="loadingText" border>
            <el-table-column label="#" prop="id" width="100px"></el-table-column>
            <el-table-column label="歌曲ID" prop="music_id"></el-table-column>
            <el-table-column label="歌曲名称" prop="music_name"></el-table-column>
            <el-table-column label="封面">
                <template slot-scope="scope">
                    <img :src="scope.row.pic_url" alt="" width="50px">
                </template>
            </el-table-column>
            <el-table-column label="时长(s)" prop="music_time" sortable></el-table-column>
            <el-table-column label="歌手ID" prop="singer_id"></el-table-column>
            <el-table-column label="歌手名" prop="singer_name"></el-table-column>
            <el-table-column label="类型" prop="search_type_name"></el-table-column>
            <el-table-column label="关键词" prop="s"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button size="mini" round type="primary" icon="el-icon-service" @click="play(scope.$index)">播放</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin: 25px 0">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    :page-sizes="[10, 15, 30, 50]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :current-page="page">
            </el-pagination>
        </div>
        <!--弹框播放-->
        <el-dialog :visible.sync="visible" :title="title" :modal="modal" center :show-close="modal">
            <el-form>
                <el-form-item style="text-align: center">
                    <img :src="picUrl" alt="" width="200px"/>
                    <audio :src="src" controls style="width: 100%;margin-top: 20px;" autoplay id="music"></audio>
                    <el-button type="primary" icon="el-icon-caret-left" v-if="page>=1" @click="prevMusic">上一首</el-button>
                    <el-button type="primary" icon="el-icon-service" @click="pauseMusic">播放/暂停</el-button>
                    <el-button type="primary" icon="el-icon-service" @click="referMusic">重新播放</el-button>
                    <el-button type="primary" icon="el-icon-caret-right" v-if="page<=pages" @click="nextMusic">下一首</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import apiLists from '../../api/api'
    export default {
        name: "lists",
        data(){
            return {
                loading:true,
                loadingText:'玩命加载中...',
                musicModel:[],
                total:0,
                limit:15,
                page:1,
                s:'',
                form:'mysql',
                search_type:1,
                labelWidth:'80px',
                visible:false,
                intVal:0,
                indexVal:0,
                modal:false,
                src:'',
                title:'',
                picUrl:'',
                lyric:'',
                playing:false,  //是否播放
                showBtn:false,  //展示浮窗
                pages:0
            }
        },
        methods:{
            /**
             * todo：获取音乐列表
             * @param page
             * @param limit
             */
            getMusicLists:function (page,limit) {
                let params = {page: page, limit: limit, search_type: this.search_type, s: this.s, form: this.form };
                apiLists.MusicLists(params).then(response=>{
                   if (response.data.code === 200){
                       this.loading = false;
                       this.musicModel = response.data.item.data;
                       this.total = response.data.item.total;
                       this.pages = Math.ceil(this.total/this.limit);
                   }
                });
            },
            /**
             * todo：歌曲搜索
             */
            searchMusic:function () {
                this.getMusicLists(this.page,this.limit)
            },
            /**
             * todo：音乐播放
             * @param index
             */
            play:function(index){
                this.musicModel[index].token = this.token;
                this.musicModel[index].form = this.form;
                let params = this.musicModel[index];
                apiLists.MusicPlay(params).then(response=>{
                    if (response.data.code === 200) {
                        this.visible = true;
                        this.title = this.musicModel[index].music_name; //歌曲名称
                        this.src = response.data.item.music_url; //歌曲链接
                        this.picUrl = this.musicModel[index].pic_url; //封面图
                        this.lyric = response.data.item.lyric; //歌词
                        this.intVal = 0;  //歌曲播放时长
                        this.indexVal = eval(index+1); //接口返回数据下标
                        this.playing = true;
                    }
                });
            },
            /**
             * todo：定时器
             */
            clock:function () {
                this.intVal++;
                //如果下标等于每页显示的记录数 ，则需要进行翻页操作。
                if (this.musicModel[this.indexVal-1] && this.intVal===parseInt(this.musicModel[this.indexVal-1].music_time)) {
                    if (this.indexVal === this.limit){
                        this.indexVal = 0;
                        this.page++;
                        this.getMusicLists(this.page,this.limit);
                    }
                    this.play(this.indexVal);
                }
                console.log('===当前页==='+this.page);
                console.log('===当前播放歌曲==='+this.indexVal);
                console.log('===当前歌曲播放时长==='+this.intVal);
                console.log('===当前歌曲播放状态==='+this.playing);
                if (true!==this.visible){
                    this.showBtn = true;
                }
            },
            /**
             * todo：展示浮窗，显示播放歌曲
             */
            showDialog:function(){
                this.visible = true;
                this.showBtn = false;
            },
            /**
             * todo：播放/暂停
             */
            pauseMusic:function(){
                let audio = document.getElementById("music");
                if(audio.paused) {
                    audio.play();
                }else{
                    audio.pause();
                }
                this.playing=!this.playing;
                this.intVal = Math.floor(audio.currentTime);
                console.log(this.playing);
            },
            /**
             * todo：重新播放
             */
            referMusic:function(){
                let audio = document.getElementById("music");
                this.intVal = 0;
                this.playing = true;
                audio.currentTime = 0;
            },
            /**
             * todo：上一首
             */
            prevMusic:function(){
                if (this.indexVal===1){
                    this.page = this.page>1?this.page-1:this.page;
                    this.getMusicLists(this.page,this.limit);
                    this.indexVal = this.limit-1;
                    this.play(this.indexVal);
                }else {
                    this.indexVal = this.indexVal-2;
                    this.play(this.indexVal);
                }
            },
            /**
             * todo：下一首
             */
            nextMusic:function(){
                if (this.indexVal === this.limit){
                    this.page = this.page>this.pages?this.page:eval(this.page+1);
                    this.getMusicLists(this.page,this.limit);
                    this.indexVal = 0;
                }
                this.play(this.indexVal);
            },
            /**
             * todo：每页记录改变
             * @param val
             */
            sizeChange:function (val) {
                this.limit = val;
                this.getMusicLists(this.page,this.limit);
            },
            /**
             * todo：改变当前页
             * @param val
             */
            currentChange:function (val) {
                this.page = val;
                this.getMusicLists(this.page,this.limit);
            }
        },
        created(){
            setInterval(() => {
                if (false!==this.playing){
                    this.clock()
                }
            }, 1000);
        },
        mounted() {
            this.$nextTick(function () {
                this.getMusicLists(this.page,this.limit)
            })
        }
    }
</script>

<style scoped>

</style>
