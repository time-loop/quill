import Quill from '../../core/quill';
import { css } from './utils';
import Dropdown from './clickup-table-column-dropdown';
import TableTooltip from './clickup-table-tooltip';

const COL_TOOL_HEIGHT = 32;
const COL_TOOL_ADD_BUTTON_HEIGHT = 20;
const CELL_MIN_WIDTH = 100;
const PRIMARY_COLOR = '#35A7ED';
const COL_TOOL_CELL_HEIGHT = 12;

export default class TableColumnControl {
  constructor(table, quill, options) {
    if (!table) return null;
    this.table = table;
    this.quill = quill;
    this.options = options.tableTools || {};
    this.domNode = null;
    this.activeDropdown = null;
    this.helpRect = null;
    this.activeCell = null;
    this.helpLine = null;
    this.tooltip = new TableTooltip(quill, {
      zIndex: this.options.zIndex,
      content: 'Add column',
    });

    this.initColTool();
  }

  initColTool() {
    const parent = this.quill.root.parentNode;
    const tableView = this.table.parentNode;
    const tableRect = this.table.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = tableView.getBoundingClientRect();

    this.domNode = document.createElement('div');
    this.domNode.classList.add('cu-col-tool');
    this.updateToolCells();
    parent.appendChild(this.domNode);
    css(this.domNode, {
      width: `${tableViewRect.width}px`,
      height: `${COL_TOOL_HEIGHT}px`,
      left: `${tableViewRect.left - containerRect.left + parent.scrollLeft}px`,
      top: `${tableViewRect.top -
        containerRect.top +
        parent.scrollTop -
        COL_TOOL_HEIGHT}px`,
      zIndex: `${this.options.zIndex || 100}`,
    });
    this.domNode.scrollLeft = tableView.scrollLeft;
  }

  createToolCell() {
    const toolCell = document.createElement('div');
    toolCell.classList.add('cu-col-tool-cell');
    css(toolCell, {
      height: `${COL_TOOL_CELL_HEIGHT}px`,
    });

    const resizeHolder = document.createElement('div');
    resizeHolder.classList.add('cu-col-tool-cell-holder');
    toolCell.appendChild(resizeHolder);

    const insertColumnRightButton = document.createElement('div');
    insertColumnRightButton.classList.add('cu-col-tool-cell-add-col-right');
    insertColumnRightButton.innerHTML = '+';
    toolCell.appendChild(insertColumnRightButton);

    const insertColumnLeftButton = document.createElement('div');
    insertColumnLeftButton.classList.add('cu-col-tool-cell-add-col-left');
    insertColumnLeftButton.innerHTML = '+';
    toolCell.appendChild(insertColumnLeftButton);

    const dropdownIcon = document.createElement('div');
    dropdownIcon.classList.add('cu-col-tool-cell-dropdown-icon');
    new Array(3).fill(0).forEach(() => {
      const dot = document.createElement('span');
      dot.classList.add('cu-col-tool-cell-dropdown-icon-dot');
      dropdownIcon.appendChild(dot);
    });
    toolCell.appendChild(dropdownIcon);

    return toolCell;
  }

