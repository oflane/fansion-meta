/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */

import fase from 'fansion-base'

/**
 * 模板元数据中心
 * @type {{}}
 */
const temetas = {}

/**
 * 添加模板元数据
 * @param data 组件配置的元数据
 */
const addTemeta = fase.builder.register(temetas)
/**
 * 获取模板元数据
 * @param name 模板名称
 * @returns {*}
 */
const getTemeta = name => temetas[name]

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
   * 添加模板元数据
   * @param data 组件配置的元数据
   */
  addTemeta,
  /**
   * 获取模板元数据
   * @param name 模板名称
   * @returns {*}
   */
  getTemeta
}
