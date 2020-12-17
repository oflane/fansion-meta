/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import 'vue'
import fata from './fata'
import options from './options'
import temetas from './temetas'
import fase from 'fansion-base'
import fui from 'fansion-ui'
/**
 * 安装方法
 * @param Vue vue对象
 * @param opts 选项
 */
const install = function (Vue, opts = {}) {
  fase.init(options.fase(opts))
  Vue.use(fui)
  init(options.self)
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
