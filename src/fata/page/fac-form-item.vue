<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <el-dialog :title="title" :visible.sync="visible">
    <fac-form ref="formItem" :conf="form" :model="model" :page="this"/>
    <div slot="footer">
      <el-button type="primary" @click="onOk">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import fata from '~/fata'
  const defaultItems = [
    {
      type: 'combo',
      label: '组件类型: ',
      field: 'type',
      ':options': fata.getFormControls(),
      '@change': 'this.page.onControlTypeChange'
    },
    {
      type: 'input',
      label: '显示名称: ',
      field: 'label',
      validation: [
        {
          'required': true,
          'message': '显示名称不能为空',
          'trigger': 'blur'
        }
      ]
    },
    {
      type: 'input.number',
      label: '列数:',
      field: 'cols',
      validation: [
        {type: 'number', message: '请输入整数'}
      ]
    }]
  export default {
    name: 'FacFormItem',
    dialog: true,
    props: {
      html: String,
      listModel: Array,
      currentIndex: {
        type: Number,
        default: -1
      },
      isAdd: {
        type: Boolean,
        default: true
      }
    },
    data () {
      let model = this.isAdd ? {type: 'input'} : this.listModel[this.currentIndex]
      let items = fata.getFormTagItems(model.type)
      let form = {
        cols: 1,
        items: [
          ...defaultItems,
          ...items
        ]
      }
      return {
        visible: true,
        title: this.isAdd ? '添加表单项目' : '编辑表单项目',
        model,
        form
      }
    },
    methods: {
      show () {
        this.visible = true
      },
      isVisible () {
        return this.visible
      },
      hide () {
        this.visible = false
      },
      onOk () {
        if (this.isAdd) {
          if (this.currentIndex < 0 || this.currentIndex > this.listModel.length) {
            this.listModel.push(this.model)
          } else {
            this.listModel.splice(this.currentIndex, 0, this.model)
          }
        }
        this.$dialogs.closeCurrent()
      },
      onCancel () {
        this.$dialogs.closeCurrent()
      },
      onControlTypeChange (v) {
        let form = this.form
        let items = fata.getFormTagItems(v)
        form.items = [
          ...defaultItems,
          ...items
        ]
        this.$refs['formItem'].changeState()
      }
    }
  }
</script>
