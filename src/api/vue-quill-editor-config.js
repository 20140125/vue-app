import func from './func';
import $url from './url';
// 图片上传参数配置
const uploadConfig = {
    action:  process.env.API_ROOT+$url.fileUpload,  // 必填参数 图片上传地址
    methods: 'POST',  // 必填参数 图片上传方式
    token:  localStorage.token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'file',  // 必填参数 文件的参数名
    size: 2,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    rand:true,  //名字是否覆盖
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',  // 可选 可上传的图片格式
}

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['link', 'image', 'video']
]

// handler重写事件, 任何工具按钮的功能都可以重写，这里只重写图片上传事件
const handlers = {
    image: function image() {
        let self = this;
        let fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name);
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept);
            fileInput.classList.add('ql-image');
            // 监听选择文件
            fileInput.addEventListener('change', function () {
                // 如果图片限制大小
                if (uploadConfig.size && fileInput.files[0].size >= uploadConfig.size * 1024) {
                    fileInput.value = ''
                    return
                }
                // 创建formData
                let formData = new FormData()
                formData.append(uploadConfig.name, fileInput.files[0])
                // 如果需要token且存在token
                if (uploadConfig.token) {
                    formData.append('token', uploadConfig.token)
                }
                // 如果需要随机命名
                if (uploadConfig.rand) {
                    formData.append('rand', uploadConfig.rand)
                }
                // 图片上传
                let xhr = new XMLHttpRequest()
                xhr.open(uploadConfig.methods, uploadConfig.action, true)
                xhr.setRequestHeader("Authorization", `${func.set_password(func.set_random(32),func.set_random(12))}${localStorage.token}${func.set_password(func.set_random(32),func.set_random(12))}`);
                // 开始上传数据
                xhr.upload.onloadstart = function (e) {
                    fileInput.value = '';
                   // console.log('开始上传')
                }
                // 上传数据成功，会触发
                xhr.onload = function (e) {
                    if (xhr.status === 200) {
                        let res = JSON.parse(xhr.responseText)
                        let length = self.quill.getSelection(true).index;
                        self.quill.insertEmbed(length, 'image', res.item.src)
                        self.quill.setSelection(length + 1)
                    }
                    fileInput.value = ''
                }
                // 当发生网络异常的时候会触发，如果上传数据的过程还未结束
                xhr.upload.onerror = function (e) {
                }
                // 上传数据完成（成功或者失败）时会触发
                xhr.upload.onloadend = function (e) {
                    // console.log('上传结束')
                }
                xhr.send(formData)
            });
            this.container.appendChild(fileInput);
        }
        fileInput.click();
    },
}
// 全部配置
export const editorOption = {
    placeholder: 'Compose an epic...',
    theme: 'snow',  // 主题
    modules: {
        toolbar: {
            container: toolOptions,  // 工具栏选项
            handlers: handlers  // 事件重写
        }
    }
}
