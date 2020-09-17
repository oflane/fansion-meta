/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import 'vue'
import fata from './fata'
import fataOptions from './fata/options'
import temetas from './temetas'
import fase from 'fansion-base'
import fui from 'fansion-ui'
import metaList from './meta/default/meta-list'
import metaEdit from './meta/default/meta-edit'
import metaGroupList from './meta/default/meta-group-list'
import metaGroupEdit from './meta/default/meta-group-edit'
import ofeMetaEdit from './meta/ofentity/ofe-meta-edit'
import facMetaEdit from './meta/fac/fac-meta-edit'
import facMetaDialog from './meta/fac/fac-meta-dialog'
import temetasRef from './meta/ref/temetas-ref'
/**
 * 安装方法
 * @param Vue vue对象
 * @param opts 选项
 */
const install = function (Vue, opts = {}) {
  // 页面注册
  const pageComps = {
    '/meta/default/meta-list/:type': metaList,
    '/meta/default/meta-edit/:type/:id': metaEdit,
    '/meta/default/meta-group-list/:type': metaGroupList,
    '/meta/default/meta-group-edit/:type/:group': metaGroupEdit,
    '/meta/ofentity/ofe-meta-edit/:type/:group': ofeMetaEdit,
    '/meta/fac/fac-meta-edit/:catagory/:id': facMetaEdit,
    '/meta/fac/fac-meta-edit/:id': facMetaEdit,
    '/meta/fac/fac-meta-dialog': facMetaDialog,
    '/meta/ref/temetas-ref': temetasRef
  }
  fase.init({
    pages: {
      pageComps
    },
    router: {
      routes: !opts.disableRoute ? Object.keys(pageComps) : null
    }
  })
  fata.addFormControls(fataOptions.formControls)
  fata.addConfeta(fataOptions.confetas)
  Vue.use(fui)
  fui.init({references: {refs: {'/meta/ref/temetas-ref': temetasRef}}})
  init(opts)
}
/**
 * 初始化方法
 * @param opts
 */
const init = (opts = {}) => {
  opts.temetas && temetas.addTemeta(opts.temetas)
  opts.fatas && fata.addConfeta(opts.fatas)
  opts.formCtls && fata.addFormControls(opts.formCtls)
}
/**
 * fac组件模块
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-8-15
 */
export default {
  name: 'fansion-meta',
  fata,
  temetas,
  install,
  init
}
