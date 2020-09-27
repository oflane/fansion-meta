/**
 * fac配置器，基础配置信息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 202020/9/17
 */
import fata from '~/fata'

const urls = {
  load: '/fac/load/:name',
  save: '/meta/save'
}
const mainComp = {
  name: 0,
  type: 0,
  label: '基础信息'
}
const mainFata = fata.buildFormFata([
  {
    type: 'input',
    label: '名称: ',
    field: 'name',
    validation: [
      {
        required: true,
        message: '实体名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'input',
    label: '显示名称: ',
    field: 'label',
    validation: [
      {
        required: true,
        message: '实体显示名称不能为空',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'reference',
    label: '模板: ',
    field: 'template',
    '@change': 'page.loadTemeta()',
    refTo: '/meta/ref/temetas-ref'
  },
  {
    type: 'input',
    label: '访问地址: ',
    field: 'option1'
  }
])
export default {
  urls,
  mainComp,
  mainFata
}
