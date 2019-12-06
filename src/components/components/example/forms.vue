<template>
    <FormComponent :search-options="searchOptions" :form-data="formData"/>
</template>

<script>
    import FormComponent from '../form-component'
    export default {
        name: 'forms',
        components: {FormComponent},
        data(){
            return {
                dialogVisible:true,
                formData:{
                    datetime:[],
                    name:'',
                    radio:'1',
                    select:''
                },
                searchOptions:[
                    {
                        type:'datetime',
                        label:'DateTime',
                        prop:'datetime',
                        model:[],
                        datetype:'daterange',
                        format:'yyyy-MM-dd',
                        tips:'Please select params - Please select params'
                    },
                    {
                        type:'input',
                        label:'Name',
                        prop:'name',
                        model:'',
                        tips:'Please input params'
                    },
                    {
                        type:'radio',
                        label:'Radio',
                        prop:'radio',
                        model:'1',
                        tips:'Please select params',
                        options:[
                            {
                                label:'1',
                                value:'Close',
                            },
                            {
                                label:'2',
                                value:'Open',
                            },
                        ],
                    },
                    {
                        type:'select',
                        label:'Select',
                        prop:'select',
                        model:'',
                        options:[
                            {
                                label:'Successfully',
                                value:'1',
                            },
                            {
                                label:'Offline',
                                value:'2',
                            },
                            {
                                label:'Failed',
                                value:'3',
                            },
                        ],
                        tips:'Please select params'
                    },
                ],
            }
        }
    }
</script>

<style scoped>

</style>
