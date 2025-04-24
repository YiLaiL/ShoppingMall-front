
/**
 * 获取OSS上传策略
 * @returns {Promise} 返回包含签名和策略信息的Promise对象
 */
import axios from 'axios';

export function policy() {
    return new Promise((resolve, reject) => {
        axios.get('/api/upload/picture/front', {
            headers: {
                'Authorization': localStorage.getItem('authToken')
            }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error))
    })
}
