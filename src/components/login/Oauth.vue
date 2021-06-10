<template>
    <div>
        <el-button style="margin-bottom: 10px" plain v-for="(oauth,index) in oauthConfig" type="primary" :key="index" v-if="oauth.status === 1" @click="oauthLogin(oauth.value)">
            {{oauth.name.toUpperCase()}}
        </el-button>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'Oauth',
        computed: {
            ...mapGetters(['oauthConfig'])
        },
        methods: {
            /**
             * TODO:授权登录
             * @param href
             */
            oauthLogin: function (href) {
                window.open(href, '_self')
            }
        }
    }
</script>

<style scoped>

</style>
