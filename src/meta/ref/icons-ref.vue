<template>
  <div>
    <div class="min-height-400 padding-content">
      <fac-box-list  ref="list" icon="icon" label="icon" :model="items" @dblclick="reference"/>
    </div>
    <div>
      <fac-pagination  ref="pagination" @current-change="currentChange()" @size-change="sizeChange()"/>
    </div>
  </div>
</template>

<script>
  import icons from './icons.json'

  export default {
    name: 'icons-ref',
    label: '图标',
    pageType: 'ref',
    dailogProps: {
      'min-width': '600px',
      width: '60%'
    },
    data () {
      return {
        data: [],
        items: [],
        pageData:{
          totalElements: icons.length
        }
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      search (keyword) {
        const vm = this
        if (!keyword) {
          const container = vm.$parent.$parent
          keyword = container.getKeyword && container.getKeyword()
        }
        vm.data = !keyword ? icons : icons.filter(icon => icon.name.indexOf(keyword) || icon.keywords.find(k => k.indexOf(keyword)>=0) != null || icon.categories.find(k => k.indexOf(keyword)>=0) != null)
        this.sizeChange()
      },
      currentChange (){
        const {_pageNo, _pageSize} = vm.$refs.pagination.getParameters()
        const end = _pageNo *_pageSize
        this.items = this.data.slice(_pageNo-1*_pageSize, end > this.data.length ? this.data.length : end)
      },
      sizeChange () {
        vm.$refs.pagination.reset()
        this.currentChange()
      },
      refresh () {
        this.search()
      },
      getData () {
        const list = this.$refs.list
        const r = list.getCurrentItem()
        list.reset()
        return r
      },
      reference (item) {
        this.$closeReference(item)
      }
    }
  }
</script>
