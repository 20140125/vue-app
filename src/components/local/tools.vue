<template>
    <!--<div id="app">-->
    <div class="layui-collapse">
        <div class="layui-colla-data.item">
            <h2 class="layui-colla-title">地区三级联动</h2>
            <div class="layui-colla-content layui-show" id="one">
                <div class="layui-form-data.item">
                    <div class="layui-input-inline">
                        <select name="province" class="layui-select layui-input" placeholder="" lay-search v-model="province_v" @change="province_one_change()">
                            <option v-for="(prov,index) in province_one" :value="prov.region_id">{{ prov.region_name }}</option>
                        </select>
                    </div>
                    <div class="layui-input-inline">
                        <select name="province" class="layui-select layui-input" placeholder="" lay-search v-model="city_v" @change="city_one_change()">
                            <option v-for="(city,index) in city_one" :value="city.region_id">{{ city.region_name }}</option>
                        </select>
                    </div>
                    <div class="layui-input-inline">
                        <select name="province" class="layui-select layui-input" lay-search placeholder="">
                            <option v-for="(county,index) in county_one" :value="county.region_id">{{ county.region_name }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-colla-data.item">
            <h2 class="layui-colla-title">地区五级联动(一张表)</h2>
            <div class="layui-colla-content layui-show">
                <div class="layui-form-data.item">
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" lay-search placeholder="" v-model="province_2v" @change="province_two_change()">
                                <option v-for="(prov,index) in province_two" :value="prov.code_id">{{ prov.position_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" lay-search placeholder="" v-model="city_2v" @change="city_two_change()">
                                <option v-for="(city,index) in city_two" :value="city.code_id">{{ city.position_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" lay-search placeholder="" v-model="county_2v" @change="county_two_change()">
                                <option v-for="(county,index) in county_two" :value="county.code_id">{{ county.position_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" lay-search placeholder="" v-model="town_2v" @change="town_two_change()">
                                <option v-for="(town,index) in town_two" :value="town.code_id">{{ town.position_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" lay-search placeholder="">
                                <option v-for="(village,index) in village_two" :value="village.code_id">{{ village.position_name }}</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-colla-data.item">
            <h2 class="layui-colla-title">地区五级联动(五张表)</h2>
            <div class="layui-colla-content layui-show">
                <div class="layui-form-data.item">
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" placeholder="" lay-search v-model="province_3v" @change="province_three_change()">
                                <option v-for="(prov,index) in province_three" :value="prov.province_id">{{ prov.province_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" lay-search class="layui-select layui-input" placeholder="" v-model="city_3v" @change="city_three_change()">
                                <option v-for="(city,index) in city_three" :value="city.city_id">{{ city.city_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" class="layui-select layui-input" lay-search placeholder="" v-model="county_3v" @change="county_three_change()">
                                <option v-for="(county,index) in county_three" :value="county.county_id">{{ county.county_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" lay-search class="layui-select layui-input" placeholder="" v-model="town_3v" @change="town_three_change()">
                                <option v-for="(town,index) in town_three" :value="town.town_id">{{ town.town_name }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="layui-input-inline">
                        <label>
                            <select name="province" lay-search class="layui-select layui-input" placeholder="">
                                <option v-for="(village,index) in village_three" :value="village.village_id">{{ village.village_name }}</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--</div>-->
</template>

<script>
    import api from '../../api/api'
    export default {
        name: "tools",
        data(){
            return {
                //三级联动
                province_one:[],
                province_f:'region_type',
                province_v:'1',
                city_one:[],
                city_v:'',
                county_one:[],

                //五级联动（一张表）
                province_two:[],
                province_2f:'parent_code_id',
                province_2v:'100000000000',
                city_two:[],
                city_2v:'',
                county_two:[],
                county_2v:'',
                town_two:[],
                town_2v:'',
                village_two:[],

                //五级联动（五张表）
                province_three:[],
                province_3f:'',
                province_3v:'',
                city_three:[],
                city_3v:'',
                county_three:[],
                county_3v:'',
                town_three:[],
                town_3v:'',
                village_three:[],
                table:'province',

                post:'POST',
                postId:'1'
            }
        },
        methods:{
            //三级联动
            getRegion:function () {
                this.postId = '1';
                let params = {field:this.province_f,value:this.province_v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.province_one = response.data.item;
                    this.county_one = '';
                });
            },
            province_one_change:function () {
                this.province_f = 'parent_id';
                this.postId = '1';
                let params = {field:this.province_f,value:this.province_v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.city_one = response.data.item;
                });
            },
            city_one_change:function () {
                this.province_f = 'parent_id';
                this.postId = '1';
                let params = {field:this.province_f,value:this.city_v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.county_one = response.data.item;
                });
            },

            //五级联动(一张表)
            getPosition:function () {
                this.postId = '2';
                let params = {field:this.province_2f,value:this.province_2v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.province_two = response.data.item;
                });
            },
            province_two_change:function () {
                this.postId = '2';
                let params = {field:this.province_2f,value:this.province_2v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.city_two = response.data.item;
                });
            },
            city_two_change:function () {
                let params = {field:this.province_2f,value:this.city_2v,postId:this.postId};
                this.postId = '2';
                api.LocalTools(params).then(response=>{
                    this.county_two = response.data.item;
                });
            },
            county_two_change:function () {
                this.postId = '2';
                let params = {field:this.province_2f,value:this.county_2v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.town_two = response.data.item;
                });
            },
            town_two_change:function () {
                this.postId = '2';
                let params = {field:this.province_2f,value:this.town_2v,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.village_two = response.data.item;
                });
            },

            //五级联动(五张表)
            getPosition2:function () {
                this.postId = '3';
                let params = {field:this.province_3f,value:this.province_3v,table:this.table,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.province_three = response.data.item;
                });
            },
            province_three_change:function () {
                let params = {field:this.province_3f,value:this.province_3v,table:this.table,postId:this.postId};
                this.table = 'city';
                this.province_3f = 'province_id';
                this.postId = '3';
                api.LocalTools(params).then(response=>{
                    this.city_three = response.data.item;
                });
            },
            city_three_change:function () {
                this.table = 'county';
                this.province_3f = 'city_id';
                this.postId = '3';
                let params = {field:this.province_3f,value:this.city_3v,table:this.table,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.county_three = response.data.item;
                });
            },
            county_three_change:function () {
                this.table = 'town';
                this.province_3f = 'county_id';
                this.postId = '3';
                let params = {field:this.province_3f,value:this.county_3v,table:this.table,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.town_three = response.data.item;
                });
            },
            town_three_change:function () {
                this.table = 'village';
                this.province_3f = 'town_id';
                this.postId = '3';
                let params = {field:this.province_3f,value:this.town_3v,table:this.table,postId:this.postId};
                api.LocalTools(params).then(response=>{
                    this.village_three = response.data.item;
                });
            }
        },
        mounted:function () {
            this.$nextTick(function () {
                this.getRegion();    //三级联动
                this.getPosition();  //五级联动(-张表)
                this.getPosition2(); //五级联动（五张表）
            })
        }
    }
</script>

<style scoped>

</style>
