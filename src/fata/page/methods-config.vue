<template>
  <fac-list :model="model.apps" sortable label="name">
    <template slot="header">
      <li class="actions">
        <el-link icon="fa fa-plus" type="primary" @click="onSelectMethod">添加应用</el-link>
      </li>
    </template>
    <template v-slot="{item, index}">
      <div class="app-item">
        <span class="app-icon"><fac-icon :url="item.icon"></fac-icon></span>
        <span class="app-item-content">
              <div class="app-item-title">{{item.name}}</div>
              <span>{{item.remark||'暂无描述'}}</span>
            </span>
        <span class="item-remove">
              <i class="fa fa-trash" @click="delItem(index)"/>
            </span>
      </div>
    </template>
  </fac-list>
</template>
<script>
  import fase from 'fansion-base'
  import fui from 'fansion-ui'
  import {backend} from '~/const'
  const { gson, furl } = fase.rest
  const {handler, msg} = fui
  const urls = {
    load: backend('/workbench-group/load/:id'),
    saven: backend('/workbench-group/saven')
  }
  const formMeta = {
    items: [
      {
        type: 'input',
        label: '分组名称：',
        field: 'name',
        validation: [
          {required: true, message: '请分组名称', trigger: 'blur'}
        ]
      }
    ],
    cols: 1,
    title: '自定义分组'
  }
  export default {
    name: 'WorkbenchGroupDetail',
    label: '工作台分组详情',
    props: {
      id: String,
      sorting: Number
    },
    data () {
      return {
        formMeta,
        model: {}
      }
    },
    mounted () {
      this.initPage()
    },
    watch: {
      id () {
        this.initPage()
      },
      sorting (v) {
        if (v >= 0) {
          this.model.sorting = v
        }
      }
    },
    methods: {
      initPage () {
        const vm = this
        const id = vm.id
        const sorting = vm.sorting
        if (id === fase.constant.ADD_ID) {
          vm.model = {sorting, apps: []}
        } else {
          gson(furl(urls.load, {id}), null, res => (vm.model = res))
        }
      },
      onSelectApp () {
        this.$showDialog({component: workbenchGroupAppSelector, params: {':selected': this.model.apps}})
      },
      delItem (index) {
        this.model.apps.splice(index, 1)
      },
      save () {
        const vm = this
        const model = vm.model
        const form = vm.$refs.form
        if (model.apps == null || model.apps.length === 0) {
          vm.$message({type: 'warning', message: '请选择分组中的应用'})
          return
        } else {
          vm.model.apps.forEach((v, i) => (v.sorting = i))
        }
        handler.saveJson({
          vm,
          form,
          url: urls.saven,
          model,
          success: res => {
            this.$emit('save', res)
            msg.success.save()
          },
          fail: msg.error.save,
          loading: 'pageLoading'
        })
      },
      cancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
<style lang="less">
.workgroup-detail{
  margin: 30px auto;
  width: 600px;
  .fac-form-cols1 {
    .form-body {
      padding: 0;
      margin: 0!important;
    }
  }
  .app-title{
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
    &:before{
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  .footer{
    padding: 30px;
    text-align: right;
  }
  .app-item{
    align-items: center;
    display: flex;
    width: 100%;
    i{
      cursor: pointer;
    }
    .app-icon{
      height: 40px;
      width: 40px;
      padding: 5px;
      color: #0190FE;
      i{
        font-size: 30px;
      }
      img{
        width: 30px;
        height: 30px;
      }
    }
    .app-item-content{
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
    }
    .app-item-title{
      display: flex;
      color: #606266;
      margin-bottom: 4px;
    }
    .app-item-desc{
    }
  }
  .item-remove{
    margin-left: auto;
    font-size: 14px;
    line-height: 0;
    display: flex;
    align-items: center;
    height: 32px;
  }
}
</style>
