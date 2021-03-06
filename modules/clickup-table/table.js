import Delta from 'quill-delta';
import Quill from '../../core/quill';
import Module from '../../core/module';
import {
  TableCol,
  TableColGroup,
  TableCellLine,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableView,
  ListItem,
  ListBlockWrapper,
  ListContainer,
  rowId,
  cellId,
} from './formats';

import { matchTableCell, matchTableHeader, matchTable } from './node-matchers';

import { getEventComposedPath } from '../clickup-table-control/utils';
import TableColumnTool from '../clickup-table-control/clickup-table-column-tool';
import TableRowTool from '../clickup-table-control/clickup-table-row-tool';
import TableTableTool from '../clickup-table-control/clickup-table-table-tool';

class Table extends Module {
  static register() {
    Quill.register(TableCol, true);
    Quill.register(TableColGroup, true);
    Quill.register(TableCellLine, true);
    Quill.register(TableCell, true);
    Quill.register(TableRow, true);
    Quill.register(TableBody, true);
    Quill.register(TableContainer, true);
    Quill.register(TableView, true);
    // List must be registered in TableModule
    // or TDZ references error
    Quill.register(ListItem, true);
    Quill.register(ListBlockWrapper, true);
    Quill.register(ListContainer, true);
  }

  constructor(quill, options) {
    super(quill, options);

    if (options.togglelistPlaceholder) {
      ListItem.DEFAULT_TOGGLE_PLACEHOLDER = options.togglelistPlaceholder;
    }

    if (options.customRowId && typeof options.customRowId === 'function') {
      this.genRowId = rowIndex => {
        return options.customRowId(rowIndex);
      };
    } else {
      this.genRowId = () => {
        return rowId();
      };
    }

    if (options.customCellId && typeof options.customCellId === 'function') {
      this.genCellId = (rowIndex, colIndex) => {
        return options.customCellId(rowIndex, colIndex);
      };
    } else {
      this.genCellId = () => {
        return cellId();
      };
    }

    this.quill.on('text-change', () => {
      if (this.rowTool && this.table) {
        const tableRect = this.rowTool.table.getBoundingClientRect();
        const rowToolRect = this.rowTool.domNode.getBoundingClientRect();
        const delta = tableRect.height - rowToolRect.height;
        if (delta > 4 || delta < -4) {
          window.setTimeout(this.rowTool.updateToolCells(), 0);
        }
      }
    });

    this.quill.on('selection-change', range => {
      if (!range) {
        return true;
      }
      const [curLine] = this.quill.getLine(range.index);
      const lineFomrats = curLine.formats();

      const lines = this.quill.getLines(range);
      if (lines.length === 1) {
        // reset selection to prevent cutting or delete single table cell.
        const theLine = lines[0];
        const theLineFormats = theLine.formats();
        if (
          theLineFormats[theLine.statics.blotName] &&
          theLineFormats[theLine.statics.blotName].cell &&
          range.length === theLine.length()
        ) {
          this.quill.setSelection(
            range.index,
            range.length - 1,
            Quill.sources.SILENT,
          );
        }
      }

      // hide table tools when the cursor go out of the table
      if (
        !(
          lineFomrats &&
          (lineFomrats[TableCellLine.blotName] ||
            (lineFomrats.list && lineFomrats.list.row && lineFomrats.list.cell))
        )
      ) {
        this.hideTableTools();
      }

      // show table tools when the cursor go into the table
      if (
        lineFomrats &&
        (lineFomrats[TableCellLine.blotName] ||
          (lineFomrats.list &&
            lineFomrats.list.row &&
            lineFomrats.list.cell)) &&
        this.columnTool &&
        this.rowTool
      ) {
        let curCell;
        if (curLine.parent && curLine.parent instanceof TableCell) {
          curCell = curLine.parent;
        } else if (
          curLine.parent &&
          curLine.parent.parent instanceof TableCell
        ) {
          curCell = curLine.parent.parent;
        }

        if (!curCell) {
          return false;
        }
        // show table tools' buttons
        const curCellIndex = curCell.cellOffset();
        const curRowIndex = curCell.rowOffset();
        const colToolCells = this.columnTool.domNode.querySelectorAll(
          '.cu-col-tool-cell',
        );
        const rowToolCells = this.rowTool.domNode.querySelectorAll(
          '.cu-row-tool-cell',
        );

        colToolCells.forEach(cell => cell.classList.remove('cell-focused'));
        if (colToolCells[curCellIndex]) {
          colToolCells[curCellIndex].classList.add('cell-focused');
        }
        rowToolCells.forEach(cell => cell.classList.remove('row-focused'));
        if (rowToolCells[curRowIndex]) {
          rowToolCells[curRowIndex].classList.add('row-focused');
        }
      }
      return false;
    });

    this.quill.root.addEventListener(
      'click',
      evt => {
        const path = getEventComposedPath(evt);

        if (!path || path.length <= 0) {
          return;
        }

        const tableNode = path.filter(node => {
          return (
            node.tagName &&
            node.tagName.toUpperCase() === 'TABLE' &&
            node.classList.contains('clickup-table')
          );
        })[0];

        if (tableNode) {
          // current table clicked
          if (this.table === tableNode) {
            return;
          }
          // other table clicked
          if (this.table) this.hideTableTools();
          this.showTableTools(tableNode, quill, options);
        } else if (this.table) {
          // other clicked
          this.hideTableTools();
        }
      },
      false,
    );

    document.body.addEventListener(
      'scroll',
      () => {
        if (this.table) {
          if (this.columnTool) {
            this.columnTool.reposition();
          }
          if (this.rowTool) {
            this.rowTool.reposition();
          }
          if (this.tableTool) {
            this.tableTool.reposition();
          }
        }
      },
      true,
    );

    quill.clipboard.addMatcher('td', matchTableCell);
    quill.clipboard.addMatcher('th', matchTableHeader);
    quill.clipboard.addMatcher('table', matchTable);

    this.listenBalanceCells();
  }

