<template>
    <div>
        <el-upload
            class="upload-demo"
            :name="name"
            :http-request="uploadFile"
            :action="action"
            :before-upload="beforeUpload"
            :limit="uploadLimit"
            :file-list="imageViewLists"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" v-if="showTips" class="el-upload__tip" style="margin-left: 20px;">请上传{{imgWidth}}*{{imgHeight}}的 jpg/png 图片</span>
        </el-upload>
        <canvas id="s-award-canvas" :width="canvasObj.width" :height="canvasObj.height" style="display: none"></canvas>
        <!--分享配图-->
        <el-image v-for="(image,index) in canvasImageArr" :key="index"  :src="image" v-if="canvasImageArr.length > 0" :preview-src-list="[image]" style="object-fit: contain;width: 150px;height: 150px"></el-image>
    </div>
</template>

<script>
    export default {
        name: 'SetCanvasImage',
        props: {
            fileList: {
                type: Array,
                default: () => []
            },
            imgWidth: {
                type: Number,
                default: () => 320
            },
            imgHeight: {
                type: Number,
                default: () => 250
            },
            fileSize: {
                type: Number,
                default: () => 1024 // KB
            },
            uploadLimit: {
                type: Number,
                default: () => 1
            },
            name: {
                type: String,
                default: () => 'file'
            },
            showTips: {
                type: Boolean,
                default: () => true
            },
            action: {
                type: String,
                default: () => process.env.API_ROOT + 'v1/common/upload'
            },
            /* 分享图片的参数：
            类型：（
                  =1 AwardTypeWePayFavor 表示代金券，
                  =2 AwardTypeCashOutFree 提现免费券，
                  =3 AwardTypeWxCard 表示卡券，
                  =4 AwardTypeBusiFavor 商家券，
                  =5 AwardTypeCouponPackage 预约制立减金）
              金额，
              名称，
              明细 */
            canvasItem: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                canvasImageArr: [],
                imageViewLists: [],
                canvasObj: {width: this.imgWidth, height: this.imgHeight},
                shareImageItem: {}
            }
        },
        watch: {
            fileList: function () {
                this.imageViewLists = this.fileList
            }
        },
        created () {
            this.imageViewLists = this.fileList
        },
        methods: {
            /**
             * todo:文件上传
             * @param file
             */
            uploadFile: function (file) {
                /* 券类型是微信提现免费券和立减金的时候生成优惠配图和分享配图静默上传 */
                switch (this.canvasItem.canvas) {
                case 'award':
                    if (!this.canvasItem.cost || this.canvasItem.cost === '' || this.canvasItem.cost === 0) {
                        this.$emit('setCanvasImageErr', 'award')
                    } else {
                        this.canvasImage(file.file, file.file.name)
                    }
                    break
                case 'share':
                    if (!this.canvasItem.name || !this.canvasItem.desc || this.canvasItem.name === '' || this.canvasItem.desc === '') {
                        this.$emit('setCanvasImageErr', 'share')
                    } else {
                        this.canvasImage(file.file, file.file.name)
                    }
                    break
                }
            },
            /**
             * todo:绘制图片
             * @param file
             * @param filename
             */
            canvasImage: function (file, filename) {
                this.shareImageItem = {}
                this.imageViewLists = []
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (e) => {
                    const image = new Image()
                    image.src = e.target.result
                    image.onload = () => {
                        this.canvasItem.canvas === 'award' ? this.drawAwardImages(image, filename) : this.drawShareImages(image, filename)
                    }
                }
            },
            /**
             * todo:生成优惠配图
             * @param image
             * @param filename
             */
            drawAwardImages: function (image, filename) {
                const canvas = document.getElementById('s-award-canvas')
                const ctx = canvas.getContext('2d')
                /* 生成优惠配图 */
                this.setAwardImage(ctx, image, canvas, filename)
            },
            /**
             * todo:生成分享配图
             * @param image
             * @param filename
             */
            drawShareImages: function (image, filename) {
                const canvas = document.getElementById('s-shard-canvas')
                const ctx = canvas.getContext('2d')
                this.setShareImage(ctx, image, canvas, filename)
            },
            /**
             * todo:生成分享配图
             * @param ctx
             * @param image 图片资源
             * @param canvas
             * @param filename 图片名称
             */
            setShareImage: function (ctx, image, canvas, filename) {
                /* 生成画布 Start */
                ctx.beginPath()
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(0, 0, this.canvasObj.width, this.canvasObj.height)
                ctx.save()
                /* 生成优惠配图和分享配图 */
                ctx.beginPath()
                switch (this.canvasItem.type) {
                /* 代金券 */
                case 1:
                    /* 立减金分享配图 */
                    ctx.fillStyle = '#FFFFFF'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = '64px WeChat-Sans-SS-Medium'
                    ctx.fillText(this.canvasItem.cost, 100, 220)
                    ctx.font = 'normal 32px PingFangSC-Medium'
                    let xx = this.canvasItem.cost.toString().substring(0, 1) === '1' ? 25 : 26
                    ctx.fillText('元', this.canvasItem.cost.toString().length * xx + 117, 215)
                    /* 分享图下面的文案 */
                    ctx.fillStyle = '#2C2C2C'
                    ctx.textAlign = 'center'
                    ctx.font = 'normal bold 26px PingFangSC-Medium'
                    ctx.fillText(this.canvasItem.name, 212, this.imgHeight)
                    ctx.font = 'normal 22px PingFangSC-Regular'
                    ctx.fillText(this.canvasItem.desc, this.canvasItem.name.length * 28 + 102, this.imgHeight + 35)
                    break
                /* 提现免费券 */
                case 2:
                    /* 提现免费券分享配图 */
                    ctx.fillStyle = '#C35725'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = 'bold 32px PingFangSC-Medium'
                    ctx.fillText('￥', 95, 205)
                    ctx.font = '64px WeChat-Sans-SS-Medium'
                    let x = this.canvasItem.cost.toString().substring(0, 1) === '1' ? 130 : 125
                    ctx.fillText(this.canvasItem.cost, x, 223)
                    /* 分享图下面的文案 */
                    ctx.fillStyle = '#2C2C2C'
                    ctx.textAlign = 'center'
                    ctx.font = 'normal bold 26px PingFangSC-Medium'
                    ctx.fillText(this.canvasItem.name, 214, this.imgHeight)
                    ctx.font = 'normal 22px PingFangSC-Regular'
                    ctx.fillText(this.canvasItem.desc, this.canvasItem.name.length * 20 + 94, this.imgHeight + 35)
                    break
                }
                ctx.save()
                this.canvasImageArr.push(canvas.toDataURL('image/jpeg'))
                /* 上传分享配图 */
                this.toUploadNewFile(canvas, filename, canvas.toDataURL('image/jpeg'), 'share_')
            },
            /**
             * todo:生成优惠配图
             * @param ctx
             * @param image 图片资源
             * @param canvas
             * @param filename 图片名称
             */
            setAwardImage: function (ctx, image, canvas, filename) {
                /* 生成画布 Start */
                ctx.beginPath()
                ctx.fillStyle = '#FFFFFF'
                ctx.fillRect(0, 0, this.canvasObj.width, this.canvasObj.height)
                ctx.save()
                ctx.beginPath()
                switch (this.canvasItem.type) {
                /* 代金券 */
                case 1:
                    /* 立减金优惠配图 */
                    ctx.fillStyle = '#FFFFFF'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = '64px WeChat-Sans-SS-Medium'
                    ctx.fillText(this.canvasItem.cost, 100, 220)
                    ctx.font = 'normal 32px PingFangSC-Medium'
                    let xx = this.canvasItem.cost.toString().substring(0, 1) === '1' ? 25 : 26
                    ctx.fillText('元', this.canvasItem.cost.toString().length * xx + 117, 215)
                    break
                /* 提现免费券 */
                case 2:
                    /* 提现免费券优惠配图 */
                    ctx.fillStyle = '#C35725'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = 'bold 32px PingFangSC-Medium'
                    ctx.fillText('￥', 95, 205)
                    ctx.font = '64px WeChat-Sans-SS-Medium'
                    let x = this.canvasItem.cost.toString().substring(0, 1) === '1' ? 130 : 125
                    ctx.fillText(this.canvasItem.cost, x, 223)
                    break
                }
                ctx.save()
                this.canvasImageArr.push(canvas.toDataURL('image/jpeg'))
                /* 上传优惠配图 */
                this.toUploadNewFile(canvas, filename, canvas.toDataURL('image/jpeg'))
            },
            /**
             * todo:上传新优惠配图和分享配图
             * @param canvas
             * @param filename
             * @param images
             * @param type 根据类型判断替换临时图片
             */
            toUploadNewFile: async function (canvas, filename, images, type = '') {
                /* 生成二进制流上传图片 */
                // eslint-disable-next-line one-var
                let arr = images.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                let file = new File([u8arr], filename, {type: mime})
                file.uid = new Date().getTime()
                // this.imageViewLists = [{url:images,name:filename}]
                /* 创建form对象 */
                let param = new FormData()
                param.append('file', file)
                param.append('filename', file.name)
                /* 添加请求头 */
                let config = {headers: {'Content-Type': 'multipart/form-data'}}
                this.$http.post(this.action, param, config).then(response => {
                    if (response && response.data.call_retcode === 0) {
                        /* 生成的图片参数 */
                        this.shareImageItem = {url: response.data.file_url, name: type + this.name}
                        this.$emit('setUploadSuccess', this.shareImageItem)
                        if (type === '') {
                            /* 替换临时图片地址 */
                            this.imageViewLists = [{url: response.data.file_url, name: filename}]
                        }
                    }
                }).catch(() => {
                    file.onError()
                })
            },
            /**
             * todo:上传图片前处理函数
             * @param file
             * @returns {Promise<*>|boolean}
             */
            beforeUpload: function (file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
                const isLt30KB = file.size / 1024 / this.fileSize < 1
                if (!isJPG) {
                    this.$message.error('上传图片只能是 jpg、png 格式!')
                    return false
                }
                if (!isLt30KB) {
                    this.$message.error('上传图片大小不能超过 ' + this.fileSize + 'KB!')
                    return false
                }
                let __this = this
                if (!this.imgHeight && !this.imgWidth) {
                    return isJPG && isLt30KB
                }
                const isSize = new Promise(function (resolve, reject) {
                    let width = __this.imgWidth
                    let height = __this.imgHeight
                    let _URL = window.URL || window.webkitURL
                    let image = new Image()
                    image.onload = function () {
                        let valid = (image.width === width && image.height === height) ||
                            (image.width >= width - 10 && image.height >= height - 10 && image.width <= width + 10 && image.height <= height + 10)
                        // eslint-disable-next-line prefer-promise-reject-errors
                        valid ? resolve() : reject()
                    }
                    image.src = _URL.createObjectURL(file)
                }).then(() => {
                    return file
                }, () => {
                    __this.$message.error('上传图片尺寸不符合,只能是' + __this.imgWidth + '*' + __this.imgHeight + '!')
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject()
                }
                )
                return isJPG && isLt30KB && isSize
            }
        }
    }
</script>

<style scoped>
@font-face {
    font-family: 'WeChat-Sans-SS-Medium';
    src: url("https://wx.gtimg.com/mmpayweb/WxPayPreferential/img/WeChatSansSS-Medium.ttf");
}
@font-face {
    font-family: 'WeChat-Sans-SS-Bold';
    src: url("https://wx.gtimg.com/mmpayweb/WxPayPreferential/img/WeChatSansSS-Bold.ttf");
}
@font-face {
    font-family: 'PingFangSC-Semibold';
    src: url("https://wx.gtimg.com/mmpayweb/WxPayPreferential/img/PingFangSC-Semibold.ttf");
}
</style>
