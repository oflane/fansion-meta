<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <fac-layout :conf="layout" v-loading="pageLoading">
    <fac-button-bar slot="header" :conf="buttons" :page="page"/>
    <div slot="body">
      <el-tabs ref="tabs" tab-position="left" style="height: 760px;" @input="switchMeta" >
        <el-tab-pane :label="item.label" :name="item.id" v-for="item in group" :key="item.id">
        </el-tab-pane>
      </el-tabs>
      <div class="edit-ofe-meta">
        <fac-layout :conf="contentLayout" >
          <fac-form slot="ofeDefine" :conf="form" ref="facForm"  :model="model"/>
          <el-button slot="ofeButtons" @click="addField" size="small">添加字段</el-button>
          <el-table ref="itemsTable" slot="ofeItems"
                    :data="model.fields"
                    border　
                    style="width: 100%">
            <el-table-column
              fixed
              prop="name"
              label="字段名"
              width="160" header-align="center"
              sortable="true"
            >
            </el-table-column>
            <el-table-column
              prop="label"
              label="显示名"
              width="160" header-align="center">
            </el-table-column>
            <el-table-column
              prop="dataType"
              label="类型"
              width="200"
              header-align="center">
            </el-table-column>
            <el-table-column
              prop="detailType"
              label="详细类型"
              header-align="center">
            </el-table-column>
            <el-table-column
              prop="length"
              label="长度"
              width="120" header-align="center">
            </el-table-column>
            <el-table-column
              prop="scale"
              label="精度"
              width="100" header-align="center">
            </el-table-column>
            <el-table-column
              prop="field"
              label="数据库字段"
              width="200" header-align="center">
            </el-table-column>
            <el-table-column
              prop="persist"
              label="是否持久化"
              width="120" header-align="center" align="center">
              <template slot-scope="scope">
                <i class="fa fa-check" aria-hidden="true" v-if="scope.row.persist"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="nullable"
              label="是否可空"
              width="120" header-align="center"  align="center">
              <template slot-scope="scope">
                <i class="fa fa-check" aria-hidden="true" v-if="scope.row.nullable"></i>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="160"
              header-align="center" align="center">
              <template slot-scope="scope">
                <el-button @click="editField(scope)" type="text" size="small"><i class="fa fa-pencil" aria-hidden="true"/></el-button>
                <el-button @click="removeField(scope)" type="text" size="small"><i class="fa fa-trash" aria-hidden="true"/></el-button>
              </template>
            </el-table-column>
          </el-table>
        </fac-layout>
      </div>
      <el-dialog
        :title="fieldTitle"
        :visible.sync="fieldDialogVisible"
        :close-on-click-modal="closeOnClickModal">
        <fac-form :conf="fieldForm" ref="fieldForm"  :model="fieldData"/>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onFieldOk">确 定</el-button>
          <el-button @click="closeFieldDialog">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </fac-layout>
</template>

