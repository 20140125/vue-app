<template>
    <div style="margin: 20px 0">
        <el-button type="primary" plain v-for="(item, index) in oAuthConfig.children" :key="index">{{item.name.toUpperCase()}}</el-button>
    </div>
</template>

<script>
export default {
    name: 'OAuth',
    props: ['oauthLogin'],
    data () {
        return {}
    },
    computed: {
        oAuthConfig() {
            return this.$store.state.login.oauthConfig
        }
    },
    watch: {
        async oauthLogin () {
            if (this.oauthLogin) {
                await this.$store.dispatch('login/getOauthConfig', { name: 'Oauth', login: 'before' })
            }
        }
    }
}
</script>

<style scoped>

</style>
