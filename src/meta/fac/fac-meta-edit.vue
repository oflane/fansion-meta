<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->
<!--
 --fac页面配置
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2018-1-15
 -->
<template>
  <fac-layout :conf="layout" v-loading="pageLoading" layout-class="fac-meta-edit">
    <fac-button-bar slot="header" :conf="buttons" :page="page"/>
    <fac-form slot="body" :conf="mainForm" ref="mainForm"  :model="metaModel" :page="this"/>
    <div slot="footer" class="fac-meta-tab clearfix">
      <el-tabs ref="tabs" tab-position="left" style="height: 760px;" @input="switchMeta" v-show="comps && comps.length > 0">
        <el-tab-pane :label="item.label" :name="item.name" v-for="item in comps" :key="item.name">
        </el-tab-pane>
      </el-tabs>
      <div class="fac-meta-component">
        <fac ref="facMetaComponent" :meta="compFata" :model="compModel" :page="this"/>
      </div>
    </div>
  </fac-layout>
</template>

<script>
  import temetas from '~/temetas'
  import fata from '~/fata'
  import fase from 'fansion-base'
  import fanui from 'fansion-ui'

  const {fillRestPath, getJson} = fase.rest
  const state = fase.state
  const handler = fanui.handler

  const urls = {
    load: '/meta/load/:id',
    save: '/meta/save'
  }
  export default {
    name: 'FacMetaEdit',
    data () {
      let layout = {
        header: 'header',
        body: 'body',
        footer: 'footer'
      }
      let buttons = [
        {
          name: '保存',
          click: 'save',
          type: 'primary'
        },
        {
          name: '返回',
          click: 'cancel'
        }
      ]
      let mainForm = {
        cols: 3,
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
            label: '模板: ',
            field: 'template',
            '@change': 'page.loadTemeta()',
            ':options': 'page.templates'
          }
        ]
      }

      let model = {}
      let temeta = {}
      let metaModel = {}
      let metaData = null
      let comps = []
      let compFata = {}
      let templates = []
      let compModel = {}
      return {
        mainForm,
        layout,
        templates,
        buttons,
        temeta,
        comps,
        compFata,
        metaData,
        metaModel,
        model,
        compModel,
        originTemplate: null,
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
      state.watch(this, 'metaModel')
      this.initPage()
    },
    methods: {
      /**
       * 初始化页面
       */
      initPage () {
        let vm = this
        vm.templates = Object.entries(temetas.data).map(([k, v]) => ({ value: k, label: v.name || v.name || k }))
        vm.loadMeta()
      },
      /**
       * 加载模板配置
       */
      loadTemeta () {
        let vm = this
        let template = vm.metaModel.template
        if (!template) {
          vm.temeta = {}
          vm.comps = []
          vm.compFata = {}
          return
        }
        //  获取模板配置定义
        let conf = temetas.getTemeta(template)
        vm.temeta = conf
        let comps = conf.comps
        vm.comps = comps
        if (template !== vm.model.template) {
          if (template === vm.originTemplate) {
            vm.model = JSON.parse(vm.metaData.content)
          } else {
            vm.model = conf.defaultModel || {}
          }
          state.reset(vm, 'model')
        }
        if (comps && comps.length > 0) {
          vm.setCurrentTab(comps[0].name)
        } else {
          vm.compFata = {}
        }
      },
      // 刷新当前模板配置数据
      refreshData (data) {
        let vm = this
        if (data.content) {
          state.reset(vm, 'model')
          let m = JSON.parse(data.content)
          m.id = data.id
          vm.metaModel = {
            id: data.id,
            name: data.name,
            label: data.label,
            metaType: data.metaType,
            ts: data.ts,
            template: m.template
          }
          vm.originTemplate = m.template
          vm.loadTemeta()
          vm.model = m
        } else {
          vm.metaModel = {
            name: data.name,
            label: data.label,
            metaType: data.metaType,
            ts: data.ts,
            template: null
          }
          this.model = {}
        }
        state.reset(vm, 'metaModel')
        this.metaData = data
      },

      /**
       * 切换组件页签
       * @param tabName 页签名
       */
      switchMeta (tabName) {
        let vm = this
        let comps = vm.comps
        if (!vm.comps || vm.comps.length === 0) {
          return
        }
        let config = vm.temeta.config || {}
        let tab = comps.find(v => v.name === tabName)
        let compFata = config[tabName]
        if (!compFata) {
          compFata = fata.buildCompFata(tab.type)
        } else if (typeof compFata === 'object') {
          let cb = fata.buildCompFata(tab.type)
          if (typeof cb === 'object') {
            compFata = Object.assign({}, cb, compFata)
          }
        }
        vm.compFata = compFata
        let compModel = vm.model[tabName]
        if (!compModel) {
          compModel = {}
          vm.$set(vm.model, tabName, compModel)
        }
        vm.compModel = compModel
      },
      /**
       * 加载模板配置数据
       * @returns {*}
       */
      loadMeta () {
        let vm = this
        let id = this.$route.params.id
        let catagory = this.$route.params.catagory
        vm.formLoading = true
        vm.pageLoading = true
        if (handler.isAdd(id)) {
          vm.metaModel = {metaType: 'com.oflane.fac.model.FacMeta', catagory}
          vm.pageLoading = false
          return
        }
        return getJson(fillRestPath(urls.load, {id})).then(res => {
          vm.refreshData(res)
        }).finally(() => {
          vm.pageLoading = false
        })
      },
      setCurrentTab (name) {
        this.$refs['tabs'].setCurrentName(name)
      },
      getCurrentTab () {
        return this.$refs['tabs'].currentName
      },
      getCurrentModelMeta () {
        let temeta = this.temeta
        if (!temeta.getModelMeta) {
          return
        }
        return temeta.getModelMeta(this.getCurrentTab())
      },
      isChange () {
        return state.isChange(this, 'model') || state.isChange(this, 'metaModel')
      },
      save () {
        let vm = this
        if (!vm.isChange()) {
          vm.$message('数据未发生变化！')
          return
        }
        const postData = () => {
          vm.pageLoading = true
          let data = Object.assign({}, vm.metaModel)
          let template = data.template
          delete data.template
          data.content = JSON.stringify({template, ...vm.model})
          handler.saveData = ({
            vm,
            url: urls.save,
            model: data,
            success: res => {
              vm.refreshData(res.data)
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
            },
            loading: 'pageLoading'})
        }
        vm.$refs['mainForm'].validate(valid => {
          if (!valid) {
            return
          }
          let facMetaComp = vm.$refs['facMetaComponent']
          if (facMetaComp && facMetaComp.validate) {
            facMetaComp.validate(v => {
              if (v) {
                postData()
              }
            })
          } else {
            postData()
          }
        })
      },
      cancel () {
        let vm = this
        if (vm.isChange()) {
          handler.confirm(vm, () => vm.$router.back(), '数据发生变化, 确认放弃修改的数据?')
        } else {
          vm.$router.back()
        }
      }
    }
  }
</script>
<style lang="less">
  .fac-meta-edit{
    position: relative;
    overflow: hidden;
    .layout-body{
      margin:30px 30px 10px 30px;
    }
    .layout-footer{
      margin:0px 30px 30px 30px;
      background: transparent;
    }
    .fac-meta-tab{
      background: #fff;
      padding:30px;
    }
    .el-tabs--left{
      float: left;
      margin-bottom: 0;
      margin-right: 10px;
    }
    .fac-meta-component{
      margin-left: 105px;
    }
  }
</style>