  updateToolCells() {
    const tableContainer = Quill.find(this.table);
    if (!tableContainer || !tableContainer.colGroup()) {
      const tableModule = this.quill.getModule('table');
      tableModule.hideTableTools();
      return false;
    }

    const tableCols = tableContainer.colGroup().children;
    const cellsNumber = tableCols.length;
    let existCells = Array.from(
      this.domNode.querySelectorAll('.cu-col-tool-cell'),
    );

    for (
      let index = 0;
      index < Math.max(cellsNumber, existCells.length);
      index++
    ) {
      let col = tableCols.at(index);
      let colWidth =
        col && parseInt(col.formats()[col.statics.blotName].width, 10);
      // if cell already exist
      let toolCell = null;
      if (!existCells[index]) {
        toolCell = this.createToolCell();
        this.domNode.appendChild(toolCell);
        this.addColCellHolderHandler(toolCell);
        this.addInertColumnButtonHanler(toolCell);
        this.addDropdownIconHandler(toolCell);
        // set tool cell min-width
        css(toolCell, {
          'min-width': `${colWidth}px`,
        });
      } else if (existCells[index] && index >= cellsNumber) {
        existCells[index].remove();
      } else {
        toolCell = existCells[index];
        // set tool cell min-width
        css(toolCell, {
          'min-width': `${colWidth}px`,
        });
      }
    }
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

  addDropdownIconHandler(cell) {
    const $dropdownIcon = cell.querySelector('.cu-col-tool-cell-dropdown-icon');
    const index = [].indexOf.call(this.domNode.childNodes, cell);

    $dropdownIcon.addEventListener(
      'click',
      e => {
        e.stopPropagation();
        const tableModule = this.quill.getModule('table');
        tableModule.closeToolsDropdown();
        this.activeDropdown = new Dropdown(this, cell, index, this.options);
        this.setCellToActive(cell);
      },
      false,
    );
  }

  setCellToActive(cell) {
    cell.classList.add('active');
    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const tableViewRect = this.table.parentNode.getBoundingClientRect();
    this.helpRect = document.createElement('div');
    this.helpRect.classList.add('cu-help-rect');
    css(this.helpRect, {
      position: 'absolute',
      width: `${cellRect.width}px`,
      height: `${tableViewRect.height}px`,
      left: `${cellRect.left - containerRect.left + parent.scrollLeft - 1}px`,
      top: `${cellRect.top -
        containerRect.top +
        parent.scrollTop +
        cellRect.height}px`,
      zIndex: `${this.options.zIndex || 100}`,
    });
    this.activeCell = cell;
    parent.appendChild(this.helpRect);
  }

  setCellToInActive(cell) {
    cell.classList.remove('active');
    this.helpRect && this.helpRect.remove();
    this.helpRect = null;
    this.activeCell = null;
  }

  addInertColumnButtonHanler(cell) {
    const parent = this.quill.root.parentNode;
    const tableContainer = Quill.find(this.table);
    const $buttonRight = cell.querySelector('.cu-col-tool-cell-add-col-right');
    const $buttonLeft = cell.querySelector('.cu-col-tool-cell-add-col-left');
    // helpline relative vars
    let containerRect;
    let tableRect;
    let tableViewRect;
    let cellRect;

    $buttonLeft.addEventListener(
      'click',
      () => {
        const index = [].indexOf.call(this.domNode.childNodes, cell);
        tableContainer.insertColumn(index, false);
        this.updateToolCells();
      },
      false,
    );

    $buttonLeft.addEventListener(
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

        this.helpLine = document.createElement('div');
        this.helpLine.classList.add('cu-help-line');
        this.helpLine.classList.add('cu-help-line-col');
        css(this.helpLine, {
          left: `${cellRect.left -
            containerRect.left +
            parent.scrollLeft -
            1}px`,
          top: `${cellRect.top - containerRect.top + parent.scrollTop}px`,
          zIndex: `${this.options.zIndex || 100}`,
          height: `${tableViewRect.height +
            COL_TOOL_HEIGHT -
            COL_TOOL_ADD_BUTTON_HEIGHT}px`,
          width: '2px',
          backgroundColor: PRIMARY_COLOR,
        });
        parent.appendChild(this.helpLine);
      },
      false,
    );

    $buttonLeft.addEventListener('mouseout', () => {
      if (this.helpLine) {
        this.helpLine.remove();
        this.helpLine = null;
      }

      if (this.tooltip) {
        this.tooltip.hide();
      }
    });

    $buttonRight.addEventListener(
      'click',
      () => {
        const index = [].indexOf.call(this.domNode.childNodes, cell);
        tableContainer.insertColumn(index, true);
        this.updateToolCells();
      },
      false,
    );

    $buttonRight.addEventListener(
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

        this.helpLine = document.createElement('div');
        this.helpLine.classList.add('cu-help-line');
        this.helpLine.classList.add('cu-help-line-col');
        css(this.helpLine, {
          left: `${cellRect.left +
            cellRect.width -
            containerRect.left +
            parent.scrollLeft -
            2}px`,
          top: `${cellRect.top - containerRect.top + parent.scrollTop}px`,
          zIndex: `${this.options.zIndex || 100}`,
          height: `${tableViewRect.height +
            COL_TOOL_HEIGHT -
            COL_TOOL_ADD_BUTTON_HEIGHT}px`,
          width: '2px',
          backgroundColor: PRIMARY_COLOR,
        });
        parent.appendChild(this.helpLine);
      },
      false,
    );

