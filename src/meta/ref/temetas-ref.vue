<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<template>
  <el-dialog :visible.sync='visible' min-width="600px" width="40%">
    <template slot="title">
      <span class="el-dialog__title">选择FAC模板</span>
      <div class="tab-center" v-if="types.length > 0">
        <el-radio-group v-model="selType"  size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button v-for="t in types" :label="t.value">{{t.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="ref-search"><fac-search ref="search" @search="search" size="small" /><button @click="search"><i class="el-icon-refresh"></i></button></div>
    </template>
    <div>
      <div class="bar" v-if="tags.length > 0">
        <el-checkbox-group v-model="selTags"   size="small">
          <el-checkbox v-for="tag in tags" :label="tag" :key="tag">{{tag}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="reference-min-height margin-content">
        <fac-box-list  ref="list" :model="items" @dblclick="reference" preview-image="preview" image="icon"/>
      </div>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="onOk">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
      <el-button @click="onClear">清除</el-button>
    </div>
  </el-dialog>
</template>

<script>
import temetas from '~/temetas'
export default {
  name: 'temetas-ref',
  label: 'FAC模板',
  pageType: 'ref',
  dialog: true,
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
    const types = this.type ? [] : temetas.types
    const tags = temetas.tags
    return {
      visible: true,
      types,
      items: [],
      tags,
      selTags: [],
      selType: this.type || 'all',
      current: null,
      currentNode: null
    }
  },
  watch: {
    type(v) {
      this.selType = v
    },
    selType(v) {
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
      const type = this.selType === 'all' ? null : this.selType
      temetas.filter(rs => vm.items = rs.map(([k, v, t]) => ({ value: k, label: v.name, icon: v.icon || v.preview, preview: v.preview ? [v.preview] : (v.icon ? [v.icon] : [])})), kw, vm.selTags, type)
    },
    getData () {
      const list = this.$refs.list
      const r = list.getCurrentItem()
      list.reset()
      return r
    },
    reference (item) {
      this.$closeReference(item)
    },
    reset () {
      const list = this.$refs.list
      list && list.reset()
    },
    onOk () {
      const vm = this
      const data = vm.getData()
      if (data) {
        this.$closeReference(data)
      }
    },
    onCancel () {
      this.$closeReference()
    },
    onClear () {
      this.$closeReference({})
    },
    show () {
      this.visible = true
      this.$emit('open', this)
    },
    isVisible () {
      return this.visible
    },
    hide () {
      this.visible = false
      this.$emit('close', this)
    }
  }
}
</script>
<style>
.tab-center {
  position: absolute;
  top:16px;
  left: 0;
  width: 100%;
  text-align: center;
}
.bar{
  padding: 4px;
  border-bottom: 1px dotted #DDD;
}
</style>
