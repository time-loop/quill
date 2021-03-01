import Quill from '../../core/quill';
import { css } from './utils';
import { TableBody } from '../clickup-table/formats';
import IconManager from './clickup-icon-manager';
import TableTooltip from './clickup-table-tooltip';

const ROW_TOOL_WIDTH = 32;
const ROW_TOOL_CELL_WIDTH = 12;
const PRIMARY_COLOR = '#35A7ED';

export default class TableRowControl {
  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options.tableTools || {};
    this.domNode = null;
    this.iconManager = new IconManager();
    this.helpLine = null;
    this.tooltip = new TableTooltip(quill, {
      zIndex: this.options.zIndex,
      content: 'Add new row',
    });

    this.initRowTool();
  }

  initRowTool() {
    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();

    this.domNode = document.createElement('div');
    this.domNode.classList.add('cu-row-tool');
    this.updateToolCells();
    parent.appendChild(this.domNode);
    css(this.domNode, {
      width: `${ROW_TOOL_WIDTH}px`,
      height: `${tableViewRect.height}px`,
      left: `${tableViewRect.left -
        containerRect.left +
        parent.scrollLeft -
        ROW_TOOL_WIDTH}px`,
      top: `${tableViewRect.top - containerRect.top + parent.scrollTop + 1}px`,
      zIndex: `${this.options.zIndex || 100}`,
    });
  }

  createToolCell() {
    const toolCell = document.createElement('div');
    toolCell.classList.add('cu-row-tool-cell');
    css(toolCell, {
      width: `${ROW_TOOL_CELL_WIDTH}px`,
    });

    const insertRowTopButton = document.createElement('div');
    insertRowTopButton.classList.add('cu-row-tool-cell-add-row-top');
    insertRowTopButton.innerHTML = '+';
    toolCell.appendChild(insertRowTopButton);

    const insertRowBottomButton = document.createElement('div');
    insertRowBottomButton.classList.add('cu-row-tool-cell-add-row-bottom');
    insertRowBottomButton.innerHTML = '+';
    toolCell.appendChild(insertRowBottomButton);

    const deleteRowButton = document.createElement('div');
    deleteRowButton.classList.add('cu-row-tool-cell-delete-row');
    deleteRowButton.innerHTML = this.iconManager.getSvgIcon('deleteSmall');
    toolCell.appendChild(deleteRowButton);

    // const dropdownIcon = document.createElement('div')
    // dropdownIcon.classList.add('cu-row-tool-cell-dropdown-icon')
    // new Array(3).fill(0).forEach(() => {
    //   const dot = document.createElement('span')
    //   dot.classList.add('cu-row-tool-cell-dropdown-icon-dot')
    //   dropdownIcon.appendChild(dot)
    // })
    // toolCell.appendChild(dropdownIcon)

    return toolCell;
  }

  updateToolCells() {
    const tableContainer = Quill.find(this.table);
    if (!tableContainer) {
      const tableModule = this.quill.getModule('table');
      tableModule.hideTableTools();
      return;
    }

    const [tableBody] = tableContainer.descendants(TableBody);
    const tableRows = tableBody.children;
    const cellsNumber = tableRows.length;
    const existCells = Array.from(
      this.domNode.querySelectorAll('.cu-row-tool-cell'),
    );

    for (
      let index = 0;
      index < Math.max(cellsNumber, existCells.length);
      index += 1
    ) {
      let row;
      let rowHeight;
      // if cell already exist
      let toolCell = null;
      if (!existCells[index]) {
        row = tableRows.at(index);
        rowHeight = row.domNode.getBoundingClientRect().height;
        toolCell = this.createToolCell();
        this.domNode.appendChild(toolCell);
        this.addInertRowButtonHanler(toolCell);
        this.addDeleteRowButtonHanler(toolCell);
        // set tool cell min-height
        css(toolCell, {
          'min-height': `${rowHeight}px`,
        });
      } else if (existCells[index] && index >= cellsNumber) {
        existCells[index].remove();
      } else {
        toolCell = existCells[index];
        row = tableRows.at(index);
        rowHeight = row.domNode.getBoundingClientRect().height;
        // set tool cell min-height
        css(toolCell, {
          'min-height': `${rowHeight}px`,
        });
      }
    }

    css(this.domNode, {
      height: `${this.table.parentNode.getBoundingClientRect().height}px`,
    });
  }

  destroy() {
    if (this.helpLine) {
      this.helpLine.remove();
      this.helpLine = null;
    }

    if (this.tooltip) {
      this.tooltip.hide();
      this.tooltip = null;
    }
    this.domNode.remove();
    return null;
  }

  addDeleteRowButtonHanler(cell) {
    const tableContainer = Quill.find(this.table);
    const $buttonDel = cell.querySelector('.cu-row-tool-cell-delete-row');
    const [tableBody] = tableContainer.descendants(TableBody);
    const tableModule = this.quill.getModule('table');
    $buttonDel.addEventListener(
      'click',
      () => {
        const index = [].indexOf.call(this.domNode.childNodes, cell);

        if (tableBody.children.length === 1) {
          tableContainer.remove();
          tableModule.hideTableTools();
        } else {
          tableContainer.deleteRow(index);
          this.updateToolCells();
        }
      },
      false,
    );

    $buttonDel.addEventListener(
      'mouseover',
      e => {
        this.tooltip.show(e.currentTarget, 'Delete row');
      },
      false,
    );

    $buttonDel.addEventListener('mouseout', () => {
      if (this.tooltip) {
        this.tooltip.hide();
      }
    });
  }

  addInertRowButtonHanler(cell) {
    const parent = this.quill.root.parentNode;
    const tableContainer = Quill.find(this.table);
    const $buttonTop = cell.querySelector('.cu-row-tool-cell-add-row-top');
    const $buttonBottom = cell.querySelector(
      '.cu-row-tool-cell-add-row-bottom',
    );
    // helpline relative vars
    let containerRect;
    let tableRect;
    let tableViewRect;
    let cellRect;

    $buttonTop.addEventListener(
      'click',
      () => {
        const index = [].indexOf.call(this.domNode.childNodes, cell);
        tableContainer.insertRow(index, false);
        this.updateToolCells();
      },
      false,
    );

    $buttonTop.addEventListener(
      'mouseover',
      e => {
        this.tooltip.show(e.target);

        containerRect = parent.getBoundingClientRect();
        tableRect = this.table.getBoundingClientRect();
        tableViewRect = this.table.parentNode.getBoundingClientRect();
        cellRect = cell.getBoundingClientRect();

        if (this.helpLine) {
          this.helpLine.remove();
          this.helpLine = null;
        }

        this.helpLine = this.quill.addContainer('cu-help-line');
        this.helpLine.classList.add('cu-help-line-row');
        css(this.helpLine, {
          position: 'absolute',
          left: `${cellRect.left -
            containerRect.left +
            parent.scrollLeft -
            1}px`,
          top: `${cellRect.top - containerRect.top + parent.scrollTop - 1}px`,
          zIndex: `${this.options.zIndex || 100}`,
          width: `${Math.min(
            tableViewRect.width + ROW_TOOL_CELL_WIDTH,
            tableRect.width + ROW_TOOL_CELL_WIDTH,
          ) - 1}px`,
          height: '2px',
          backgroundColor: PRIMARY_COLOR,
        });
      },
      false,
    );

    $buttonTop.addEventListener('mouseout', () => {
      if (this.helpLine) {
        this.helpLine.remove();
        this.helpLine = null;
      }

      if (this.tooltip) {
        this.tooltip.hide();
      }
    });

    $buttonBottom.addEventListener(
      'click',
      () => {
        const index = [].indexOf.call(this.domNode.childNodes, cell);
        tableContainer.insertRow(index, true);
        this.updateToolCells();
      },
      false,
    );

    $buttonBottom.addEventListener(
      'mouseover',
      e => {
        this.tooltip.show(e.target);

        containerRect = parent.getBoundingClientRect();
        tableRect = this.table.getBoundingClientRect();
        tableViewRect = this.table.parentNode.getBoundingClientRect();
        cellRect = cell.getBoundingClientRect();

        if (this.helpLine) {
          this.helpLine.remove();
          this.helpLine = null;
        }

        this.helpLine = this.quill.addContainer('cu-help-line');
        this.helpLine.classList.add('cu-help-line-row');
        css(this.helpLine, {
          position: 'absolute',
          left: `${cellRect.left -
            containerRect.left +
            parent.scrollLeft -
            1}px`,
          top: `${cellRect.top -
            containerRect.top +
            parent.scrollTop -
            1 +
            cellRect.height}px`,
          zIndex: `${this.options.zIndex || 100}`,
          width: `${Math.min(
            tableViewRect.width + ROW_TOOL_CELL_WIDTH,
            tableRect.width + ROW_TOOL_CELL_WIDTH,
          ) - 1}px`,
          height: '2px',
          backgroundColor: PRIMARY_COLOR,
        });
      },
      false,
    );

    $buttonBottom.addEventListener('mouseout', () => {
      if (this.helpLine) {
        this.helpLine.remove();
        this.helpLine = null;
      }

      if (this.tooltip) {
        this.tooltip.hide();
      }
    });
  }

  reposition() {
    if (!this.quill || !this.quill.root || !this.table) return;

    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();

    css(this.domNode, {
      left: `${tableViewRect.left -
        containerRect.left +
        parent.scrollLeft -
        ROW_TOOL_WIDTH}px`,
      top: `${tableViewRect.top - containerRect.top + parent.scrollTop + 1}px`,
    });
  }
}
