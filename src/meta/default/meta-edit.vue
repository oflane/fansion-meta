<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<template>
  <fac-layout :conf="layout" v-loading="pageLoading">
    <fac-button-bar slot="header" :conf="buttons" :page="page"/>
    <fac-form slot="body" ref="facForm" :conf="form"  :model="model"/>
  </fac-layout>
</template>

<script>
  import fase from 'fansion-base'
  import fanui from 'fansion-ui'

  const {furl, gson} = fase.rest
  const handler = fanui.handler
  const urls = {
    type: 'meta-type/load-by-name/:type',
    load: 'meta/load/:id',
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
          name: '保存',
          click: 'save',
          type: 'primary' // success warning danger info
        },
        {
          name: '取消',
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
      return {
        layout,
        buttons,
        form,
        model,
        pageLoading: true,
        pageState: 'init',
        page: this
      }
    },
    watch: {
      pageState (val, oldVal) {
        val !== oldVal && this.$emit('stateChanged', val)
      }
    },
    mounted () {
      this.initPage()
    },
    methods: {
      initPage () {
        let vm = this
        let id = this.$route.params.id
        let type = this.$route.params.type
        let typeName = this.$route.params.typeName
        let url
        let isAdd = handler.isAdd(id)
        if (isAdd) {
          if (!urls.add) {
            gson(furl(urls.type, {type})).then((res) => {
              handler.setPageTitle(vm, `元数据新增-${res.label}`)
            }).finally(() => {
              vm.pageLoading = false
            })
            vm.model = {metaType: type}
            vm.pageState = 'state_add'
            return
          }
          url = urls.add
          vm.pageState = 'state_add'
        } else {
          url = furl(urls.load, {id})
          handler.setPageTitle(vm, `元数据编辑-${typeName}`)
          vm.pageState = 'state_edit'
        }
        Promise.all([
          gson(furl(urls.type, {type})).then((res) => {
            handler.setPageTitle(vm, isAdd ? `元数据新增-${res.label}` : `元数据编辑-${res.label}`)
          }),
          gson(url).then(res => {
            res.content = JSON.parse(res.content)
            vm.model = res
          })
        ]).finally(() => {
          vm.pageLoading = false
        })
      },
      save () {
        let vm = this
        handler.saveData({
          vm,
          url: urls.save,
          form: 'facForm',
          model: () => {
            let data = Object.assign({}, vm.model)
            data.content = JSON.stringify(data.content)
            return data
          },
          success: () => {
            this.$router.back()
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          },
          loading: 'pageLoading'
        })
      },
      cancel () {
        this.$router.back()
      }
    }
  }
</script>
