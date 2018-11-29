<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <fac-layout :conf="layout" >
    <div slot="header">
      <div class="bar-element" >
        <label class="bar_label">
          模型:
        </label>
        <div class="bar_control">
          <fac-reference :model="model" field="modelMetaName" labelField="modelMetaNameLabel" />
        </div>
      </div>
      <el-button-group class="pull-right">
        <el-button type="primary" icon="fa fa-plus" size="small" @click="onAdd" title="添加列"/>
        <el-button type="primary" icon="fa fa-cubes" size="small" title="从模型添加"/>
        <el-button type="primary" icon="fa fa-cubes" size="small" title="调整列顺序"/>
        <el-button type="primary" icon="fa fa-trash" size="small" @click="onDeletes"　title="删除列"/>
      </el-button-group>
    </div>
    <fac-table ref="columnTable" slot="body" :conf="table" :model="model.columns" :page="this"　:selection=1 />
  </fac-layout>
</template>

<script>
  import facTableItem from './fac-table-item'
  import fanui from 'fansion-ui'

  export default {
    name: 'FacTableConfig',
    props: {
      page: Object,
      model: Object
    },
    data () {
      let model = this.model
      let columns
      if (model.columns) {
        columns = model.columns
      } else {
        columns = []
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
        '@selection-change': 'page.handleSelectionChange',
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
            label: '排序',
            align: 'center',
            width: '120px',
            sortBy: 'sortable',
            sortable: true,
            template: '<el-tag :type="page.showSortCss(scope.row.sortable)"　disable-transitions>{{page.showSortText(scope.row.sortable)}}</el-tag>'
          },
          {
            label: '操作',
            width: '150px',
            align: 'center',
            template: fanui.generator.columnButton([{text: '查看', click: 'onEdit(scope)'}, {text: '删除', click: 'onDelete(scope)'}])
          }
        ]
      }
      return {
        multipleSelection: [],
        layout,
        table
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      showSortText (v) {
        return v === 'custom' ? '服务排序' : v ? '界面排序' : '不需排序'
      },
      showSortCss (v) {
        return v === 'custom' ? 'primary' : v ? 'success' : 'info'
      },
      onAdd () {
        this.$showDialog({params: {isAdd: true, ':listModel': this.columns}, component: facTableItem})
      },
      onEdit (scope) {
        this.$showDialog({params: {':isAdd': false, ':listModel': this.columns, ':currentIndex': scope.$index}, component: facTableItem})
      },
      onDelete (scope) {
        let i = scope.$index
        let columns = this.columns
        this.$confirm('删除字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          columns.splice(i, 1)
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
        let columns = this.model.columns
        let sels = this.multipleSelection
        let columnTable = this.$refs['columnTable']
        this.$confirm('删除字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sels.forEach(v => columns.splice(columns.indexOf(v), 1))
          columnTable.getTable().clearSelection()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .layout-bar {
    padding: 10px 30px;
    height: 52px;
    width: 100%;
    margin: 0px;
    position: relative;
    background: transparent;
    .bar-element {
      display:inline-block;
      label{
        color: #303133;
      }
    }
    .bar_control{
      display:inline-block;
      .reference{
        width:300px;
      }
    }
  }
  /deep/ .layout-main {
    margin: 10px 30px 10px 30px;
    position: relative;
  }
</style>
