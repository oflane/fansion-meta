<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <fac-layout :conf="layout" >
    <div slot="header">
      <div class="bar-element" >
        <fac-form :conf="configForm" :model="model"　label-width="80px"/>
      </div>
      <el-button-group class="pull-right">
        <el-button type="primary" icon="fa fa-plus" size="small" @click="onAdd" title="添加列"/>
        <el-button type="primary" icon="fa fa-cubes" size="small" title="从模型添加"/>
        <el-button type="primary" icon="fa fa-cubes" size="small" title="调整列顺序"/>
        <el-button type="primary" icon="fa fa-trash" size="small" @click="onDeletes"　title="删除列"/>
      </el-button-group>
    </div>
    <fac-table ref="itemsTable" slot="body" :conf="table" :model="model.items" :page="this"  :selection=1 />
  </fac-layout>
</template>

<script>
  import facXqueryItem from './fac-xquery-item'
  export default {
    name: 'FacXqueryConfig',
    props: {
      page: Object,
      model: Object
    },
    data () {
      let model = this.model
      if (!model.items) {
        model.items = []
      }
      let layout = {
        header: {
          slot: 'header',
          class: 'layout-bar'
        },
        body: {
          slot: 'body',
          class: 'layout-main'
        }
      }
      let table = {
        '@selectionChange': 'page.handleSelectionChange',
        columns: [
          {
            'label': '字段名',
            'field': 'field',
            'sortable': true
          },
          {
            'label': '显示名',
            'field': 'label',
            'sortable': true
          },
          {
            'label': '控件类型',
            'field': 'type'
          },
          {
            label: '条件操作符',
            align: 'center',
            width: '120px',
            sortBy: 'op',
            sortable: true,
            template: '<el-tag disable-transitions>{{page.showOpText(scope.row.op)}}</el-tag>'
          },
          {
            label: '操作',
            width: '150px',
            align: 'center',
            template: '<el-button @click="page.onEdit(scope)" type="text" size="small">查看</el-button><el-button @click="page.onDelete(scope)" type="text" size="small">删除</el-button>'
          }
        ]
      }
      if (!model.modelMeta) {
        model.modelMeta = {}
      }
      let configForm = {
        cols: 2,
        items: [
          {
            type: 'reference',
            label: '模型:',
            field: 'modelMeta.value',
            placeholder: '请选择元数据模型'
          },
          {
            type: 'input.number',
            label: '列数:',
            field: 'cols',
            validation: [
              {type: 'number', message: '请输入整数'}
            ]
          }
        ]
      }
      return {
        multipleSelection: [],
        layout,
        table,
        configForm
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      showOpText (v) {
        switch (v) {
          case '=':
            return '等于'
          case '<>':
            return '不等于'
          case '>':
            return '大于'
          case '<':
            return '小于'
          case '>=':
            return '大于等于'
          case '<=':
            return '小于等于'
          case 'like':
            return '包含'
          case 'likes':
            return '左包含'
          case 'likee':
            return '右包含'
          case 'in':
            return '列举'
          case 'not in':
            return '反列举'
          default:
            return '等于'
        }
      },
      onAdd () {
        this.$showDialog({params: {isAdd: true, ':listModel': this.model.items}, component: facXqueryItem})
      },
      onEdit (scope) {
        this.$showDialog({params: {':isAdd': false, ':listModel': this.model.items, ':currentIndex': scope.$index}, component: facXqueryItem})
      },
      onDelete (scope) {
        let i = scope.$index
        let model = this.model
        let items = model.items
        this.$confirm('删除字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          items.splice(i, 1)
          this.$set(model, 'items', items)
        })
      },
      onDeletes () {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'info',
            message: '请勾选需要删除的数据!'
          })
          return
        }
        let items = this.model.items
        let sels = this.multipleSelection
        let itemsTable = this.$refs['itemsTable']
        this.$confirm('删除字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sels.forEach(v => items.splice(items.indexOf(v), 1))
          itemsTable.getTable().clearSelection()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .layout-bar {
    padding: 0px 30px;
    width: 100%;
    height: 40px;
    margin: 0px;
    position: relative;
    background: transparent;
    .fac-form {
      height: 70px;
      .form-body{
        padding: 0;
        height: 100%;
      }
      .el-col {
        padding-left: 0!important;
        padding-right: 0!important;
      }
      .el-form-item{
        margin-bottom: 0;
      }
    }
    .bar-element {
      float: left;
      display: block;
      width: 700px;
      label{
        color: #303133;
      }
    }
    .el-button-group{
      margin-top: 30px;
    }
  }
  /deep/ .layout-main {
    margin: 10px 30px 10px 30px;
    position: relative;
  }
</style>
