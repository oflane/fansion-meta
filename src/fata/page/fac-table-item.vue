<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <el-dialog :title="title" :visible.sync="visible">
    <fac-form ref="tableItem" :conf="form" :model="model" :page="this"/>
    <div slot="footer">
      <el-button type="primary" @click="onOk">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'FacTableItem',
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
      let model = this.isAdd ? {columnType: 'field', align: 'left', sortable: false} : this.listModel[this.currentIndex]
      let form = {
        cols: 1,
        items: [
          {
            type: 'combo',
            label: '列类型: ',
            field: 'columnType',
            ':options': [
              {
                value: 'field',
                label: '字段'
              },
              {
                value: 'template',
                label: '模板'
              }
            ],
            '@change': 'this.page.onColumnTypeChange'
          },
          {
            type: 'input',
            label: '显示名称: ',
            field: 'label',
            validation: [
              {
                'required': true,
                'message': '实体显示名称不能为空',
                'trigger': 'blur'
              }
            ]
          },
          {
            type: 'input',
            label: '字段名: ',
            field: 'field',
            validation: [
              {
                'required': true,
                'message': '字段名不能为空',
                'trigger': 'blur',
                ignore: model.columnType !== 'field'
              }
            ]
          },
          {
            type: 'combo',
            label: '对齐方式: ',
            field: 'align',
            ':options': [
              {
                value: 'left',
                label: '左对齐'
              },
              {
                value: 'center',
                label: '居中'
              },
              {
                value: 'right',
                label: '右对齐'
              }
            ]
          },
          {
            type: 'combo',
            label: '排序方式',
            field: 'sortable',
            ':options': [
              {
                value: false,
                label: '不需排序'
              },
              {
                value: true,
                label: '界面排序'
              },
              {
                value: 'custom',
                label: '服务排序'
              }
            ]
          },
          {
            type: 'textarea',
            label: '模板: ',
            field: 'template',
            ignore: model.columnType === 'field'
          }
        ]
      }
      return {
        visible: true,
        title: this.isAdd ? '添加列表项目' : '编辑列表项目',
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
      onColumnTypeChange (v) {
        let form = this.form
        let fieldItem = form.items[2]
        let templateItem = form.items[form.items.length - 1]
        if (v === 'field') {
          fieldItem.validation[0].ignore = false
          templateItem.ignore = true
        } else {
          fieldItem.validation[0].ignore = true
          templateItem.ignore = false
        }
        this.$refs['tableItem'].changeState()
      }
    }
  }
</script>

<style scoped>

</style>
