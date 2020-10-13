<template>
    <div id="app">
        <json-viewer :value="jsonData" :expand-depth=expand copyable boxed sort/>
    </div>
</template>

<script>
    import JsonViewer from "vue-json-viewer"
    export default {
        name: "json",
        props:{
            jsonData:{
                type:Object|Array,
                default:()=>{}
            },
            expand:{
                type:Number,
                default:()=>5,
            }
        },
        components:{
            JsonViewer
        },
    }
</script>

<style scoped>

</style>
