/**
 * 本文件封装tui.editor的Viewer（参考：https://zhuanlan.zhihu.com/p/144716052）
 */
import React from 'react'
import { Viewer as TuiViewer } from '@toast-ui/react-editor'
// 引入插件
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import uml from '@toast-ui/editor-plugin-uml'
import hljs from 'highlight.js'
// 引入样式
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import 'highlight.js/styles/github.css'
// 可选：从 highlight.js 中挑选一些常见语法进行支持
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cmake from 'highlight.js/lib/languages/cmake'
import java from 'highlight.js/lib/languages/java'
import json from 'highlight.js/lib/languages/json'
import less from 'highlight.js/lib/languages/less'
import css from 'highlight.js/lib/languages/css'
import php from 'highlight.js/lib/languages/php'
import go from 'highlight.js/lib/languages/go'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cmake', cmake)
hljs.registerLanguage('json', json)
hljs.registerLanguage('css', css)
hljs.registerLanguage('less', less)
hljs.registerLanguage('php', php)
hljs.registerLanguage('go', go)

const plugins = [
  [codeSyntaxHighlight, { hljs }],
  tableMergedCell,
  [
    colorSyntax,
    {
      preset: [
        '#1abc9c',
        '#2ecc71',
        '#3498db',
        '#9b59b6',
        '#34495e',
        '#f1c40f',
        '#e67e22',
        '#e74c3c',
        '#ecf0f1',
        '#95a5a6',
      ],
    },
  ],
  uml,
]

export default React.forwardRef((props, ref) => (
  <TuiViewer minHeight="900px" plugins={plugins} {...props} ref={ref} />
))