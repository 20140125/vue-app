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
            <span slot="tip" v-if="showTips" class="el-upload__tip" style="margin-left: 20px;">{{ !tips ? '请上传'+imgWidth+'*'+imgHeight+'的 jpg/png 图片' : tips }}</span>
        </el-upload>
        <canvas id="s-award-canvas" :width="canvasObj.width" :height="canvasObj.height" style="display: none; background:transparent;"></canvas>
        <!--分享配图-->
        <!--        <el-image v-for="(image,index) in canvasImageArr" :key="index"  :src="image" v-if="canvasImageArr.length > 0" :preview-src-list="[image]" style="object-fit: contain;width: 150px;height: 150px"></el-image>-->
    </div>
</template>

<script>

export default {
    name: 'SetCanvasImage',
    props:{
        /* 图片数组 */
        fileList: {
            type: Array,
            default: () => []
        },
        /* 图片宽度 */
        imgWidth: {
            type:Number,
            default:() => 320
        },
        /* 图片高度 */
        imgHeight: {
            type: Number,
            default: () => 250
        },
        /* 图片大小 */
        fileSize: {
            type: Number,
            default: () => 1024  //KB
        },
        /* 图片上传个数 */
        uploadLimit: {
            type: Number,
            default:()=> 1
        },
        /* 图片宽度 */
        name: {
            type: String,
            default:()=>'file'
        },
        /* 是否展示图片说明 */
        showTips: {
            type: Boolean,
            default: () => true
        },
        /* 图片上传地址 */
        action: {
            type: String,
            default: () => 'http://wxpay.oa.com/mchplatform/mmpaymchoaweb/uploadfile2cdn?busiName=wxpay_discount'
        },
        /*
         * 生成图片的参数：
         * 类型：（ =1 AwardTypeWePayFavor 表示代金券， =2 AwardTypeCashOutFree 提现免费券，=3 AwardTypeWxCard 表示卡券，=4 AwardTypeBusiFavor 商家券， =5 AwardTypeCouponPackage 预约制立减金）
         * 金额，
         * 名称，
         * 明细
         * */
        canvasItem: {
            type: Object,
            default: () => {}
        },
        /* 图片说明 */
        tips: {
            type:String | Boolean,
            default: false
        }
    },
    data(){
        return {
            // canvasImageArr: [],
            imageViewLists: [],
            canvasObj: { width: this.imgWidth, height: this.imgHeight },
            shareImageItem: {}
        }
    },
    watch:{
        fileList: function () {
            this.imageViewLists = this.fileList
        }
    },
    created() {
        let weChatStdFace = new FontFace('WeChat-Sans-Std-Medium', 'url("https://wx.gtimg.com/mmpayweb/WxPayPreferential/img/WeChatSansStd-Medium.ttf")')
        weChatStdFace.load().then(font => {
            document.fonts.add(font)
        })
        let weChatSSFace = new FontFace('WeChat-Sans-SS-Medium', 'url("https://wx.gtimg.com/mmpayweb/WxPayPreferential/img/WeChatSansSS-Medium.ttf")')
        weChatSSFace.load().then(font => {
            document.fonts.add(font)
        })
        this.imageViewLists = this.fileList
    },
    methods:{
        /**
         * todo:文件上传
         * @param file
         */
        uploadFile:function(file) {
            /* 券类型是微信提现免费券和立减金的时候生成优惠配图和分享配图静默上传 */
            switch (this.canvasItem.canvas) {
                case 'award':
                    if (this.canvasItem.cost === '' || this.canvasItem.cost < 0) {
                        this.$emit('setCanvasImageErr','award')
                    } else {
                        this.canvasImage(file.file,file.file.name)
                    }
                    break;
                case 'share':
                    if (!this.canvasItem.name || !this.canvasItem.desc || this.canvasItem.name === '' || this.canvasItem.desc === '') {
                        this.$emit('setCanvasImageErr','share')
                    } else {
                        this.canvasImage(file.file,file.file.name)
                    }
                    break;
            }
        },
        /**
         * todo:绘制图片
         * @param file
         * @param filename
         */
        canvasImage:function (file, filename) {
            this.shareImageItem = {}
            this.imageViewLists = []
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                const image = new Image()
                image.src = e.target.result
                image.onload = () => {
                    const canvas =  document.getElementById('s-award-canvas')
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    this.$emit('setBackgroundColor', wxpay.RgbToHex(ctx.getImageData(0, 0,image.width, image.height).data))
                    this.canvasItem.canvas === 'award' ? this.drawAwardImages(image, filename) :  this.drawShareImages(image, filename)
                }
            }
        },
        rgbToHex: function (val) {
            let color = []
            let r = 0
            let g = 0
            let b = 0
            let a = 0
            for (let i = 0; i < val.length; i+=4) {
                if (i+4 < val.length) {
                    r += parseInt(val[i], 10)
                    g += parseInt(val[i+1], 10)
                    b += parseInt(val[i+2], 10)
                    a += parseInt(val[i+3], 10)
                }
            }
            let len = val.length / 4
            let rgba = [Math.ceil(r / len), Math.ceil(g / len), Math.ceil(b / len)]
            let digits = '0123456789abcdef'.split('')
            rgba.forEach((item) => {
                let base16 = parseInt(item > 30 ? (item - 30).toString() : item).toString(16)
                digits.includes(base16) ? color.push('0'+base16) : color.push(base16)
            })
            return '#'+color.join('')
        }
        /**
         * todo:生成优惠配图
         * @param image
         * @param filename
         */
        drawAwardImages:function(image, filename) {
            const canvas =  document.getElementById('s-award-canvas')
            const ctx = canvas.getContext('2d')
            /*生成优惠配图*/
            this.setAwardImage(ctx, image, canvas, filename)
        },
        /**
         * todo:生成分享配图
         * @param image
         * @param filename
         */
        drawShareImages: function (image, filename) {
            const canvas =  document.getElementById('s-shard-canvas')
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
            // ctx.beginPath()
            // ctx.fillStyle = '#FFFFFF'
            // ctx.fillRect(0,0,this.canvasObj.width,this.canvasObj.height)
            // ctx.save()
            /* 生成优惠配图和分享配图 */
            ctx.beginPath()
            switch (this.canvasItem.type) {
                /* 代金券 */
                case 1:
                    /* 立减金分享配图 */
                    ctx.fillStyle = '#FFFFFF'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = '110px WeChat-Sans-SS-Medium'
                    ctx.fillText(this.canvasItem.cost, 60, 170)
                    ctx.font = 'normal 64px WeChat-Sans-Std-Medium'
                    let x1 = this.canvasItem.cost.toString().includes('.') ? 40 : 20
                    ctx.fillText('元', this.canvasItem.cost.toString().length * x1 + 105, 165)
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
                    ctx.font = 'bold 55px WeChat-Sans-Std-Medium'
                    ctx.fillText('￥', 35, 85)
                    ctx.font = '100px WeChat-Sans-Std-Medium'
                    let x2 = this.canvasItem.cost.toString().substring(0,1) === '1' ? 80 : 85
                    ctx.fillText(this.canvasItem.cost, x2, 120)
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
            // this.canvasImageArr.push(canvas.toDataURL('image/png'))
            /* 上传分享配图 */
            this.toUploadNewFile(canvas,filename,canvas.toDataURL('image/png'),'share_')
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
            // ctx.beginPath()
            // ctx.fillStyle = '#FFFFFF'
            // ctx.fillRect(0,0,this.canvasObj.width,this.canvasObj.height)
            // ctx.save()
            ctx.beginPath()
            switch (this.canvasItem.type) {
                /* 代金券 */
                case 1:
                    /* 立减金优惠配图 */
                    ctx.fillStyle = '#FFFFFF'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = '110px WeChat-Sans-SS-Medium'
                    ctx.fillText(this.canvasItem.cost, 60, 170)
                    ctx.font = 'normal 64px WeChat-Sans-Std-Medium'
                    let x1 = this.canvasItem.cost.toString().includes('.') ? 40 : 20
                    ctx.fillText('元', this.canvasItem.cost.toString().length * x1 + 105, 165)
                    break
                /* 提现免费券 */
                case 2:
                    /* 提现免费券优惠配图 */
                    ctx.fillStyle = '#C35725'
                    ctx.textAlign = 'left'
                    ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight)
                    ctx.font = 'bold 55px WeChat-Sans-Std-Medium'
                    ctx.fillText('￥', 35, 85)
                    ctx.font = '100px WeChat-Sans-Std-Medium'
                    let x2 = this.canvasItem.cost.toString().substring(0,1) === '1' ? 80 : 85
                    ctx.fillText(this.canvasItem.cost, x2, 120)
                    break
            }
            ctx.save()
            // this.canvasImageArr.push(canvas.toDataURL('image/png'))
            /* 上传优惠配图 */
            this.toUploadNewFile(canvas,filename,canvas.toDataURL('image/png'))
        },
        /**
         * todo:上传新优惠配图和分享配图
         * @param canvas
         * @param filename
         * @param images
         * @param type 根据类型判断替换临时图片
         */
        toUploadNewFile: async function (canvas,filename,images,type = '') {
            /* 生成二进制流上传图片 */
            let arr = images.split(','), mime = ((arr[0] || []).match(/:(.*?);/) || [])[1], bstr = atob(arr[1] || []), n = bstr.length, u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            let file = new File([u8arr], filename, {type: mime})
            file.uid = new Date().getTime()
            // this.imageViewLists = [{url:images,name:filename}]
            // return;
            /* 创建form对象 */
            let param = new FormData()
            param.append('file', file)
            param.append('filename', file.name)
            /* 添加请求头 */
            let config = { headers: { "Content-Type": "multipart/form-data" } }
            this.$http.post(this.action, param, config).then(response => {
                if (response && response.data.call_retcode === 0) {
                    /* 生成的图片参数 */
                    this.shareImageItem = { url: response.data.file_url, name: type + this.name }
                    this.$emit('setUploadSuccess',this.shareImageItem)
                    if (type === '') {
                        /* 替换临时图片地址 */
                        this.imageViewLists = [{ url: response.data.file_url, name: filename }]
                    }
                }
            }).catch(() => {
                file.onError();
            });
        },
        /**
         * todo:上传图片前处理函数
         * @param file
         * @returns {Promise<*>|boolean}
         */
        beforeUpload:function(file) {
            const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
            const isLt30KB = file.size / 1024 / this.fileSize < 1
            if (!isJPG) {
                this.$message.error("上传图片只能是 jpg、png 格式!")
                return false
            }
            if (!isLt30KB) {
                this.$message.error("上传图片大小不能超过 "+this.fileSize+"KB!")
                return false;
            }
            let __this = this
            if (!this.imgHeight && !this.imgWidth) {
                return isJPG && isLt30KB
            }
            const isSize = new Promise(function(resolve, reject) {
                let width = __this.imgWidth
                let height = __this.imgHeight
                let _URL = window.URL || window.webkitURL
                let image = new Image()
                image.onload = function() {
                    let valid =(image.width === width && image.height === height)
                        || (image.width >= width-10 && image.height >= height-10 && image.width <= width+10 && image.height <= height+10)
                    valid ? resolve() : reject()
                };
                image.src = _URL.createObjectURL(file)
            }).then(() => {
                    return file
                }, () => {
                    __this.$message.error("上传图片尺寸不符合,只能是"+__this.imgWidth+"*"+__this.imgHeight+"!")
                    return Promise.reject()
                }
            );
            return isJPG && isLt30KB && isSize
        },
    }
}
</script>

<style scoped>
</style>
