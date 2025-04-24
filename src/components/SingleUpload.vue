<template>
    <div>
        <el-upload class="avatar-uploader" action="https://grain-mall-yilail.oss-cn-guangzhou.aliyuncs.com"
            :data="dataObj" :show-file-list="false" :on-success="handleUploadSuccess" :on-error="handleUploadError"
            :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import { policy } from './policy.js'
import { Message } from 'element-ui'
import { getUUID } from '../utils/getUUID'

export default {
    name: 'singleUpload',
    props: {
        value: String
    },
    data() {
        return {
            imageUrl: '',
            dataObj: {
                policy: '',
                signature: '',
                key: '',
                OSSAccessKeyId: '',
                host: '',
                dir: ''
            }
        }
    },
    watch: {
        value(val) {
            this.imageUrl = val
        }
    },
    methods: {
        // 上传之前获取OSS签名信息
        beforeUpload(file) {
            let _self = this
            return new Promise((resolve, reject) => {
                policy().then(response => {
                    _self.dataObj.policy = response.data.policy
                    _self.dataObj.signature = response.data.signature
                    _self.dataObj.OSSAccessKeyId = response.data.accessid
                    const uuid = getUUID()
                    _self.dataObj.key = response.data.dir + '/' + uuid + '_' + file.name
                    _self.dataObj.dir = response.data.dir
                    _self.dataObj.host = response.data.host
                    resolve(true)
                }).catch(err => {
                    Message.error('获取OSS签名失败')
                    reject(false)
                })
            })
        },
        // 上传成功
        handleUploadSuccess(res, file) {
            this.imageUrl = this.dataObj.host + '/' + this.dataObj.key
            this.$emit('input', this.imageUrl)
        },
        // 上传失败
        handleUploadError() {
            Message.error('上传失败')
        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
}

.avatar {
    width: 200px;
    height: 200px;
    display: block;
    object-fit: contain;
}
</style>
