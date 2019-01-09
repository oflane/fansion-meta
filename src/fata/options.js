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
    label: '大小',
    field: 'size',
    tag: 'self'
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
      field: 'field',
      label: '字段',
      tag: 'form'
    },
    {
      field: 'vText',
      label: '值绑定',
      tag: 'self'
    }
  ],
  'switch-box': {
    tagName: 'el-switch',
    props: ['ref', 'vModel', 'activeText', 'inactiveText', 'activeValue', 'inactiveValue', 'activeColor', 'inactiveColor'],
    default: {
      ':activeValue': true,
      ':inactiveValue': false,
      activeColor: '#13ce66',
      inactiveColor: '#ff4949'
    }
  },
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
      label: '显示绑定',
      field: 'label.sync',
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
      type: 'switch-box',
      field: 'readonly',
      label: '只读'
    },
    {
      field: 'vModel',
      label: '值绑定',
      tag: 'self'
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
  search: [
    {
      field: 'placeholder',
      label: '提示信息'
    },
    {
      type: 'tags',
      field: 'items',
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
  ]
}

/**
 * 可以用于表单的空间列表
 * @type {{value: string, label: string}[]}
 */
const formControls = [
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
 * 添加注释
 * @author Paul.Yang E-mail:yaboocn@qq.com
 * @version 1.0 2011/1/18
 */
export default {
  confetas,
  formControls
}
