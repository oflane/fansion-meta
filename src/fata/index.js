/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
/**
 * 组件配置元数据注册处理中心，fata是fac component meta的组件元数据
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2017-7-13
 */
import fase from 'fansion-base'
/**
 * 工具方法
 */
const isVueComponent = fase.util.isVueComponent

/**
 * 组件的配置元数据，用来生成组件的配置界面
 * @type {{}}
 */
const confetas = {}

/**
 * 处理注册的组件配置元数据,如果组件存在form属性则加入到表单控件列表中
 * @param component
 * @returns component
 */
const handleConfeta = (component) => component.form && addFormControl(component.form) ? component : component
/**
 * 添加组件配置的元数据
 * @param data 组件配置的元数据
 */
const addConfeta = fase.builder.register(confetas, 'name', handleConfeta)
/**
 * 获取组件配置的元数据
 * @param name 组件类型名
 * @returns {*}
 */
const getConfeta = name => confetas[name]

/**
 * 获取组件配置的元数据的配置项目
 * @param name 组件类型名
 * @returns {*}
 */
const getConfetaItems = name => {
  const items = getConfeta(name) || []
  return Array.isArray(items) ? items : items.items
}

/**
 * 获取组件配置的元数据的带有表单特征的配置项目
 * @param name 组件类型名
 * @returns {*}
 */
const getFormTagItems = name => getConfetaItems(name).filter(v => v.tag !== 'self')
/**
 * 获取组件配置的元数据的自身特征配置项目
 * @param name 组件类型名
 * @returns {*}
 */
const getSelfTagItems = name => getConfetaItems(name).filter(v => v.tag !== 'self')
/**
 * 构建
 * @param component
 * @returns {{noc: boolean, components: {subPage: *}, methods: {validate(*=): void}, template: string}}
 * @param modelName
 */
const buildSubPageFata = (component, modelName) => ({
  noc: true,
  components: {
    subPage: component
  },
  methods: {
    validate (cb) {
      const sub = this.$refs.subPage
      if (sub.validate) {
        sub.validate(cb)
      } else {
        cb.call(this, true)
      }
    }
  },
  template: `<sub-page ref="subPage" :page="page" :model="${modelName}"/>`
})

/**
 * 根据控件配置数组构建fac元数据配置
 * @param items 控件配置数组
 * @param modelName 模型名称
 * @param cols 列数
 * @returns {{components: {type: string, cols: number, ':model': *, items: *}[]}}
 */
const buildFormFata = (items, modelName = 'model', cols = 1) => {
  let form
  if(typeof items === 'object' && Array.isArray(items.items)) {
    form = Object.assign({
      type: 'fac-form',
      cols,
      ref: 'subPage',
      ':model': modelName,
    }, items)
  } else if (Array.isArray(items)) {
    form = {
      type: 'fac-form',
        cols,
        ref: 'subPage',
      ':model': modelName,
      items
    }
  } else if(typeof items === 'object' && Array.isArray(items.components) && items.components.length > 0 && Array.isArray(items.components[0].items)) {
    if(items.methods !== null &&  items.methods.validate !== null){
      return items
    }
    if(!items.components[0].ref) {
      return items
    }
    const formRef = items.components[0].ref
    return Object.assign({}, items, {
      methods: {
        validate(cb) {
          const sub = this.$refs[formRef]
          if (sub && sub.validate) {
            sub.validate(cb)
          } else {
            cb.call(this, true)
          }
        }

      }
    })
  } else {
    return items
  }
  return {
    components: [
      form
    ],
    methods: {
      validate (cb) {
        const sub = this.$refs.subPage
        if (sub && sub.validate) {
          sub.validate(cb)
        } else {
          cb.call(this, true)
        }
      }
    }
  }
}

/**
 * 根据组件类型和tag特征生成组件的表单界面fata数据
 * @param type 组件类型
 * @param tag 组件特征
 * @param modelName 组件的使用的模型名称
 * @param cols 生成表单时的表单列数
 * @returns {*}
 */
