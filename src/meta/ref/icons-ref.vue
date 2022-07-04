<template>
  <el-dialog :visible.sync='visible' min-width="600px" width="60%">
    <template slot="title">
      <span class="el-dialog__title">选择图标</span>
      <div class="tab-center" v-if="!noImage">
        <el-radio-group v-model="selType"  size="small">
          <el-radio-button label="icon">选择图标</el-radio-button>
          <el-radio-button label="image">自定义图片</el-radio-button>
        </el-radio-group>
      </div>
      <div class="ref-search"><fac-search ref="search" @search="search" size="small" css="custom-search"/><button @click="search"><i class="el-icon-refresh"></i></button></div>
    </template>
    <div v-if="this.selType==='icon'">
      <div class="min-height-400 padding-content">
        <fac-box-list  ref="list" icon="label" label="label" :model="items" @dblclick="reference"/>
      </div>
      <div class="clearfix">
        <fac-pagination  ref="pagination" @current-change="pageChange()" @size-change="sizeChange()" :model="pageData" :page-size="50" :page-sizes="[50, 100]"/>
      </div>
    </div>
    <div v-if="this.selType==='image'" class="padding-content" style="min-height: 480px">
      <el-form ref="imageForm" :rules="rules" :model="imageData" class="fac-form fac-form-cols1 fac-form-width1">
        <div class="form-body">
          <el-form-item prop="imageUrl" label="图片地址">
            <el-input  placeholder="输入图片地址"
              suffix-icon="fa fa-image"
              v-model="imageData.url">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="onOk">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
      <el-button @click="onClear">清除</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import icons from './icons'
  const getData = () => icons
  export default {
    name: 'icons-ref',
    label: '图标',
    pageType: 'ref',
    dialog: true,
    ds: getData,
    props: {
      noImage: {
        type: Boolean,
        default: false
      }
    },
    data () {
      const rules = {
        imageUrl: [
          {required: true, message: '请输图片地址', trigger: 'blur'},
          {type: 'url', message: '请输入正确的图片地址', trigger: 'none'}
        ]
      }
      return {
        visible: true,
        selType: 'icon',
        rules,
        imageData: {},
        data: [],
        items: [],
        pageData:{
          totalElements: 0
        }
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      /**
       * 图标列表搜索
       * @param keyword 搜索关键字
       */
      search (keyword) {
        const vm = this
        vm.selType = 'icon'
        vm.data = !keyword ? icons : icons.filter(icon => icon.value.indexOf(keyword) > -1)
        vm.pageData.totalElements = vm.data.length
        vm.$nextTick(_ => vm.sizeChange())
      },
      /**
       * 图标分页，当前页变化
       */
      pageChange (){
        const {_pageNo, _pageSize} = this.$refs.pagination.getParameters()
        console.log('===' + _pageNo)
        const end = _pageNo *_pageSize
        this.items = this.data.slice((_pageNo-1)*_pageSize, end > this.data.length ? this.data.length : end)
      },
      /**
       * 图标分页，分页大小变化
       */
      sizeChange () {
        this.pageChange()
      },
      /**
       * 双击图标处理
       * @param item 图标条目
       */
      reference (item) {
        this.$closeReference(item)
      },
      /**
       * 重置引用数据
       */
      reset () {
        const list = this.$refs.list
        list && list.reset()
        this.imageData.url = null
      },
      /**
       * 确定操作
       */
      onOk () {
        const vm = this
        if (vm.selType === 'image') {
          vm.$refs.imageForm.validate((c) => {
            if (!c) {
              return
            }
            const url = vm.imageData.url
            const data = {value: url, label: url}
            vm.reset()
            vm.$closeReference(data)
          })
        } else {
          const list = vm.$refs.list
          const data = list.getCurrentItem()
          vm.reset()
          if (data) {
            this.$closeReference(data)
          }
        }
      },
      /**
       * 取消操作
       */
      onCancel () {
        this.$closeReference()
      },
      /**
       * 清除操作
       */
      onClear () {
        this.$closeReference({})
      },
      /**
       * 引用对话框展现方法
       */
      show () {
        this.visible = true
        this.$emit('open', this)
      },
      /**
       * 判断引用对话框是否显示
       * @returns {boolean|*}
       */
      isVisible () {
        return this.visible
      },
      /**
       * 引用对话框隐藏方法
       */
      hide () {
        this.visible = false
        this.$emit('close', this)
      }
    }
  }
</script>
<style>
.custom-search {
  width: 200px!important;
  position: relative;
}
</style>
