<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<!--
 --元数据列表
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2018-1-15
 -->
<template>
  <div class="page-layout" v-loading="pageLoading">
    <div class="layout-header clearfix">
      <div class="el-col-12"><button-bar :conf="buttons" :page="page"/></div>
      <div class="el-col-12"><search :conf="search" :page="page"/></div>
    </div>
    <div class="layout-body" v-loading="loading">
      <fac-card-list :model="model.content" :conf="card" :page="page"/>
    </div>
    <div class="layout-body">
      <fac-pagination :model="model" :loader="loader"/>
    </div>
  </div>
</template>
<script>
  import fase from 'fansion-base'
  import fanui from 'fansion-ui'

  const {fillRestPath, getJson} = fase.rest
  const constant = fase.constant
  const DataLoader = fase.DataLoader
  export default {
    name: 'DefaultMetaList',
    data () {
      let search = {
        'xclass': 'pull-right',
        ':loader': 'loader',
        placeholder: '请输入关键字搜索',
        items: [
          'keyword'
        ]
      }
      let titleHtml = '<a href="javascript:void(0)" @click="page.edit(item)">{{item.label}}</a>'
      let cardButtons = fanui.generator.cardListButton([{click: 'edit(item)', text: '详情'}, {click: 'del(item)', text: '删除'}])
      let card = {
        time: 'lastModifyTime',
        titleHtml,
        buttons: cardButtons
      }
      let buttons = [
        {
          name: '新增',
          click: 'add',
          type: 'primary' // success warning danger info
        },
        {
          name: '删除',
          click: 'deletes'
        },
        {
          name: '刷新',
          click: 'queryData'
        }
      ]
      let vm = this
      return {
        urls: {
          type: 'meta-type/load-by-name/:type',
          query: '/meta/find/:type',
          edit: '/meta/default/meta-edit/:type/:id',
          delete: '/meta/delete/:id'
        },
        type: {},
        model: {},
        search,
        card,
        buttons,
        pageLoading: true,
        loading: true,
        loader: new DataLoader(null, vm, 'model', null, null, () => {
          vm.loading = false
        }),
        page: this
      }
    },
    mounted () {
      this.initPage()
    },
    watch: {
      '$route': function () {
        this.initPage()
      }
    },
    methods: {
      initPage () {
        let params = this.$route.params
        let vm = this
        vm.loader.setUrl(fillRestPath(vm.urls.query, params))
        getJson(fillRestPath(vm.urls.type, params)).then((res) => {
          vm.type = res
          if (!vm.type.detailUrl) {
            vm.type.detailUrl = vm.urls.edit
          }
        }).finally(() => {
          vm.pageLoading = false
        })
        this.queryData()
      },
      queryData () {
        this.loading = true
        return this.loader.load()
      },
      add () {
        let url = fillRestPath(this.type.detailUrl, {id: constant.ADD_ID, type: this.type.name})
        this.$router.push(url)
      },
      edit (row) {
        let url = fillRestPath(this.type.detailUrl, {id: row.id, type: this.type.name})
        this.$router.push(url)
      },
      del (row) {
        let vm = this
        fanui.handler.delRow({
          vm,
          url: vm.urls.delete,
          row,
          success: () => {
            vm.$message({type: 'success', message: '删除成功!'})
            vm.queryData()
          },
          loading: 'loading'
        })
      }
    }
  }
</script>
