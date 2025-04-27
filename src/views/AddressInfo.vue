<template>
  <el-card class="address-card">
    <div slot="header" class="clearfix">
      <span>收货信息</span>
    </div>
    <el-form :model="addressForm" label-width="80px">
      <el-form-item label="收货人">
        <el-input v-model="addressForm.receiverName" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="addressForm.receiverPhone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="收货地址">
        <address-cascader v-model="addressForm.receiverAddress" />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="addressForm.receiverDetailAddress" placeholder="请输入详细地址" type="textarea" :rows="2"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="saveAddress">确定</el-button>
  </el-card>
</template>

<script>
import AddressCascader from '@/components/AddressCascader.vue'

export default {
  name: 'AddressInfo',
  components: {
    AddressCascader
  },
  props: {
    addressInfo: {
      type: Object,
      default: () => ({
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        receiverDetailAddress: ''
      })
    }
  },
  data() {
    return {
      addressForm: {
        receiverName: this.addressInfo.receiverName,
        receiverPhone: this.addressInfo.receiverPhone,
        receiverAddress: this.addressInfo.receiverAddress,
        receiverDetailAddress: this.addressInfo.receiverDetailAddress || ''
      }
    }
  },
  watch: {
    addressInfo: {
      handler(newVal) {
        this.addressForm = {
          receiverName: newVal.receiverName,
          receiverPhone: newVal.receiverPhone,
          receiverAddress: newVal.receiverAddress,
          receiverDetailAddress: newVal.receiverDetailAddress || ''
        }
      },
      deep: true
    }
  },
  methods: {
    saveAddress() {
      this.$http.post('/delivery/save/id', {
        consigneeName: this.addressForm.receiverName,
        phone: this.addressForm.receiverPhone,
        provinceId: this.addressForm.receiverAddress[0],
        cityId: this.addressForm.receiverAddress[1],
        countyId: this.addressForm.receiverAddress[2],
        address: this.addressForm.receiverDetailAddress
      }).then(response => {
        this.$message.success('收货信息保存成功')
        this.$emit('input', this.addressForm)
        this.$emit('close', true)
      }).catch(error => {
        this.$message.error('保存失败：' + error.message)
      })
    }
  }
}
</script>

<style scoped>
.address-card {
  margin-bottom: 20px;
}
</style>