  showTableTools(table, quill, options) {
    this.hideTableTools();
    const dragDropBlocks = this.quill.getModule('dragDropBlocks');
    if (dragDropBlocks) {
      dragDropBlocks.hideDraggableAnchor();
    }

    this.table = table;
    this.columnTool = new TableColumnTool(table, quill, options);
    this.rowTool = new TableRowTool(table, quill, options);
    this.tableTool = new TableTableTool(table, quill, options);

    const range = this.quill.getSelection();
    if (range) {
      const [curLine] = this.quill.getLine(range.index);
      const lineFomrats = curLine.formats();
      if (
        lineFomrats &&
        (lineFomrats[TableCellLine.blotName] ||
          (lineFomrats.list &&
            lineFomrats.list.row &&
            lineFomrats.list.cell)) &&
        this.columnTool &&
        this.rowTool
      ) {
        let curCell;
        if (curLine.parent && curLine.parent instanceof TableCell) {
          curCell = curLine.parent;
        } else if (
          curLine.parent &&
          curLine.parent.parent instanceof TableCell
        ) {
          curCell = curLine.parent.parent;
        }

        if (!curCell) {
          return;
        }
        // show corresponding table tools' buttons
        const curCellIndex = curCell.cellOffset();
        const curRowIndex = curCell.rowOffset();
        const colToolCells = this.columnTool.domNode.querySelectorAll(
          '.cu-col-tool-cell',
        );
        const rowToolCells = this.rowTool.domNode.querySelectorAll(
          '.cu-row-tool-cell',
        );
        colToolCells[curCellIndex].classList.add('cell-focused');
        rowToolCells[curRowIndex].classList.add('row-focused');
      }
    }
  }

  hideTableTools() {
    if (this.columnTool) {
      this.columnTool.destroy();
    }
    if (this.rowTool) {
      this.rowTool.destroy();
    }
    if (this.tableTool) {
      this.tableTool.destroy();
    }
    this.columnTool = null;
    this.rowTool = null;
    this.tableTool = null;
    this.table = null;
  }

  closeToolsDropdown() {
    if (this.columnTool && this.columnTool.activeDropdown) {
      this.columnTool.activeDropdown.destroy();
    }
    if (this.tableTool && this.tableTool.activeDropdown) {
      this.tableTool.activeDropdown.destroy();
    }
  }

