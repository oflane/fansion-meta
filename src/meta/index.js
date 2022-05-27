/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import metaList from './default/meta-list'
import metaEdit from './default/meta-edit'
import metaGroupList from './default/meta-group-list'
import metaGroupEdit from './default/meta-group-edit'
import ofeMetaEdit from './ofentity/ofe-meta-edit'
import facMetaEdit from './fac/fac-meta-edit'
import facMetaDialog from './fac/fac-meta-dialog'
import temetasRef from './ref/temetas-ref'
import iconssRef from './ref/icons-ref'

/**
 * 页面集合
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/14/18
 */
export default {
  '/meta/default/meta-list/:type': metaList,
  '/meta/default/meta-edit/:type/:id': metaEdit,
  '/meta/default/meta-group-list/:type': metaGroupList,
  '/meta/default/meta-group-edit/:type/:group': metaGroupEdit,
  '/meta/ofentity/ofe-meta-edit/:type/:group': ofeMetaEdit,
  '/meta/fac/fac-meta-edit/:catagory/:id': facMetaEdit,
  '/meta/fac/fac-meta-edit/:id': facMetaEdit,
  '/meta/fac/fac-meta-dialog': facMetaDialog,
  '/meta/ref/temetas-ref': temetasRef,
  '/meta/ref/icons-ref': iconssRef
}
