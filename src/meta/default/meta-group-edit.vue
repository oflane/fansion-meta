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
      <fac-form :conf="form" ref="facForm"  :model="model" v-loading="formLoading"/>
    </div>
  </fac-layout>
</template>

<script>
  import fase from 'fansion-base'
  import fanui from 'fansion-ui'

  const {fillRestPath, getJson, post} = fase.rest
  const state = fase.state
  const handler = fanui.handler
  const constant = fase.constant
  const urls = {
    type: 'meta-type/load-by-name/:type',
    group: 'meta/load-group/:type/:group',
    load: 'meta/load/:id',
    delete: 'meta/delete/:id',
    save: '/meta/save'
  }
  export default {
    name: 'DefaultMetaEdit',
    data () {
      let layout = {
        header: 'header',
        body: 'body'
      }
      let buttons = [
        {
          name: '添加配置',
          click: 'addMeta',
          type: 'primary' // success warning danger info
        },
        {
          name: '删除配置',
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
                'message': '元数据名称不能为空',
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
                'message': '元数据显示名称不能为空',
                'trigger': 'blur'
              }
            ]
          }, {
            type: 'input',
            label: '标签: ',
            field: 'tags'
          }, {
            type: 'jsonEditor',
            label: '内容: ',
            field: 'content',
            cols: 2
          }, {
            type: 'textarea',
            label: '备注: ',
            field: 'remark',
            cols: 2,
            ':rows': 4
          }
        ]
      }
      let model = {}
      let group = []
      return {
        params: {},
        layout,
        buttons,
        form,
        model,
        group,
        pageLoading: true,
        pageState: 'init',
        page: this,
        metaLabel: '元数据',
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
      isAdd () {
        return handler.isAdd(this.params.group)
      },
      loadType () {
        let vm = this
        return getJson(fillRestPath(urls.type, vm.params)).then((res) => {
          handler.setPageTitle(vm.isAdd() ? `元数据新增-${res.label}` : `元数据编辑-${res.label}`)
          vm.metaLabel = res.label
        })
      },
      loadGroup () {
        let vm = this
        if (vm.isAdd()) {
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

        let item = {id: constant.ADD_ID, label: '新增' + vm.metaLabel}
        if (vm.isChange()) {
          vm.$confirm('数据发生变化, 是否保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            vm.save()
          }).catch(() => {
            vm.resetAdd()
          }).finally(() => {
            vm.group.push(item)
            vm.setCurrentTab(item.id)
            this.pageState = 'state_add'
          })
        } else {
          vm.group.push(item)
          vm.setCurrentTab(item.id)
          vm.pageState = 'state_add'
        }
      },
      resetAdd () {
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
          data.content = JSON.parse(data.content)
        }
        state.reset(this, 'model')
        this.model = data
      },
      switchMeta (tabName) {
        let vm = this
        if (vm.group.length === 0) {
          return
        }
        if (vm.isChange()) {
          vm.$confirm('数据发生变化, 是否保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            vm.save()
          }).catch(() => {
            vm.resetAdd()
            vm.loadMeta(tabName)
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
        if (id === constant.ADD_ID) {
          let metaType = vm.params.type
          let group = vm.group
          let groupName = null
          if (group.length > 1) {
            groupName = group[0].name
          }
          let sorting = group.length - 1
          vm.refreshData({metaType, groupName, sorting})
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
        vm.$refs['facForm'].validate(valid => {
          if (!valid) {
            return
          }
          vm.pageLoading = true
          let data = Object.assign({}, vm.model)
          data.content = JSON.stringify(data.content)
          let saveTab = data.id
          if (!saveTab) {
            saveTab = constant.ADD_ID
          }
          post(urls.save, data).then(res => {
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
                }
                return false
              }
            })
            handler.setPageTitle(vm, `元数据编辑-${vm.metaLabel}`)
            vm.$message({
              type: 'success',
              message: '保存成功!'
            })
          }).finally(() => { vm.pageLoading = false })
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
          loading: 'pageLoading',
          msg: '确认删除当前配置?',
          valid: () => {
            if (vm.isAdd()) {
              if (vm.group.length === 1) {
                vm.$router.back()
              }
              vm.removeGroup(id)
              vm.$message({type: 'success', message: '删除成功!'})
              return false
            }
            let isMain = vm.group[0].id === id
            if (isMain && vm.group.length === 1) {
              vm.$message('该组还存在子配置，不能删除主配置！')
              return false
            }
          }
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .fac-form-group{
    position: relative;
    overflow: hidden;
  }
  .el-tabs--left{
    float: left;
    margin-bottom: 0;
    margin-right: 10px;
  }
</style>