  deleteTable() {
    const [table] = this.getTable();
    if (table == null) {
      return;
    }
    const offset = table.offset();
    table.remove();
    this.quill.update(Quill.sources.USER);
    this.quill.setSelection(offset, Quill.sources.SILENT);
  }

  getTable(range = this.quill.getSelection()) {
    if (range == null) {
      return [null, null, null, -1];
    }
    const [cellLine, offset] = this.quill.getLine(range.index);

    if (cellLine == null) {
      return [null, null, null, -1];
    }

    if (
      cellLine.parent &&
      cellLine.parent.statics.blotName === TableCell.blotName
    ) {
      const cell = cellLine.parent;
      const row = cell.parent;
      const table = row.parent.parent;
      return [table, row, cell, offset];
    }
    if (
      cellLine.statics.blotName === ListItem.blotName &&
      cellLine.parent &&
      cellLine.parent.parent &&
      cellLine.parent.parent.statics.blotName === TableCell.blotName
    ) {
      const cell = cellLine.parent.parent;
      const row = cell.parent;
      const table = row.parent.parent;
      return [table, row, cell, offset];
    }
    return [null, null, null, -1];
  }

  insertTable(rows, columns) {
    const range = this.quill.getSelection(true);
    const [currentLine, offset] = this.quill.getLine(range.index);
    if (range == null) {
      return;
    }
    const currentBlot = this.quill.getLeaf(range.index)[0];
    let delta = new Delta().retain(range.index);
    // prevent insert table in a table cell
    if (isInTableCell(currentBlot)) {
      return;
    }

    // check whether to insert a empty line before the new table
    if (
      (!currentLine.prev && offset === 0) ||
      (currentLine && offset !== 0) ||
      (offset === 0 &&
        currentLine.prev &&
        currentLine.prev.statics.blotName === TableView.blotName)
    ) {
      delta.insert('\n');
    }
    // insert table column
    delta = new Array(columns).fill('\n').reduce((memo, text) => {
      memo.insert(text, { 'table-col': true });
      return memo;
    }, delta);
    // insert table cell line with empty line
    delta = new Array(rows).fill(0).reduce((memo, item, rowIndex) => {
      const tableRowId = this.genRowId(rowIndex);
      return new Array(columns).fill('\n').reduce((result, text, colIndex) => {
        result.insert(text, {
          'table-cell-line': {
            row: tableRowId,
            cell: this.genCellId(rowIndex, colIndex),
          },
        });
        return result;
      }, memo);
    }, delta);

    // check whether to remove a empty line after the new table
    if (
      offset === 0 &&
      currentLine.next &&
      currentLine.next.statics.blotName !== TableView.blotName
    ) {
      delta.delete(1);
    }

    if ((!currentLine.prev && offset === 0) || (currentLine && offset !== 0)) {
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.setSelection(range.index + columns + 1, 0, Quill.sources.API);
    } else {
      this.quill.updateContents(delta, Quill.sources.USER);
      this.quill.setSelection(range.index + columns, 0, Quill.sources.API);
    }
  }

  listenBalanceCells() {
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, mutations => {
      const flag = mutations.some(mutation => {
        if (['TD', 'TR', 'TBODY', 'TABLE'].includes(mutation.target.tagName)) {
          return true;
        }
        return false;
      });

      if (flag) {
        this.balanceTables();
      }
    });
  }

  balanceTables() {
    this.quill.scroll.descendants(TableContainer).forEach(table => {
      table.balanceCells();
    });
    setTimeout(() => {
      if (this.columnTool) {
        this.columnTool.updateToolCells();
      }
      if (this.columnTool && this.columnTool.activeDropdown) {
        this.columnTool.activeDropdown.destroy();
      }
      if (this.rowTool) {
        this.rowTool.updateToolCells();
      }
    }, 0);
  }
}

function isTableCell(blot) {
  return blot.statics.blotName === TableCell.blotName;
}

function isInTableCell(current) {
  if (current && current.parent) {
    if (isTableCell(current.parent)) {
      return true;
    }
    return isInTableCell(current.parent);
  }
  return false;
}

export default Table;
