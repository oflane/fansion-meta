<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<template>
  <el-dialog :visible.sync="visible">
    <template slot="title">
      <span class="el-dialog__title">{{ title }}</span>
      <span class="radio-header">
        <el-radio-group v-model="currentTab" >
          <el-radio-button :label="state.value"　v-for="state in states" >{{state.label}}</el-radio-button>
        </el-radio-group>
      </span>
    </template>
    <fac-form ref="formItem" :conf="form" :model="currentModel" :page="this"/>
    <div slot="footer">
      <el-dropdown v-if="states.length>2"　@command="onCopy">
        <el-button>
          复制<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="state" v-if="state.value != currentTab && state.value != 'default'" v-for="state in states" >{{state.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      field: 'label'
    },
    {
      type: 'input.number',
      label: '列数:',
      field: 'cols',
      validation: [
        {type: 'number', message: '请输入整数'}
      ]
    }]
  const combine = (model, current, state) => {
    if (model === current) {
      return
    }
    let stateData = {}
    Object.entries(current).forEach(([k, v]) => model[k] !== v && (stateData[k] = v))
    model[state.startsWith('state_') ? state : 'state_' + state] = stateData
  }
  export default {
    name: 'FacFormItem',
    dialog: true,
    props: {
      html: String,
      listModel: Array,
      states: Array,
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
      let tabVisible = this.states.length === 1
      let items = fata.getFormTagItems(model.type)
      let form = {
        cols: 1,
        items: [
          ...defaultItems,
          ...items
        ]
      }
      let currentModel = model
      let currentTab = this.states[0].value
      let tabLayout = {
        header: {
          class: 'tab-header',
          slot: 'header'
        },
        body: 'body'
      }
      return {
        visible: true,
        currentTab,
        tabVisible,
        title: this.isAdd ? '添加表单项目' : '编辑表单项目',
        model,
        currentModel,
        form,
        tabLayout
      }
    },
    watch: {
      currentTab (v, ov) {
        this.switchMeta(v, ov)
      }
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
       * 切换状态页签
       * @param tabName 页签名
       */
      switchMeta (tabName, oldTabName) {
        let vm = this
        oldTabName && combine(vm.model, vm.currentModel, oldTabName)
        let state = tabName.startsWith('state_') ? tabName : 'state_' + tabName
        let currentModel = tabName === this.states[0].value ? vm.model : {...vm.model, ...vm.model[state]}
        vm.currentModel = currentModel
        let items = fata.getFormTagItems(currentModel.type)
        vm.form = {
          cols: 1,
          items: [
            ...defaultItems,
            ...items
          ]
        }
      },
      /**
       * 确定按钮
       */
      onOk () {
        let vm = this
        combine(vm.model, vm.currentModel, vm.currentTab)
        if (this.isAdd) {
          if (this.currentIndex < 0 || this.currentIndex > this.listModel.length) {
            this.listModel.push(this.model)
          } else {
            this.listModel.splice(this.currentIndex, 0, this.model)
          }
        }
        this.$dialogs.closeCurrent()
      },
      /**
       * 取消按钮
       */
      onCancel () {
        this.$dialogs.closeCurrent()
      },
      onCopy (state) {
        let vm = this
        let s = state.value
        s = s.startsWith('state_') ? s : 'state_' + s
        let currentModel = vm.model[s] && {...vm.model, ...vm.model[s]}
        vm.currentModel = currentModel
        let items = fata.getFormTagItems(currentModel.type)
        vm.form = {
          cols: 1,
          items: [
            ...defaultItems,
            ...items
          ]
        }
      },
      /**
       * 控件类型修改
       * @param v
       */
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
<style lang="less" scoped>
  .radio-header {
    position: absolute;
    width: 100%;
    left: 0;
    text-align: center;
    /deep/ .el-radio-button__inner{
      padding: 8px 15px
    }
  }
  .el-dropdown + button {
    margin-left:10px;
  }
</style>