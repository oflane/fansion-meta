<!--
  - Copyright(c) Oflane Software 2017. All Rights Reserved.
  -->

<!--
 --分组元数据列表
 --author Paul.Yang E-mail:yaboocn@qq.com
 --version 1.0 2018-1-15
 -->
<script>
  import MetaList from './meta-list'
  import fase from 'fansion-base'
  import fanui from 'fansion-ui'

  const furl = fase.rest.furl
  const constant = fase.constant
  export default {
    name: 'DefaultMetaGroupList',
    extends: MetaList,
    data () {
      return {
        urls: {
          type: 'meta-type/load-by-name/:type',
          query: '/meta/group/find/:type',
          edit: '/meta/default/meta-group-edit/:type/:group',
          delete: '/meta/group/delete/:id'
        }
      }
    },
    methods: {
      add () {
        let url = furl(this.type.detailUrl, {group: constant.ADD_ID, type: this.type.name})
        this.$router.push(url)
      },
      edit (row) {
        let url = furl(this.type.detailUrl, {group: row.name, type: this.type.name})
        this.$router.push(url)
      },
      del (row) {
        let vm = this
        fanui.handler.delRow({
          vm,
          url: furl(this.urls.delete, {group: row.name, type: vm.type.name}),
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
