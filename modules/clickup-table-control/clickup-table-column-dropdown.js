import Quill from '../../core/quill';
import { css } from './utils'
import IconManager from './clickup-icon-manager'

export default class TableColumnDropdown {
  constructor(tool, toolCell, colIndex) {
    this.tool = tool
    this.table = tool.table
    this.quill = tool.quill
    this.toolCell = toolCell
    this.colIndex = colIndex
    this.options = tool.options || {}
    this.domNode = null
    this.iconManager = new IconManager()

    this.initDropdown()

    this.destroyHandler = this.destroy.bind(this)
    setTimeout(() => {
      document.body.addEventListener('click', this.destroyHandler, false)
    }, 0)
  }

  initDropdown() {
    const parent = this.quill.root.parentNode
    const containerRect = parent.getBoundingClientRect()
    this.domNode = document.createElement('div')
    this.domNode.classList.add('cu-col-tool-dropdown')

    let item, $dropdownItem, $dropdownItemIcon, $dropdownItemText
    Object.keys(TableColumnDropdown.defaults).forEach(key => {
      item = TableColumnDropdown.defaults[key]
      $dropdownItem = document.createElement('div')
      $dropdownItem.classList.add('cu-col-tool-dropdown-item')
      $dropdownItemIcon = document.createElement('span')
      $dropdownItemIcon.classList.add('cu-col-tool-dropdown-item-icon')
      $dropdownItemIcon.innerHTML = this.iconManager.getSvgIcon(key)
      $dropdownItemText = document.createElement('span')
      $dropdownItemText.classList.add('cu-col-tool-dropdpwn-item-text')
      $dropdownItemText.innerText = item.text
      $dropdownItem.addEventListener('click', item.handler.bind(this), false)

      $dropdownItem.appendChild($dropdownItemIcon)
      $dropdownItem.appendChild($dropdownItemText)
      this.domNode.appendChild($dropdownItem)
    })

    const cellRect = this.toolCell.getBoundingClientRect()
    css(this.domNode, {
      position: 'absolute',
      left: `${cellRect.left - containerRect.left + parent.scrollLeft + cellRect.width / 2}px`,
      top: `${cellRect.top - containerRect.top + parent.scrollTop + cellRect.height}px`,
      zIndex: `${(this.options.zIndex + 1) || 101}`
    })
    parent.appendChild(this.domNode)
  }

  reposition() {
    if (!this.quill || !this.quill.root || !this.toolCell) return false

    const parent = this.quill.root.parentNode
    const containerRect = parent.getBoundingClientRect()
    const cellRect = this.toolCell.getBoundingClientRect()
    css(this.domNode, {
      left: `${cellRect.left - containerRect.left + parent.scrollLeft + cellRect.width / 2}px`,
      top: `${cellRect.top - containerRect.top + parent.scrollTop + cellRect.height}px`,
    })
  }

  destroy() {
    this.tool.setCellToInActive(this.toolCell)
    document.body.removeEventListener('click', this.destroyHandler, false)
    this.domNode.remove()
  }
}

TableColumnDropdown.defaults = {
  'insertColumnLeft': {
    text: 'Insert Column Left',
    handler(e) {
      e.stopPropagation()
      const tableContainer = Quill.find(this.table)
      tableContainer.insertColumn(this.colIndex, false)
      this.tool.updateToolCells()
      this.destroy()
    }
  },
  'insertColumnRight': {
    text: 'Insert Column Right',
    handler(e) {
      e.stopPropagation()
      const tableContainer = Quill.find(this.table)
      tableContainer.insertColumn(this.colIndex, true)
      this.tool.updateToolCells()
      this.destroy()
    }
  },
  'deleteColumn': {
    text: 'Delete This Column',
    handler(e) {
      e.stopPropagation()
      const tableModule = this.quill.getModule('table')
      const tableContainer = Quill.find(this.table)
      this.destroy()
      if (tableContainer.colGroup().children.length === 1) {
        tableModule.hideTableTools()
        tableContainer.deleteColumn(this.colIndex)
      } else {
        tableContainer.deleteColumn(this.colIndex)
        this.tool.updateToolCells()
      }
    }
  }
}
