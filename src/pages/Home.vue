<template>
    <el-row :gutter="24">
        <BaseLayout></BaseLayout>
    </el-row>
</template>
<script>
import BaseLayout from '@/components/base/Base';

export default {
    name: 'Home',
    components: {
        BaseLayout
    }
};
</script>
