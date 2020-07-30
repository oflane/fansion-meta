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
    <div>
      <ul class="ref-list">
        <li v-for="item in items" :key="item.value" @click="select($event, item)" @dblclick="reference(item)">
          <el-image
            style="width: 100%; height: 100px"
            :src="item.icon" :preview-src-list="item.preview"
            fit="scale-down">
            <div slot="error" style="height: 100%;">
              <div class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </div>
          </el-image>
          <div class="label">{{ item.label }}</div>
        </li>
      </ul>
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
    return cb && cb(temetas.filter(keyword, [], type))
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
  mounted() {
    this.search()
  },
  methods: {
    search () {
      const vm = this
      const kw = vm.$parent && vm.$parent.getKeyword && vm.$parent.getKeyword()
      temetas.filter(rs => vm.items = rs.map(([k, v, t]) => ({ value: k, label: v.name, icon: v.icon || v.preview, preview: v.preview ? [v.preview] : (v.icon ? [v.icon] : [])})), kw, vm.selTags, this.type)
    },
    getData () {
      const r = this.current
      this.reset()
      return r
    },
    select (e, item) {
      const node = e.currentTarget
      if(node === this.currentNode) {
        this.reset()
      } else {
        if (this.currentNode) {
          this.currentNode.className = ''
        }
        node.className = 'selected'
        this.currentNode = node
        this.current = item
      }
    },
    reset () {
      if (this.currentNode) {
        this.currentNode.className = ''
        this.currentNode = null
        this.current = null
      }
    },
    reference (item) {
      this.$parent.$closeReference(item)
    }
  }
}
</script>

<style scoped lang="less">
.ref-list {
  margin: 10px 20px;
  min-height: 400px;
  font-size: 14px;
  color: #5e6d82;
  line-height: 2em;
  overflow: hidden;
  list-style: none;
  padding: 0;
  border: 1px solid #eaeefb;
  border-radius: 4px;
  li{
    float: left;
    width: 20%;
    text-align: center;
    height: 130px;
    color: #666;
    font-size: 13px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    display: list-item;
    cursor: pointer;
    &.selected{
      .label{
        background:  #409EFF;
        color: #fff;
        height: 29px;
      }
    }
    .image-slot{
      font-size: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
    .el-image{
      display: block;
    }
  }
}
</style>
