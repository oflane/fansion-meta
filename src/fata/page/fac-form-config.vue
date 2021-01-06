<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <fac-layout :conf="layout">
    <div slot="header">
      <div class="bar-element" >
        <fac-form :conf="configForm" :model="model"　label-width="80px"/>
      </div>
      <el-button-group class="pull-right">
        <el-button type="primary" icon="fa fa-plus" size="small" @click="onAddGroup" title="添加表单分组">添加分组</el-button>
        <el-button type="primary" icon="fa fa-sort" size="small" @click="onOrderGroup" title="添加表单分组">调整顺序</el-button>
      </el-button-group>
    </div>
    <div slot="body">
      <fac-layout :conf="tabLayout">
        <el-tabs ref="tabs" v-model="currentTab" closable @tab-remove="onRemoveGroup" slot="header" type="card">
          <el-tab-pane
            :key="index"
            :name="index + ''"
            v-for="(g, index) in model.groups"
            :label="showGroupTitle(g.title)"
          >
          </el-tab-pane>
        </el-tabs>
        <div slot="body">
          <div class="tab-form" >
            <fac-form ref="configGroupForm" :conf="configGroupForm" :model="group"　label-width="80px"/>
          </div>
          <el-button-group class="pull-right">
            <el-button type="primary" icon="fa fa-plus" size="small" @click="onAdd" title="添加列" circle/>
            <el-button type="primary" icon="fa fa-cubes" size="small" title="从模型添加" circle/>
            <el-button type="primary" icon="fa fa-sort" size="small" title="调整列顺序" @click="onSortItems"/>
            <el-button type="primary" icon="fa fa-trash" size="small" @click="onDeletes"　title="删除列" circle/>
          </el-button-group>
        </div>
        <fac-table ref="itemsTable" slot="footer" :conf="table" :model="group.items" :page="this"  :selection=1 />
      </fac-layout>
    </div>
  </fac-layout>
</template>

<script>
  import facFormItem from './fac-form-item'
  import fanui from 'fansion-ui'
  function initModel (model) {
    if (model.compType && model.compType !== 'fac-form') {
      return model
    }
    model.states || (model.states = [{value: 'default', label: '默认'}])
    if (!Array.isArray(model.groups)) {
      model.groups = [{
        items: []
      }]
    } else if (model.groups.length === 0) {
      model.groups.push({
        items: []
      })
    } else if (!Array.isArray(model.groups[0].items)) {
      model.groups[0].items = []
    }
    return model
  }
  export default {
    name: 'FacFormConfig',
    props: {
      page: Object,
      model: Object
    },
    data () {
      let model = initModel(this.model)
      let currentTab = 0
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
      let tabLayout = {
        header: {
          slot: 'header',
          class: 'layout-tabs'
        },
        body: {
          slot: 'body',
          class: 'layout-form'
        },
        footer: {
          slot: 'footer',
          class: 'layout-table'
        }
      }
      let table = {
        '@selectionChange': 'page.handleSelectionChange($event,this)',
        columns: [
          {
            'label': '字段名',
            'field': 'field'
          },
          {
            'label': '显示名',
            'field': 'label'
          },
          {
            'label': '控件类型',
            'field': 'type'
          },
          {
            label: '操作',
            width: '150px',
            align: 'center',
            template: fanui.generator.columnButton([{text: '查看', click: 'onEdit(scope)'}, {text: '删除', click: 'onDelete(scope)'}])
          }
        ]
      }
      let configForm = {
        cols: 2,
        items: [
          {
            type: 'reference',
            label: '模型:',
            field: 'modelMetaName',
            labelField: 'modelMetaLabel',
            placeholder: '请选择元数据模型',
            refTo: 'fasm:base:ref:entity-ref'
          },
          {
            type: 'tags',
            label: '表单状态:',
            field: 'states',
            readonlyValue: 'default'
          }
        ]
      }
      let configGroupForm = {
        cols: 2,
        items: [
          {
            type: 'input',
            label: '标题:',
            field: 'title',
            placeholder: '请输入表单分组标题'
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
      let group = model.groups ? model.groups[currentTab] : {items: []}
      return {
        multipleSelection: [],
        layout,
        table,
        configForm,
        configGroupForm,
        tabLayout,
        currentTab,
        group
      }
    },
    watch: {
      currentTab (val, oldVal) {
        if (this.model.groups) {
          this.group = this.model.groups[val * 1]
        }
      },
      model (val) {
        let model = initModel(val)
        let i = this.currentTab * 1
        if (model.groups && model.groups > i) {
          this.group = model.groups[i]
        }
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      onAddGroup () {
        this.model.groups.push({
          items: []
        })
        this.currentTab = (this.model.groups.length - 1) + ''
      },
      onOrderGroup () {

      },
      onRemoveGroup (target) {
        let groups = this.model.groups
        if (groups.length === 1) {
          this.$message({
            message: '只剩一个分组，不能删除了！',
            type: 'warning'
          })
          return
        }
        let cur = this.currentTab * 1
        let i = target * 1
        groups.splice(i, 1)
        if (i <= cur && cur > 0) {
          this.currentTab = (cur - 1) + ''
        } else {
          this.currentTab = ''
          this.currentTab = cur + ''
        }
      },
      showGroupTitle (title) {
        if (title) {
          return title
        }
        return '[无标题]'
      },
      onAdd () {
        this.$showDialog({params: {isAdd: true, ':listModel': this.group.items, ':states': this.model.states}, component: facFormItem})
      },
      onEdit (scope) {
        this.$showDialog({params: {':isAdd': false, ':listModel': this.group.items, ':states': this.model.states, ':currentIndex': scope.$index}, component: facFormItem})
      },
      onSortItems () {
        this.$showDialog({params: {':model': this.group.items, vm: this, '@ok': 'params.vm.onReturnSortItems()'}, component: '/ui/page/sort-dialog'})
      },
      onReturnSortItems () {
        this.group.items = [... this.group.items]
      },
      onDelete (scope) {
        let i = scope.$index
        let group = this.group
        let items = group.items
        this.$confirm('删除字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          items.splice(i, 1)
          this.$set(group, 'items', items)
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
        let items = this.group.items
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
      },
      validate (cb) {
        this.$refs['configGroupForm'].validate(cb)
      }
    }
  }
</script>

<style lang="less" scoped>

  /deep/ .layout-bar {
    padding: 10px 30px;
    height: 70px;
    width: 100%;
    margin: 0px;
    position: relative;
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
      width: 720px;
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
  .layout-tabs {
    backgroud: #FFFFFF;
  }
  /deep/ .layout-form {
    .el-button-group{
      margin-top: 30px;
    }
  }

  /deep/ .tab-form{
    float: left;
    display: block;
    width: 720px;
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
  }
  .layout-table {
  }
</style>
