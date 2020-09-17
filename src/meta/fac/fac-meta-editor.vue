<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<!--
 --fac页面配置内容组件
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2018-1-15
 -->
<template>
    <div slot="body" class="fac-meta-editor clearfix" >
      <div class="left-float" v-if="showStep">
        <el-steps :active="currentStep" finish-status="success" direction="vertical" align-center @change="switchMeta">
          <el-step :title="item.label" v-for="item in comps" :key="item.name"></el-step>
        </el-steps>
      </div>
      <div class="fac-meta-component" :class="compClass">
        <fac ref="fmc" :meta="compFata" :data="compModel" :owner="this"/>
      </div>
    </div>
</template>

<script>
import temetas from '~/temetas'
import fata from '~/fata'
import fase from 'fansion-base'
import fui from 'fansion-ui'
import fm from './fac-meta-base'

const { furl, gson } = fase.rest
const callback = fase.util.callback
const state = fase.state
const {isAdd, saveData, confirm} = fui.handler
const msg = fui.msg
const metaType = 'com.oflane.fac.model.FacMeta'
export default {
  name: 'FacMetaEditor',
  props: {
    id: String,
    category: String,
  },
  data () {
    return {
      currentStep: 0,
      showStep: false, //是否显示步骤
      stepStatus: 0,//上一步下一步可用状态，0：都不可用，1,下一步可用，2,上一步可用，3，都可用
      compClass: '',
      temeta: {},
      comps: [fm.mainComp],//默认配置组件（基础信息）
      metaData: null, //fac元数据，存储模型
      mainModel: {}, //主表模型
      model: {},//fac页面元数据，真正的fac元数据通过存储模型content生成
      compFata: fm.mainFata,//当前组件元数据
      compModel: {},//当前组件配置模型
      originTemplate: null, //原配置模板
      pageLoading: true,
      pageState: 'init',
      page: this,
    }
  },
  mounted () {
    state.watch(this, 'model')
    state.watch(this, 'mainModel')
    state.watch(this, 'compModel')
    this.initPage()
  },
  watch: {
    currentStep (v) {
      this.refreshStepStatus()
    },
    stepStatus (v) {
      this.$emit('update:stepStatus', v)
    }
  },
  methods: {
    /**
     * 初始化页面
     */
    initPage () {
      this.loadMeta()
    },
    /**
     * 加载模板配置数据
     * @returns {*}
     */
    loadMeta () {
      const vm = this
      const category = this.category
      vm.pageLoading = true
      if (handler.isAdd(this.id)) {
        vm.mainModel = { metaType, category }
        vm.pageLoading = false
        return
      }
      gson(furl(fm.urls.load, { id }), null, res => (vm.refreshData(res))).finally(() => sure(vm.pageLoading = false))
    },
    /**
     * 载入fac存储数据
     */
    refreshData (data) {
      let vm = this
      vm.metaData = data
      const mainModel = {
        id: data.id,
        name: data.name,
        label: data.label,
        metaType: data.metaType,
        option1: data.option1,
        ts: data.ts,
      }
      if (data.content) {
        const model = JSON.parse(data.content)
        model.id = data.id
        mainModel.template = model.template
        vm.originTemplate = model.template
        vm.model = model
        vm.loadTemeta()
      } else {
        vm.model = {}
        state.reset(vm, 'model')
      }
      state.reset(vm, 'mainModel')
    },
    /**
     * 加载模板配置
     */
    loadTemeta () {
      let vm = this
      let template = vm.mainModel.template
      if (!template) {
        vm.temeta = {}
        return
      }
      // 获取模板配置定义
      temetas.getTemeta(template, conf => {
        vm.temeta = conf
        vm.comps = [fm.mainFata, ...(conf ? conf.comps : [])]
        vm.refreshStepStatus()
        vm.showStep = vm.comps.length > 1
        vm.showStep ? vm.compClass = 'show-step' : ''
        if (template === vm.originTemplate) {
          vm.metaData && (vm.model = JSON.parse(vm.metaData.content))
        } else {
          vm.model = conf.defaultModel || {}
        }
        state.reset(vm, 'model')
      })
    },
    refreshStepStatus () {
      const p = this.currentStep > 0
      const n = this.currentStep < this.comps.length - 1
      //上一步下一步可用状态，0：都不可用，1,下一步可用，2,上一步可用，3，都可用
      this.stepStatus =  p && n ? 3 : (p ? 2 : (n ? 1 : 0))
    },

    /**
     * 切换组件页签
     * @param compIndex 组件索引
     */
    switchMeta (compIndex) {
      const vm = this
      const comps = vm.comps
      if (compIndex === 0) {
        this.switchMain()
        return
      }
      const config = vm.temeta.config || {}
      const comp = comps[compIndex]
      const compFata = Object.assign({}, fata.buildCompFata(comp.type) || {}, config[comp.name] || {})
      let compModel = vm.model[comp.name]
      if (!compModel) {
        compModel = { compType: comp.type }
        vm.$set(vm.model, comp.name, compModel)
        if (!state.isChange(vm, 'model')) {
          state.reset(vm, 'model')
        }
      }
      vm.compModel = compModel
      vm.compFata = compFata
    },
    /**
     * 切换组件
     * @param data 组件配置数据模型
     * @param fata 组件配置元数据
     */
    switchComp(data, fata) {
      this.compModel = data
      this.compFata = fata
      state.reset(this,'compModel')
    },
    /**
     * 切换到基础信息组件
     */
    switchMain() {
      this.switchComp(this.mainModel, fm.mainFata)
    },
    /**
     * 整体判断数据是否发生变化（主表变化，组件配置变化）
     * @returns {*|boolean}
     */
    isChange () {
      return state.isChange(this, 'model') || state.isChange(this, 'mainModel')
    },
    /**
     * 保存数据
     */
    save () {
      let vm = this
      if (!vm.isChange()) {
        vm.$message('数据未发生变化！')
        return
      }
      vm.validateCurrent(() => {
        vm.pageLoading = true
        const data = Object.assign({}, vm.mainModel)
        const template = data.template
        delete data.template
        data.content = JSON.stringify({ template, ...vm.model })
        saveData({
          vm,
          url: fm.urls.save,
          model: data,
          success: res => {
            vm.refreshData(res.data)
            msg.success.save()
          },
          fail: msg.error.save,
          loading: 'pageLoading'
        })
      })
    },
    /**
     * 当对话框关闭时的回调
     * @param cb 回调方法
     */
    beforeClose (cb) {
      this.isChange() ? confirm(this, () => cb(), '数据发生变化, 确认放弃修改的数据?') : cb()
    },
    /**
     * 验证当前配置，通过后进行回调
     * @param cb
     */
    validateCurrent (cb) {
      const vm = this
      vm.currentStep === 0 || state.isChange(vm, 'compModel') ? callback(vm.$refs.fmc, 'validate', cb) : cb
    },

    /**
     * 下一步方法
     */
    next () {
      const vm = this
      vm.validateCurrent(_ => vm.currentStep++)
    },
    /**
     * 上一步方法
     */
    prev () {
      this.validateCurrent(_ => vm.currentStep++)
    }
  }
}
</script>
<style lang="less">
.fac-meta-editor{
  position: relative;
  overflow: hidden;
  .left-float {
    float: left;
    top: 20px;
    width: 160px;
  }
  .show-step {
    margin: 160px;
  }
  .fac-meta-component {
    background: transparent;
  }
}
</style>
