// import ossClient from "@/util/oss.js";
// import baseUrlObj from "@/api/domain";
export default {
    data () {
        return {

        }
    },
    created () {
        console.log('mixins-created');
    },
    methods: {
        /**
         * 阿里云OSS上传
         */
        uploadHttp({ file }, value) {
            let formData = new FormData()
            formData.append('file', file)
            // ossClient(formData)
            // .then(({ res, url, name }) => {
            let res = {"res": {"status": 200, "messgae": ""}, "url": "http://oss.bobovip2.com/bobo/2022/04/1648743406909279631.png", "width":0, "height":0, "name": "AR.png", "ext": "png"}
            if (res && res.status == 200) {
                console.log(`阿里云OSS上传图片成功回调`, res, url, name);
                if( !url.startsWith("http")){
                    // url = baseUrlObj["resourceUrl"] +url;
                }
                this.formAdd[value] = url;
            }
            // })
            // .catch((err) => {
            // this.$message.error("上传失败"+err);
            // });
        },

        /**
         * 图片限制
         */
        beforeAvatarUpload(file) {
            const isJPEG = file.name.split(".")[1] === "jpeg";
            const isJPG = file.name.split(".")[1] === "jpg";
            const isPNG = file.name.split(".")[1] === "png";
            const isGif = file.name.split(".")[1] === "gif";
            const isLt500K = file.size / 1024 / 2000 < 2;
            if (!isJPG && !isJPEG && !isPNG) {
                this.$message.error("上传图片只能是 JPEG/JPG/PNG/GIF 格式!");
            }
            if (!isLt500K) {
                this.$message.error("单张图片大小不能超过 2000KB!");
            }
            return (isJPEG || isJPG || isPNG || isGif) && isLt500K;
        },
        /**
         * 移除图片
         */
        handleRemove(file, fileList) {
            console.log(`移除图片回调`, fileList);
        }
    }
}