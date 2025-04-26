<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" @close="handleClose">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="收货人" prop="receiverName">
        <el-input v-model="form.receiverName" placeholder="请输入收货人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="receiverPhone">
        <el-input v-model="form.receiverPhone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" prop="receiverRegion">
        <address-cascader v-model="form.receiverRegion"></address-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="receiverDetailAddress">
        <el-input 
          type="textarea" 
          v-model="form.receiverDetailAddress" 
          placeholder="请输入详细地址"
          :autosize="{ minRows: 2, maxRows: 4 }">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AddressCascader from '@/components/AddressCascader.vue'

export default {
  name: 'EditAddressDialog',
  components: {
    AddressCascader
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        id: null,
        receiverName: '',
        receiverPhone: '',
        receiverRegion: [],
        receiverDetailAddress: ''
      })
    },
    value: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      dialogTitle: '编辑收货地址',
      form: {
        id: null,
        receiverName: '',
        receiverPhone: '',
        receiverRegion: [],
        receiverDetailAddress: ''
      },
      rules: {
        receiverName: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        receiverPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        receiverRegion: [
          { required: true, message: '请选择所在地区', trigger: 'change' }
        ],
        receiverDetailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value(newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible(newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    dialogTitle: {
      get() {
        return this.isEdit ? '编辑收货地址' : '新增收货地址';
      },
      set(value) {
        // 空setter避免警告
      }
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.form = {
          ...newVal,
          id: newVal.id || null
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    
    handleAddressUpdate(addressInfo) {
      if (!addressInfo.id && this.isEdit) {
        this.$message.error('缺少地址ID');
        return;
      }
      this.$http.put('/delivery/update/id', {
        id: addressInfo.id,
        consigneeName: addressInfo.receiverName,
        phone: addressInfo.receiverPhone,
        provinceId: addressInfo.receiverRegion[0],
        cityId: addressInfo.receiverRegion[1],
        countyId: addressInfo.receiverRegion[2],
        address: addressInfo.receiverDetailAddress
      }).then(response => {
        this.$message.success('收货地址更新成功');
        this.$emit('update:visible', false);
        this.$emit('update');
        this.$router.go(0);
      }).catch(error => {
        this.$message.error('更新失败：' + error.message);
      });
    },
    
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const addressInfo = {
            id: this.form.id,
            ...this.form,
            receiverAddress: this.form.receiverRegion.join(',') + ',' + this.form.receiverDetailAddress
          }
          this.$emit('input', addressInfo)
          this.$emit('submit', addressInfo)
          this.handleAddressUpdate(addressInfo)
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form {
  padding: 20px;
}
</style>