const buildFata = (type, tag, modelName = 'model', cols = 1) => {
  type = type.toDash()
  const conf = getConfeta(type)
  if (!conf) {
    return null
  }
  if (!modelName) {
    modelName = 'model'
  }
  if (typeof (conf) === 'function' || isVueComponent(conf)) {
    return buildSubPageFata(conf, modelName)
  }
  const items = Array.isArray(conf) ? conf : conf.items
  return buildFormFata(items.filter(v => !v.tag || !tag || v.tag.indexOf(tag) > -1), modelName)
}

/**
 * 生成表单项目的配置界面的fata数据
 * @param type 表单项组件类型
 * @param modelName 对应的model类型
 * @param cols 配置界面中表单的列数，默认为1
 * @returns {*} fata数据
 */
const buildFormItemFata = (type, modelName, cols) => buildFata(type, 'form', modelName, cols)

/**
 * 生成当个组件的的配置界面的fata数据
 * @param type 组件类型
 * @param modelName 对应的model类型
 * @param cols 配置界面中表单的列数，默认为1
 * @returns {*} fata数据
 */
const buildCompFata = (type, modelName, cols) => buildFata(type, 'self', modelName, cols)

/**
 * 表单中可以包含的控件
 * @type {Array}
 */
const formControls = []
/**
 * 添加表单中可以使用的控件名称
 * @param data 表单中可以使用的控件名称或集合
 */
const addFormControl = fase.builder.collection(formControls)
/**
 * 获取组件配置的元数据
 * @param name 组件类型名
 * @returns {*}
 */
const getFormControls = () => formControls

/**
 * 根据组件类型生成组件配置界面
 * @param type 组件类型
 * @param isform 是否为表单控件配置
 * @returns {object} 组件配置
 */
export default {
  /**
   * 组件配置元数据中心
   */
  confetas,
  /**
   * 添加组件配置的元数据
   * @param data 组件配置的元数据
   */
  addConfeta,
  /**
   * 获取组件配置的元数据
   * @param name 组件类型名
   * @returns {*}
   */
  getConfeta,
  /**
   * 获取组件配置的元数据的配置项目
   * @param name 组件类型名
   * @returns {*}
   */
  getConfetaItems,

  /**
   * 获取组件配置的元数据的带有表单特征的配置项目
   * @param name 组件类型名
   * @returns {*}
   */
  getFormTagItems,
  /**
   * 获取组件配置的元数据的自身特征配置项目
   * @param name 组件类型名
   * @returns {*}
   */
  getSelfTagItems,
  /**
   * 根据组件类型和tag特征生成组件的表单界面fata数据
   * @param type 组件类型
   * @param tag 组件特征
   * @param modelName 组件的使用的模型名称
   * @param cols 生成表单时的表单列数
   * @returns {*}
   */
  buildFata,
  /**
   * 生成表单项目的配置界面的fata数据
   * @param type 表单项组件类型
   * @param modelName 对应的model类型
   * @param cols 配置界面中表单的列数，默认为1
   * @returns {*} fata数据
   */
  buildFormItemFata,
  /**
   * 生成当个组件的的配置界面的fata数据
   * @param type 组件类型
   * @param modelName 对应的model类型
   * @param cols 配置界面中表单的列数，默认为1
   * @returns {*} fata数据
   */
  buildCompFata,
  /**
   * 表单中可以包含的空间
   * @type {Array}
   */
  formControls,
  /**
   * 添加表单中可以使用的控件名称
   * @param data 表单中可以使用的控件名称或集合
   */
  addFormControls: addFormControl,
  /**
   * 获取组件配置的元数据
   * @param name 组件类型名
   * @returns {*}
   */
  getFormControls,
  /**
   * 根据控件配置数组构建fac元数据配置
   * @param items 控件配置数组
   * @param modelName 模型名称
   * @param cols 列数
   * @returns {{components: {type: string, cols: number, ':model': *, items: *}[]}}
   */
  buildFormFata
}
