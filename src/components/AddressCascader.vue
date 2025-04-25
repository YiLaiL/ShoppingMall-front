<template>
  <el-cascader
    v-model="selectedAddress"
    :options="addressOptions"
    :props="{ expandTrigger: 'click', checkStrictly: true, emitPath: false }"
    @change="handleChange"
    placeholder="请选择商品所在地"
    clearable
  ></el-cascader>
</template>

<script>
export default {
  name: 'AddressCascader',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedAddress: this.value,
      addressOptions: []
    }
  },
  created() {
    // 仅在组件挂载且value为空时加载地址数据
    if (!this.value || this.value.length === 0) {
      this.loadAddressOptions()
    }
  },
  methods: {
    loadAddressOptions() {
      this.$http.get('/address/tree')
        .then(res => {
          if (res.code === 200) {
            this.addressOptions = res.data
          }
        })
        .catch(err => {
          console.error('获取地址数据失败:', err)
        })
    },
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  },
  watch: {
    value(newVal) {
      this.selectedAddress = newVal
    }
  }
}
</script>