<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<template>
  <div>
    <el-radio-group v-model="selType" v-if="types.length > 0">
      <el-radio-button v-for="t in tags" :value="t.value" :label="t.label"></el-radio-button>
    </el-radio-group>
    <el-checkbox-group v-model="selTags" v-if="tags.length > 0">
      <el-checkbox v-for="tag in tags" :label="tag" :key="tag">{{tag}}</el-checkbox>
    </el-checkbox-group>
    <div class="reference-min-height margin-content">
      <fac-box-list  ref="list" :model="items" @dblclick="reference" preview-image="preview" image="icon"/>
    </div>
  </div>
</template>

<script>
import temetas from '~/temetas'
export default {
  name: 'temetas-ref',
  label: 'FAC模板',
  pageType: 'ref',
  dailogProps: {
    'min-width': '600px',
    width: '40%'
  },
  suggest (keyword, cb, param) {
    const type = param ? param.type : null
    return cb && temetas.filter(cb, keyword, [], type)
  },
  translate (value, cb) {
    temetas.getTemeta(value, v => v && cb(v.name))
  },
  props: {
    type: String
  },
  data () {
    const types = temetas.types
    const tags = temetas.tags
    return {
      types,
      items: [],
      tags,
      selTags: [],
      selType: this.type,
      current: null,
      currentNode: null
    }
  },
  watch: {
    type(v) {
      this.search()
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search (kw) {
      const vm = this
      if(!kw) {
        const container = vm.$parent.$parent
        kw = container && container.getKeyword && container.getKeyword()
      }
      temetas.filter(rs => vm.items = rs.map(([k, v, t]) => ({ value: k, label: v.name, icon: v.icon || v.preview, preview: v.preview ? [v.preview] : (v.icon ? [v.icon] : [])})), kw, vm.selTags, this.type)
    },
    getData () {
      const list = this.$refs.list
      const r = list.getCurrentItem()
      list.reset()
      return r
    },
    reference (item) {
      this.$parent.$closeReference(item)
    }
  }
}
</script>
