<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<!--
 --fac页面配置内容组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2018-1-15
 -->
<template>
  <el-dialog :visible.sync='visible' :title='title' @before-close="beforeClose">
    <editor ref="editor" :id="id" :category="category" :step-status.sync="step"/>
    <div slot='footer'>
      <el-button @click='onPrev' v-if="step === 3 || step === 2">上一步</el-button>
      <el-button @click='onNext' v-if="step === 3 || step === 1">下一步</el-button>
      <el-button type='primary' @click='onSave'>保存</el-button>
      <el-button @click='onCancel'>取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import editor from './fac-meta-editor'

export default {
  name: 'FacMetaDialog',
  props: {
    id: String,
    category: String
  },
  data () {
    return {
      step: 0,
      visible: true
    }
  },
  components: {
    editor
  },
  methods: {
    /**
     * 显示对话框
     */
    show () {
      this.visible = true
    },
    /**
     * 判断是否显示
     * @returns {boolean}
     */
    isVisible () {
      return this.visible
    },
    /**
     * 隐藏对话框
     */
    hide () {
      this.visible = false
    },
    /**
     * 窗口关闭前处理
     * @param done 实际关闭回调方法
     */
    beforeClose (done) {
      this.$refs.editor.beforeClose(done)
    },
    /**
     * 上一步
     * @returns {*}
     */
    onPrev () {
      this.$refs.editor.prev()
    },
    /**
     * 下一步
     */
    onNext () {
      this.$refs.editor.next()
    },
    /**
     * 保存
     */
    onSave () {
      this.$refs.editor.save()
    }
  }
}
</script>
