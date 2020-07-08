/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fase from 'fansion-base'

const {simulatePromise, isPromise, sure} = fase.util
/**
 * 模板元数据中心
 * @type {{}}
 */
const temetas = {}
/**
 * 模板类型
 * @type {{}}
 */
const types = []

/**
 * 分类标签
 * @type {{}}
 */
const tags = []
/**
 * 添加模板元数据
 * @param data 组件配置的元数据
 */
const addTemeta = fase.builder.typeRegister(temetas)

/**
 * 添加模板类型
 * @param data 模板类型
 */
const addType = fase.builder.collection(types)

/**
 * 添加tag分类
 * @param data tag对像
 */
const addTag = fase.builder.collection(tags)
/**
 * 获取模板元数据
 * @param name 模板名称
 * @returns {*}
 */
const getTemeta = (name, cb, type) => {
  let rs = null
  if (type) {
    rs = temetas[type] ? temetas[type][name] : null
  } else {
    for (const t of Object.values(temetas)) {
      if (t[1] && t[1][name]) {
        rs = t[1][name]
        break
      }
    }
  }
  isPromise(rs) ? rs.then(cb) : cb(rs)
  return rs
}

/**
 * 根据类型获取对应的注册信息
 * @param type 类型标识
 * @returns {any}
 */
const getTypeTemetas = (type) => temetas[type]

/**
 * 根据关键字和tag过滤单个类型数据
 * @param data 单个类型模板数据
 * @param keyword 过滤关键字
 * @param tags 标签
 * @returns {any}
 */
const filterData = (data, keyword, tags) => data ? data.filter(([k, v, t]) => sure(temetas[t][k] = v) && (!keyword || (v.name && v.name.indexOf(keyword) > -1)) && (!tags || tags.length === 0 || (v.tags && v.tags.filter(t => tags.indexOf(t) > -1).length === tags.length))) : []

/**
 * 映射成promise对象
 * @param data 数据对象
 * @returns {*[]}
 */
const map2Promise = (data, type) => data ? Object.entries(data).map(([k, v]) => isPromise(v) ? v.then(r => [k, r, type]) : simulatePromise([k, v, type])) : []
/**
 * 过滤对应的模板数据
 * @param keyword 关键字
 * @param tags 标签
 * @param type 类型
 * @returns {*}
 */
const filter = (cb, keyword, tags, type) => {
  tags && (tags = Array.isArray(tags) ? tags : [tags])
  cb && Promise.all(type ? map2Promise(getTypeTemetas(type), type) : Object.entries(temetas).map(([k, v]) => map2Promise(v, k)).reduce((p, c) => p.concat(c))).then(ress => {
    cb(filterData(ress))
  })
}
/**
 * 模板元数据注册中心
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/2/18
 */
export default {

  /**
   * 模板元数据中心
   */
  data: temetas,
  /**
   * 类型列表
   */
  types,
  /**
   * 标签集
   */
  tags,
  /**
   * 添加模板元数据
   * @param data 组件配置的元数据
   */
  addTemeta,
  /**
   * 获取模板元数据
   * @param name 模板名称
   * @returns {*}
   */
  getTemeta,
  /**
   * 根据类型获取对应的注册信息
   * @param type 类型标识
   * @returns {any}
   */
  getTypeTemetas,
  /**
   * 添加模板类型
   * @param data 模板类型
   */
  addType,
  /**
   * 添加tag分类
   * @param data tag对像
   */
  addTag,
  /**
   * 过滤对应的模板数据
   * @param keyword 关键字
   * @param tags 标签
   * @param type 类型
   * @returns {*}
   */
  filter
}