<script>
  import fase from 'fansion-base'
  import fanui from 'fansion-ui'

  const {fillRestPath, getJson} = fase.rest
  const sure = fase.util.sure
  const state = fase.state
  const constant = fase.constant
  const handler = fanui.handler
  const urls = {
    type: 'meta-type/load-by-name/:type',
    group: 'meta/load-group/:type/:group',
    load: 'meta/load/:id',
    delete: 'meta/delete/:id',
    save: '/meta/save/com.oflane.fasp.ofmodel.entity.of-entity-meta'
  }
  export default {
    name: 'OfEntityMetaEdit',
    data () {
      let layout = {
        header: 'header',
        body: 'body'
      }
      let contentLayout = {
        header: 'ofeDefine',
        body: 'ofeButtons',
        footer: 'ofeItems'
      }
      let buttons = [
        {
          name: '添加子实体',
          click: 'addMeta',
          type: 'primary' // success warning danger info
        },
        {
          name: '删除实体',
          click: 'deleteMeta'
        },
        {
          name: '保存',
          click: 'save'
        },
        {
          name: '重置',
          click: 'resetForm'
        },
        {
          name: '返回',
          click: 'cancel'
        }
      ]
      let form = {
        items: [
          {
            type: 'input',
            label: '名称: ',
            field: 'name',
            validation: [
              {
                'required': true,
                'message': '实体名称不能为空',
                'trigger': 'blur'
              }
            ]
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
            label: '数据库表: ',
            field: 'tableName'
          },
          {
            type: 'input',
            label: '标签字段: ',
            field: 'tagField'
          },
          {
            type: 'input',
            label: '标签内容: ',
            field: 'tagSet'
          },
          {
            type: 'switch-box',
            label: '审计信息: ',
            field: 'existAudit'
          },
          {
            type: 'switch-box',
            label: '范围实体: ',
            field: 'existScope'
          }
        ]
      }
      let fieldForm = {
        items: [
          {
            type: 'input',
            label: '名称: ',
            field: 'name',
            validation: [
              {
                'required': true,
                'message': '实体名称不能为空',
                'trigger': 'blur'
              }
            ]
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
            type: 'combo',
            label: '类型: ',
            field: 'dataType',
            ':options': 'conf[\'dataTypeOptions\']',
            dataTypeOptions: [
              {
                value: 'STRING',
                label: '字符串'
              },
              {
                value: 'SHORT',
                label: '短整数'
              },
              {
                value: 'INT',
                label: '整数'
              },
              {
                value: 'LONG',
                label: '长整数'
              },
              {
                value: 'BIGDECIMAL',
                label: '数字'
              },
              {
                value: 'BOOLEAN',
                label: '布尔'
              },
              {
                value: 'DATE',
                label: '日期'
              },
              {
                value: 'DATETIME',
                label: '日期时间'
              }
            ]
          },
          {
            type: 'input',
            label: '详细类型: ',
            field: 'detailType'
          },
          {
            type: 'input.number',
            label: '长度: ',
            field: 'length'
          },
          {
            type: 'input.number',
            label: '精度: ',
            field: 'scale'
          },
          {
            type: 'input',
            label: '默认值: ',
            field: 'defaultValue'
          },
          {
            type: 'input',
            label: '数据库字段: ',
            field: 'field'
          },
          {
            type: 'switch-box',
            label: '是否可空: ',
            field: 'nullable'
          },
          {
            type: 'switch-box',
            label: '是否持久化: ',
            field: 'persist'
          }
        ]
      }
      let model = {}
      let metaData = {}
      let group = []
      let fieldData = {}
      let fieldDialogVisible = false
      let closeOnClickModal = false
      let fieldTitle = '编辑字段信息'
      let fieldIndex = -1
      return {
        params: {},
        layout,
        contentLayout,
        closeOnClickModal,
        buttons,
        fieldTitle,
        form,
        fieldForm,
        fieldDialogVisible,
        group,
        fieldIndex,
        model,
        metaData,
        fieldData,
        pageLoading: true,
        pageState: 'init',
        page: this,
        formLoading: false
      }
    },
    watch: {
      pageState (val, oldVal) {
        val !== oldVal && this.$emit('stateChanged', val)
      }
    },
    mounted () {
      state.watch(this, 'model')
      this.initPage()
    },
    methods: {
      initPage () {
        let vm = this
        vm.params = this.$route.params
        vm.pageLoading = true
        Promise.all([
          this.loadType(),
          this.loadGroup()
        ]).finally(() => {
          vm.pageLoading = false
        })
      },
      loadType () {
        let vm = this
        return getJson(fillRestPath(urls.type, vm.params)).then(() => {
          handler.setPageTitle(vm, handler.isAdd(vm.params.group) ? '新增OF实体集' : '编辑OF实体集')
        })
      },
      loadGroup () {
        let vm = this
        if (handler.isAdd(vm.params.group)) {
          this.addMeta()
          return
        }
        return getJson(fillRestPath(urls.group, vm.params)).then((res) => {
          vm.group = res
          vm.setCurrentTab(res[0].id)
        })
      },
      setCurrentTab (name) {
        this.$refs['tabs'].setCurrentName(name)
      },
      getCurrentTab () {
        return this.$refs['tabs'].currentName
      },
      isChange () {
        return state.isChange(this, 'model')
      },
      addMeta () {
        let vm = this
        if (vm.$refs['tabs'].currentName === constant.ADD_ID) {
          vm.$message('当前正在添加配置！')
          return
        }
        let item = {id: constant.ADD_ID, label: '新增实体'}
        vm.group.push(item)
        vm.setCurrentTab(item.id)
        this.pageState = 'state_add'
      },
      resetAdd () {
        if (this.model.id) {
          return
        }
        let tabName = constant.ADD_ID
        let vm = this
        vm.group.forEach((v, i) => {
          if (v.id === tabName) {
            vm.group.splice(i, 1)
            return false
          }
        })
      },
      refreshData (data) {
        if (data.content) {
          state.reset(this, 'model')
          let m = JSON.parse(data.content)
          m.id = data.id
          this.model = m
        } else {
          this.model = {}
        }
        this.metaData = data
      },
      switchMeta (tabName) {
        let vm = this
        if (vm.group.length === 0) {
          return
        }
        if (vm.isChange()) {
          handler.confirmHandle({
            vm,
            msg: '数据发生变化, 是否保存?',
            handler: () => {
              vm.save()
            },
            canceler: () => {
              vm.resetAdd()
              vm.loadMeta(tabName)
            }
          })
        } else {
          if (tabName !== constant.ADD_ID) {
            vm.resetAdd()
          }
          vm.loadMeta(tabName)
        }
      },
      loadMeta (id) {
        let vm = this
        vm.$refs['facForm'].resetFields()
        vm.formLoading = true
        if (handler.isAdd(id)) {
          let type = vm.params.type
          let group = vm.group
          let groups = null
          if (group.length > 1) {
            groups = group[0].name
          }
          let sorting = group.length - 1
          vm.refreshData({type, groups, sorting})
          vm.formLoading = false
          return
        }
        return getJson(fillRestPath(urls.load, {id})).then(res => {
          vm.refreshData(res)
        }).finally(() => {
          vm.formLoading = false
        })
      },
      save () {
        let vm = this
        if (!vm.isChange()) {
          vm.$message('数据未发生变化！')
          return
        }
        let tabs = vm.$refs['tabs']
        let saveTab
        handler.saveData({
          vm,
          url: urls.save,
          form: 'facForm',
          model: () => {
            let data = vm.metaData
            data.content = JSON.stringify(vm.model)
            data.name = vm.model.name
            data.label = vm.model.label
            saveTab = data.id || constant.ADD_ID
            return data
          },
          success: (res) => {
            let item = res.data
            let tabName = tabs.currentName
            vm.group.forEach(v => {
              if (v.id === saveTab) {
                v.id = item.id
                v.name = item.name
                v.label = item.label
                state.reset(vm, 'model')
                if (tabName === saveTab) {
                  tabs.setCurrentName(v.id)
                } else {
                  tabs.setCurrentName(tabName)
                }
                return false
              }
            })
            vm.$message({
              type: 'success',
              message: '保存成功!'
            })
          },
          fail: () => {
            vm.$message({
              type: 'error',
              message: '保存失败!'
            })
            vm.setCurrentName(saveTab)
          },
          loading: 'pageLoading'
        })
      },
      deleteMeta () {
        let vm = this
        let tabs = vm.$refs['tabs']
        let id = tabs.currentName
        handler.delRow({
          vm,
          url: urls.delete,
          row: {id},
          success: () => () => {
            if (vm.group[0].id === id) {
              vm.$message({type: 'success', message: '删除成功!'})
              vm.$router.back()
            } else {
              vm.removeGroup(id)
              vm.$message({type: 'success', message: '删除成功!'})
            }
          },
          // 当前页签为新增时如果有一个页签返回，否则前端删除返回false，如果不是新增页签判断页签数大于１时并且删除的为主页签，提示不允许删除，否则校验通过
          valid: () => handler.isAdd(id) ? sure(vm.group.length === 1 && vm.$router.back()) && sure(vm.removeGroup(id)) && false : !(vm.group.length > 1 && vm.group[0].id === id && sure(vm.$message('该组还存在子配置，不能删除主配置！'))),
          loading: 'pageLoading',
          msg: '确认删除当前配置?'
        })
      },
      removeGroup (id) {
        let vm = this
        let tabs = vm.$refs['tabs']
        let group = vm.group
        let tabName = tabs.currentName
        group.forEach((item, i) => {
          if (item.id !== id) {
            return
          }
          group.splice(i, 1)
          if (id !== tabName) {
            return false
          }
          if (i === group.length) {
            i--
          }
          tabs.setCurrentName(group[i].id)
          return false
        })
      },
      resetForm () {
        let vm = this
        vm.isChange() && handler.confirm(vm, () => vm.loadMeta(vm.getCurrentTab()), '数据发生变化, 确认重置数据?')
      },
      cancel () {
        let vm = this
        vm.isChange() ? handler.confirm(vm, () => vm.$router.back(), '数据发生变化, 确认取消?') : vm.$router.back()
      },
      addField () {
        this.fieldData = {}
        this.fieldIndex = -1
        this.showFieldDialog()
      },
      editField (scope) {
        this.fieldIndex = scope.$index
        this.fieldData = {...scope.row}
        this.showFieldDialog()
      },
      removeField (scope) {
        this.model.fields.splice(scope.$index, 1)
      },
      onFieldOk () {
        this.$refs['facForm'].validate(valid => {
          if (!valid) {
            return
          }
          if (this.fieldIndex === -1) {
            if (!this.model.fields) {
              this.model.fields = []
            }
            this.model.fields.push(Object.assign({
              name: null,
              label: null,
              dataType: 'STRING',
              detailType: null,
              length: null,
              scale: null,
              field: null,
              persist: null,
              nullable: null
            }, this.fieldData))
          } else {
            Object.assign(this.model.fields[this.fieldIndex], this.fieldData)
          }
          this.closeFieldDialog()
        })
      },
      showFieldDialog () {
        this.fieldDialogVisible = true
      },
      closeFieldDialog () {
        this.fieldDialogVisible = false
      }
    }
  }
</script>
<style lang="less">
  .edit-ofe-meta{
    position: relative;
    overflow: hidden;
    .layout-header{
      padding:0;
      background: transparent;
    }
    .layout-body{
      margin:0;
      &:after{
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
      }
      .el-button{
        float:right;
        margin-top:10px;
        margin-bottom:10px;
      }
    }
    .layout-footer{
      margin:0;
      background: transparent;
    }
  }
  .el-tabs--left{
    float: left;
    margin-bottom: 0;
    margin-right: 10px;
  }
</style>
