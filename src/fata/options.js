/*
 * Copyright(c) Oflane Software 2017. All Rights Reserved.
 */
import facFormConfig from './page/fac-form-config'
import facTableConfig from './page/fac-table-config'
import facXqueryConfig from './page/fac-xquery-config'

/**
 * 基于input控件的配置项
 * @type {*[]}
 */
const input = [
  {
    label: '字段',
    field: 'field',
    tag: 'form'
  },
  {
    label: '提示信息',
    field: 'placeholder'
  },
  {
    label: '不可用',
    field: 'disabled',
    type: 'switch-box'
  },
  {
    label: '值绑定',
    field: 'vModel',
    tag: 'self'
  },
  {
    label: '值',
    field: 'value',
    tag: 'self'
  },
  {
    label: '大小',
    field: 'size',
    tag: 'self'
  },
  {
    type: 'switch-box',
    label: '忽略',
    field: 'ignore',
    tag: 'form'
  }
]

const confetas = {
  input,
  'input.number': input,
  password: input,
  textarea: [...input, {
    label: '行数',
    field: 'rows'
  }],
  span: [
    {
      label: '内容',
      field: '#content'
    },
    {
      field: 'field',
      label: '字段',
      tag: 'form'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    },
    {
      field: 'vText',
      label: '值绑定',
      tag: 'self'
    }
  ],
  'switch-box': [
    {
      label: '字段',
      field: 'field',
      tag: 'form'
    },
    {
      label: '打开值',
      field: 'activeText'
    },
    {
      label: '关闭值',
      field: 'inactiveValue'
    },
    {
      label: '打开显示文本',
      field: 'activeText'
    },
    {
      label: '关闭显示文本',
      field: 'inactiveText'
    },
    {
      label: '打开显示颜色',
      field: 'activeColor'
    },
    {
      label: '关闭显示颜色',
      field: 'inactiveColor'
    },
    {
      label: '值绑定',
      field: 'vModel',
      tag: 'self'
    },
    {
      label: '值',
      field: 'value',
      tag: 'self'
    },
    {
      label: '不可用',
      field: 'disabled',
      type: 'switch-box'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    }
  ],
  tags: [
    {
      label: '字段',
      field: 'field',
      tag: 'form'
    },
    {
      label: '打开值',
      field: 'activeText'
    },
    {
      label: '是否单值',
      field: 'single',
      type: 'switch-box'
    },
    {
      label: '值字段名',
      field: 'valueField'
    },
    {
      label: '显示属性名',
      field: 'labelField'
    },
    {
      label: '只读值列表',
      field: 'readonlyValue'
    },
    {
      label: '值绑定',
      field: 'vModel',
      tag: 'self'
    },
    {
      label: '值',
      field: 'value',
      tag: 'self'
    },
    {
      label: '不可用',
      field: 'disabled',
      type: 'switch-box'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    }
  ],
  combo: [
    {
      field: 'field',
      label: '字段',
      tag: 'form'
    },
    {
      field: 'placeholder',
      label: '提示信息'
    },
    {
      type: 'tags',
      field: ':options',
      label: '选项数据',
      ':single': false
    },
    {
      field: 'opCode',
      label: '选项编码'
    },
    {
      field: 'opUrl',
      label: '选项地址'
    },
    {
      type: 'switch-box',
      field: 'disabled',
      label: '不可用'
    },
    {
      type: 'switch-box',
      field: 'clearable',
      label: '可清除'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    },
    {
      type: 'switch-box',
      field: 'multiple',
      label: '多选'
    },
    {
      type: 'input.number',
      field: 'multipleLimit',
      label: '多选数量'
    },
    {
      label: '值绑定',
      field: 'vModel',
      tag: 'self'
    },
    {
      label: '值',
      field: 'value',
      tag: 'self'
    },
    {
      field: 'size',
      label: '大小',
      tag: 'self'
    },
    {
      field: 'itemValue',
      label: '选项值字段'
    },
    {
      field: 'itemLabel',
      label: '选项显示字段'
    }
  ],
  comtext: [
    {
      field: 'field',
      label: '字段',
      tag: 'form'
    },
    {
      type: 'tags',
      field: ':options',
      label: '选项数据',
      ':single': false
    },
    {
      field: 'opCode',
      label: '选项编码'
    },
    {
      field: 'opUrl',
      label: '选项地址'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    },
    {
      type: 'switch-box',
      field: 'multiple',
      label: '多选'
    },
    {
      label: '值绑定',
      field: 'vModel',
      tag: 'self'
    },
    {
      label: '值',
      field: 'value',
      tag: 'self'
    },
    {
      field: 'itemValue',
      label: '选项值字段'
    },
    {
      field: 'itemLabel',
      label: '选项显示字段'
    }
  ],
  reference: [
    {
      field: 'field',
      label: '字段',
      tag: 'form'
    },
    {
      field: 'labelField',
      label: '显示字段',
      tag: 'form'
    },
    {
      field: 'placeholder',
      label: '提示信息'
    },
    {
      field: 'refTo',
      label: '参照路径'
    },
    {
      type: 'switch-box',
      field: 'disabled',
      label: '不可用'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    },
    {
      field: 'name',
      label: '域名称'
    },
    {
      label: '检索地址',
      field: 'sugguest'
    },
    {
      type: 'input.number',
      field: 'multipleLimit',
      label: '多选数量'
    },
    {
      label: '值绑定',
      field: 'vModel',
      tag: 'self'
    },
    {
      label: '值',
      field: 'value',
      tag: 'self'
    },
    {
      label: '显示绑定',
      field: 'showLabel.sync',
      tag: 'self'
    },
    {
      label: '显示值',
      field: 'showLabel',
      tag: 'self'
    },
    {
      field: 'size',
      label: '大小',
      tag: 'self'
    },
    {
      field: 'readFields',
      label: '引用字段列表',
      tag: 'form'
    },
    {
      field: 'writeFields',
      label: '结果字段列表',
      tag: 'form'
    }
  ],
  date: [
    {
      field: 'field',
      label: '字段',
      tag: 'form'
    },
    {
      type: 'combo',
      field: 'type',
      label: '日期类型',
      ':options': [
        {
          value: 'date',
          label: '日期'
        },
        {
          value: 'datetime',
          label: '日期时间'
        },
        {
          value: 'time',
          label: '时间'
        }
      ]
    },
    {
      field: 'placeholder',
      label: '提示信息'
    },
    {
      field: 'format',
      label: '显示格式'
    },
    {
      field: 'valueFormat',
      label: '值格式'
    },
    {
      field: 'size',
      label: '大小',
      tag: 'self'
    },
    {
      field: 'vModel',
      label: '值绑定',
      tag: 'self'
    },
    {
      type: 'switch-box',
      field: 'readonly',
      label: '只读'
    },
    {
      label: '值',
      field: 'value',
      tag: 'self'
    },
    {
      type: 'switch-box',
      field: 'disabled',
      label: '不可用'
    },
    {
      type: 'switch-box',
      label: '忽略',
      field: 'ignore',
      tag: 'form'
    }
  ],
  'el-pagination': [
    {
      type: 'tags',
      field: ':pageSizes',
      label: '分页大小列表'
    },
    {
      type: 'input.number',
      field: 'pageSize',
      label: '分页大小'
    },
    {
      field: ':total',
      label: '记录总数属性'
    },
    {
      field: ':currentPage',
      label: '当前页面属性'
    },
    {
      field: ':layout',
      label: '布局'
    }
  ],
  pagination: [
    {
      field: ':model',
      label: '记录总数属性'
    },
    {
      type: 'tags',
      field: 'pageSizes',
      label: '分页大小列表'
    },
    {
      type: 'input.number',
      field: 'pageSize',
      label: '分页大小'
    },
    {
      field: ':layout',
      label: '布局'
    }
  ],
  'fac-form': facFormConfig,
  'simple-table': facTableConfig,
  'fac-table': facTableConfig,
  'box-list': [
    {
      field: 'label',
      label: '显示字段'
    },
    {
      type: 'combo',
      field: 'cols',
      ':options': [{value: 3, label: '三列'}, {value: 4, label: '四列'}, {value: 5, label: '五列'}, {value: 6, label: '六列'},{value: 7, label: '七列'}, {value: 8, label: '八列'}],
      label: '显示列数'
    },
    {
      field: 'icon',
      label: '显示图标字段'
    },
    {
      field: 'image',
      label: '显示图片字段'
    },
    {
      field: 'previewImage',
      label: '预览图片字段'
    }
  ],
  search: [
    {
      field: 'placeholder',
      label: '提示信息'
    },
    {
      type: 'tags',
      field: 'items',
      single: true,
      label: '检索项目'
    },
    {
      type: 'switch-box',
      field: 'free',
      label: '自由查询'
    },
    {
      field: 'advance',
      label: '高级查询组件'
    }
  ],
  xquery: facXqueryConfig,
  tree: [
    {
      field: 'nodeKey',
      label: '节点键值'
    },
    {
      type: 'textarea',
      field: 'label',
      label: '显示内容'
    },
    {
      type: 'switch-box',
      field: 'highlightCurrent',
      label: '高亮当前节点'
    },
    {
      type: 'switch-box',
      field: 'expandOnClickNode',
      label: '点击节点展开'
    },
    {
      type: 'switch-box',
      field: 'autoExpandParent',
      label: '自动展开父节点'
    },
    {
      type: 'switch-box',
      field: 'showCheckbox',
      label: '自动展开父节点'
    },
    {
      field: 'defaultExpandedKeys',
      label: '默认展开键值列表'
    },
    {
      field: ':iconClass',
      label: '图标'
    }
  ],
  'simple-tree': [
    {
      field: 'url',
      label: '加载地址'
    },
    {
      field: 'label',
      label: '显示字段'
    },
    {
      field: 'icon',
      label: '图标'
    },
    {
      field: 'search',
      label: '查找地址'
    },
    {
      field: 'rootName',
      label: '根节点名称'
    },
    {
      field: 'isLeaf',
      label: '叶子节点标志'
    },
    {
      field: 'keyword',
      label: '检索条件'
    },
    {
      type: 'switch-box',
      field: 'lazy',
      label: '是否懒加载'
    }
  ]
}

/**
 * 可以用于表单的空间列表
 * @type {{value: string, label: string}[]}
 */
const formCtls = [
  {
    value: 'input',
    label: '文本'
  },
  {
    value: 'input.number',
    label: '数字'
  },
  {
    value: 'password',
    label: '密码'
  },
  {
    value: 'textarea',
    label: '大文本'
  },
  {
    value: 'comtext',
    label: '选项文本'
  },
  {
    value: 'span',
    label: '显示文本'
  },
  {
    value: 'switch-box',
    label: '开关'
  },
  {
    value: 'combo',
    label: '下拉选择'
  },
  {
    value: 'reference',
    label: '参照'
  },
  {
    value: 'date',
    label: '日期'
  }
]
/**
 * 配置注册信息
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/1/18
 */
export default {
  confetas,
  formCtls
}