    $buttonRight.addEventListener('mouseout', () => {
      if (this.helpLine) {
        this.helpLine.remove();
        this.helpLine = null;
      }

      if (this.tooltip) {
        this.tooltip.hide();
      }
    });
  }

  addColCellHolderHandler(cell) {
    const tableContainer = Quill.find(this.table);
    const $holder = cell.querySelector('.cu-col-tool-cell-holder');
    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    let dragging = false;
    let x0 = 0;
    let x = 0;
    let delta = 0;
    let width0 = 0;
    // helpLine relation varrible
    let tableViewRect = {};
    let tableRect = {};
    let cellRect = {};
    let $helpLine = null;

    const handleDrag = e => {
      e.stopPropagation();

      if (dragging) {
        x = e.clientX;

        if (width0 + x - x0 >= CELL_MIN_WIDTH) {
          delta = x - x0;
        } else {
          delta = CELL_MIN_WIDTH - width0;
        }

        css($helpLine, {
          left: `${cellRect.left +
            cellRect.width -
            containerRect.left +
            parent.scrollLeft -
            2 +
            delta}px`,
        });
      }
    };

    const handleMouseup = e => {
      e.preventDefault();
      e.stopPropagation();

      const existCells = Array.from(
        this.domNode.querySelectorAll('.cu-col-tool-cell'),
      );
      const colIndex = existCells.indexOf(cell);
      const colBlot = tableContainer.colGroup().children.at(colIndex);

      if (dragging) {
        colBlot.format('width', width0 + delta);
        css(cell, { 'min-width': `${width0 + delta}px` });

        x0 = 0;
        x = 0;
        delta = 0;
        width0 = 0;
        dragging = false;
        $holder.classList.remove('dragging');
      }

      document.body.removeEventListener('mousemove', handleDrag);
      document.body.removeEventListener('mouseup', handleMouseup);
      tableRect = {};
      cellRect = {};
      $helpLine.remove();
      $helpLine = null;
      tableContainer.updateTableWidth();
    };

    const handleMousedown = e => {
      e.preventDefault();
      e.stopPropagation();

      document.body.addEventListener('mousemove', handleDrag);
      document.body.addEventListener('mouseup', handleMouseup);

      tableRect = this.table.getBoundingClientRect();
      tableViewRect = this.table.parentNode.getBoundingClientRect();
      cellRect = cell.getBoundingClientRect();

      $helpLine = document.createElement('div');
      $helpLine.classList.add('cu-help-line');
      $helpLine.classList.add('cu-help-line-col');
      css($helpLine, {
        left: `${cellRect.left +
          cellRect.width -
          containerRect.left +
          parent.scrollLeft -
          1}px`,
        top: `${cellRect.top - containerRect.top + parent.scrollTop}px`,
        zIndex: `${this.options.zIndex || 100}`,
        height: `${tableViewRect.height +
          COL_TOOL_HEIGHT -
          COL_TOOL_ADD_BUTTON_HEIGHT}px`,
        width: '1px',
        backgroundColor: PRIMARY_COLOR,
      });

      parent.appendChild($helpLine);
      dragging = true;
      x0 = e.clientX;
      width0 = cellRect.width;
      $holder.classList.add('dragging');
    };
    $holder.addEventListener('mousedown', handleMousedown);
  }

  reposition() {
    if (
      !this.quill ||
      !this.quill.root ||
      !this.table ||
      !this.table.parentNode
    )
      return false;

    const parent = this.quill.root.parentNode;
    const tableView = this.table.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const tableViewRect = tableView.getBoundingClientRect();

    // table col tool
    css(this.domNode, {
      width: `${tableViewRect.width}px`,
      height: `${COL_TOOL_HEIGHT}px`,
      left: `${tableViewRect.left - containerRect.left + parent.scrollLeft}px`,
      top: `${tableViewRect.top -
        containerRect.top +
        parent.scrollTop -
        COL_TOOL_HEIGHT}px`,
    });
    this.domNode.scrollLeft = tableView.scrollLeft;

    // helpRect
    if (this.activeCell && this.helpRect) {
      const cellRect = this.activeCell.getBoundingClientRect();

      css(this.helpRect, {
        left: `${cellRect.left - containerRect.left + parent.scrollLeft - 1}px`,
        top: `${cellRect.top -
          containerRect.top +
          parent.scrollTop +
          cellRect.height}px`,
      });
    }

    // dropdown
    if (this.activeDropdown) {
      this.activeDropdown.reposition();
    }
  }

  colToolCells() {
    return Array.from(this.domNode.querySelectorAll('.cu-col-tool-cell'));
  }
}
