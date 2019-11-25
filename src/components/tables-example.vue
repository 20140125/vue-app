<template>
    <div>
        <Table :data="data" :columns="columns" :search-options="searchOptions" :search-option="searchOption"></Table>
    </div>
</template>

<script>
    import Table from './common/table'
    export default {
        name: "empty",
        components: {Table},
        data(){
            return {
                columns: [
                    {
                        label: 'Name',
                        prop: 'name'
                    },
                    {
                        label: 'Age',
                        prop: 'age'
                    },
                    {
                        label: 'Address',
                        prop: 'address'
                    },
                    {
                        label: 'Date',
                        prop: 'date'
                    }
                ],
                data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ],
                searchOptions:[
                    {
                        type:'datetime',
                        label:'DateTime',
                        prop:'datetime',
                        model:[],
                        tips:'开始时间-结束时间'
                    },
                    {
                        type:'input',
                        label:'Name',
                        prop:'name',
                        model:'',
                        tips:'请输入用户名称'
                    },
                    {
                        type:'input',
                        label:'School',
                        prop:'school',
                        model:'',
                        tips:'请输入学校名称'
                    },
                    {
                        type:'select',
                        label:'Type',
                        prop:'type',
                        model:'',
                        options:[
                            {
                                label:'已经完成',
                                value:'1',
                            },
                            {
                                label:'未完成',
                                value:'2',
                            },
                            {
                                label:'正在完成',
                                value:'3',
                            },
                            {
                                label:'完成中',
                                value:'4',
                            }
                        ],
                        tips:'请选择类型'
                    },
                ],
                searchOption:{
                    'datetime':'',
                    'name':'',
                    'type':'',
                    'school':''
                }
            }
        },
    }
</script>

<style scoped>

</style>
