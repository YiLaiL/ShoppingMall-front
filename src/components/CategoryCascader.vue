<template>
  <el-cascader
    v-model="selectedOptions"
    :options="optionsWithEmptyChildren"
    :props="{ expandTrigger: 'hover', label: 'categoryName', value: 'id', children: 'children', checkStrictly: true }"
    @change="handleChange"
    placeholder="请选择商品分类"
    clearable
  ></el-cascader>
</template>

<script>
export default {
  name: 'CategoryCascader',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [],
      selectedOptions: this.value,
      optionsWithEmptyChildren: []
    }
  },
  created() {
    this.fetchCategories()
  },
  methods: {
    fetchCategories() {
      this.$http.get('/category/tree')
        .then(res => {
          if (res.code === 200) {
            // 确保所有id和parentId为字符串
            const stringifyIds = (arr) => arr.map(option => {
              const newOption = { ...option, id: String(option.id) };
              if (newOption.parentId !== undefined) newOption.parentId = String(newOption.parentId);
              if (newOption.children) newOption.children = stringifyIds(newOption.children);
              return newOption;
            });
            this.options = stringifyIds(res.data)
            this.optionsWithEmptyChildren = this.processOptions(this.options)
          }
        })
        .catch(err => {
          console.error('获取分类失败:', err)
        })
    },
    processOptions(options) {
      return options.map(option => {
        if (option.children && option.children.length === 0) {
          return { ...option, children: null }
        } else if (option.children) {
          return { ...option, children: this.processOptions(option.children) }
        }
        return option
      })
    },
    handleChange(value) {
      if (value && value.length > 0) {
        // 确保value为字符串数组
        const stringIds = value.map(String);
        const selectedNode = this.findNodeById(stringIds[stringIds.length - 1], this.options)
        if (selectedNode) {
          const pathNames = this.getCategoryPath(selectedNode, this.options)
          this.$emit('input', stringIds)
          this.$emit('change', { ids: stringIds, names: pathNames })
        }
      } else {
        this.$emit('input', [])
        this.$emit('change', { ids: [], names: [] })
      }
    },
    findNodeById(id, nodes) {
      id = String(id);
      for (const node of nodes) {
        if (String(node.id) === id) return node
        if (node.children) {
          const found = this.findNodeById(id, node.children)
          if (found) return found
        }
      }
      return null
    },
    getCategoryPath(node, nodes, path = []) {
      if (!node) return []
      path.unshift(node.categoryName)
      if (node.parentId) {
        const parent = this.findNodeById(String(node.parentId), nodes)
        if (parent) {
          return this.getCategoryPath(parent, nodes, path)
        }
      }
      return path
    }
  },
  watch: {
    value(newVal) {
      this.selectedOptions = newVal
    }
  }
}
</script>