import { css } from './utils';
import IconManager from './clickup-icon-manager';
import Dropdown from './clickup-table-table-dropdown';

export const TableToolSize = 12;

export default class TableTableControl {
  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options.tableTools || {};
    this.domNode = null;
    this.activeDropdown = null;
    this.helpRect = null;
    this.iconManager = new IconManager();

    this.initTableTool();
  }

  initTableTool() {
    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();

    this.domNode = document.createElement('div');
    this.domNode.classList.add('cu-table-tool');
    parent.appendChild(this.domNode);
    css(this.domNode, {
      width: `${TableToolSize}px`,
      height: `${TableToolSize}px`,
      left: `${tableViewRect.left -
        containerRect.left +
        parent.scrollLeft -
        TableToolSize}px`,
      top: `${tableViewRect.top -
        containerRect.top -
        TableToolSize +
        parent.scrollTop}px`,
      zIndex: `${this.options.zIndex || 100}`,
    });

    this.domNode.addEventListener(
      'click',
      () => {
        const tableModule = this.quill.getModule('table');
        tableModule.closeToolsDropdown();

        this.activeDropdown = new Dropdown(this);
        this.setCellToActive();
      },
      false,
    );
  }

  setCellToActive() {
    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();
    const tableRect = this.table.getBoundingClientRect();

    this.domNode.classList.add('active');
    this.helpRect = document.createElement('div');
    this.helpRect.classList.add('cu-help-rect');
    css(this.helpRect, {
      position: 'absolute',
      width: `${Math.min(tableRect.width, tableViewRect.width)}px`,
      height: `${tableViewRect.height}px`,
      left: `${tableViewRect.left - containerRect.left + parent.scrollLeft}px`,
      top: `${tableViewRect.top - containerRect.top + parent.scrollTop}px`,
      zIndex: `${this.options.zIndex || 100}`,
    });
    parent.appendChild(this.helpRect);
  }

  setCellToInActive() {
    this.domNode.classList.remove('active');
    if (this.helpRect) {
      this.helpRect.remove();
    }
    this.helpRect = null;
  }

  destroy() {
    this.domNode.remove();
    return null;
  }

  reposition() {
    if (!this.quill || !this.quill.root || !this.table) return;
    // table table tool
    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();
    css(this.domNode, {
      left: `${tableViewRect.left -
        containerRect.left +
        parent.scrollLeft -
        TableToolSize}px`,
      top: `${tableViewRect.top -
        containerRect.top -
        TableToolSize +
        parent.scrollTop}px`,
    });

    // helpRect
    if (this.helpRect) {
      css(this.helpRect, {
        left: `${tableViewRect.left -
          containerRect.left +
          parent.scrollLeft}px`,
        top: `${tableViewRect.top - containerRect.top + parent.scrollTop}px`,
      });
    }

    // dropdown
    if (this.activeDropdown) {
      this.activeDropdown.reposition();
    }
  }
}
