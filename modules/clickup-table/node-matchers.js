import Delta from 'quill-delta';
import { omit } from './utils';
import { TableCellLine } from './formats';

export function matchTableCell(node, delta) {
  const row = node.parentNode;
  const table =
    row.parentNode.tagName === 'TABLE'
      ? row.parentNode
      : row.parentNode.parentNode;

  const rows = Array.from(table.querySelectorAll('tr'));
  const cells = Array.from(row.querySelectorAll('td'));
  const rowId = rows.indexOf(row) + 1;
  const cellId = `${rowId}-${cells.indexOf(node) + 1}`;
  const colspan = node.getAttribute('colspan') || 1;
  const rowspan = node.getAttribute('rowspan') || 1;

  if (delta.length() === 0) {
    delta = new Delta().insert('\n', {
      'table-cell-line': { row: rowId, cell: cellId, rowspan, colspan },
    });
    return delta;
  }

  delta = delta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string') {
      const lines = [];
      const insertStr = op.insert;
      let start = 0;
      for (let i = 0; i < op.insert.length; i += 1) {
        if (insertStr.charAt(i) === '\n') {
          if (i === 0) {
            lines.push('\n');
          } else {
            lines.push(insertStr.substring(start, i));
            lines.push('\n');
          }
          start = i + 1;
        }
      }

      const tailStr = insertStr.substring(start);
      if (tailStr) lines.push(tailStr);

      lines.forEach(text => {
        if (text === '\n') {
          newDelta.insert('\n', op.attributes);
        } else {
          newDelta.insert(
            text,
            omit(op.attributes, [
              'table',
              'table-cell-line',
              'list-container',
              'list',
            ]),
          );
        }
      });
    } else {
      newDelta.insert(op.insert, op.attributes);
    }

    return newDelta;
  }, new Delta());

  return delta.reduce((newDelta, op) => {
    if (
      op.insert &&
      typeof op.insert === 'string' &&
      op.insert.startsWith('\n')
    ) {
      const blotAttributes = op.attributes.list
        ? {
            list: Object.assign(
              {},
              {
                row: rowId,
                cell: cellId,
                rowspan,
                colspan,
                ...op.attributes.list,
              },
              op.attributes.table,
            ),
          }
        : { 'table-cell-line': { row: rowId, cell: cellId, rowspan, colspan } };

      newDelta.insert(
        op.insert,
        Object.assign(
          {},
          Object.assign({}, { row: rowId }, op.attributes.table),
          blotAttributes,
          omit(op.attributes, ['table', 'list-container', 'list']),
        ),
      );
    } else {
      newDelta.insert(
        op.insert,
        Object.assign(
          {},
          omit(op.attributes, [
            'table',
            'table-cell-line',
            'list-container',
            'list',
          ]),
        ),
      );
    }

    return newDelta;
  }, new Delta());
}

// replace th to td
export function matchTableHeader(node, delta) {
  const row = node.parentNode;
  const table =
    row.parentNode.tagName === 'TABLE'
      ? row.parentNode
      : row.parentNode.parentNode;
  const rows = Array.from(table.querySelectorAll('tr'));
  const cells = Array.from(row.querySelectorAll('th'));
  const rowId = rows.indexOf(row) + 1;
  const cellId = cells.indexOf(node) + 1;
  const colspan = node.getAttribute('colspan') || false;
  const rowspan = node.getAttribute('rowspan') || false;

  // bugfix: empty table cells copied from other place will be removed unexpectedly
  if (delta.length() === 0) {
    delta = new Delta().insert('\n', {
      'table-cell-line': { row: rowId, cell: cellId, rowspan, colspan },
    });
    return delta;
  }

  delta = delta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string') {
      const lines = [];
      const insertStr = op.insert;
      let start = 0;
      for (let i = 0; i < op.insert.length; i += 1) {
        if (insertStr.charAt(i) === '\n') {
          if (i === 0) {
            lines.push('\n');
          } else {
            lines.push(insertStr.substring(start, i));
            lines.push('\n');
          }
          start = i + 1;
        }
      }

      const tailStr = insertStr.substring(start);
      if (tailStr) lines.push(tailStr);

      // bugfix: no '\n' in op.insert, push a '\n' to lines
      if (lines.indexOf('\n') < 0) {
        lines.push('\n');
      }

      lines.forEach(text => {
        if (text === '\n') {
          newDelta.insert('\n', {
            'table-cell-line': { row: rowId, cell: cellId, rowspan, colspan },
          });
        } else {
          newDelta.insert(text, op.attributes);
        }
      });
    } else {
      newDelta.insert(op.insert, op.attributes);
    }

    return newDelta;
  }, new Delta());

  return delta.reduce((newDelta, op) => {
    if (
      op.insert &&
      typeof op.insert === 'string' &&
      op.insert.startsWith('\n')
    ) {
      newDelta.insert(
        op.insert,
        Object.assign(
          {},
          { 'table-cell-line': { row: rowId, cell: cellId, rowspan, colspan } },
        ),
      );
    } else {
      newDelta.insert(
        op.insert,
        Object.assign({}, omit(op.attributes, ['table', 'table-cell-line'])),
      );
    }

    return newDelta;
  }, new Delta());
}

export function matchTable(node, delta) {
  const newColDelta = new Delta();
  const topRow = node.querySelector('tr');

  // bugfix: empty table will return empty delta
  if (topRow === null) {
    return newColDelta;
  }

  // optimize: Copy-paste text from one single cell to main text should not create single-cell tables
  if (node.querySelectorAll('td').length === 1) {
    return delta.reduce((newDelta, op) => {
      if (op.attributes && op.attributes[TableCellLine.blotName]) {
        newDelta.insert(
          op.insert,
          omit(op.attributes, [TableCellLine.blotName]),
        );
      } else if (
        op.attributes &&
        op.attributes.list &&
        op.attributes.list.row &&
        op.attributes.list.cell
      ) {
        newDelta.insert(
          op.insert,
          Object.assign({}, op.attributes, {
            list: { list: op.attributes.list.list },
          }),
        );
      } else {
        newDelta.push(op);
      }
      return newDelta;
    }, new Delta());
  }

  const cellsInTopRow = Array.from(topRow.querySelectorAll('td')).concat(
    Array.from(topRow.querySelectorAll('th')),
  );
  const maxCellsNumber = cellsInTopRow.reduce((sum, cell) => {
    const cellColspan = cell.getAttribute('colspan') || 1;
    sum += parseInt(cellColspan, 10);
    return sum;
  }, 0);
  const colsNumber = node.querySelectorAll('col').length;
  // bugfix: the table copied from Excel had some default col tags missing
  //         add missing col tags
  if (colsNumber === maxCellsNumber) {
    return delta;
  }
  for (let i = 0; i < maxCellsNumber - colsNumber; i += 1) {
    newColDelta.insert('\n', { 'table-col': true });
  }

  if (colsNumber === 0) return newColDelta.concat(delta);

  let lastNumber = 0;
  return delta.reduce((finalDelta, op) => {
    finalDelta.insert(op.insert, op.attributes);

    if (op.attributes && op.attributes['table-col']) {
      lastNumber += op.insert.length;
      if (lastNumber === colsNumber) {
        finalDelta = finalDelta.concat(newColDelta);
      }
    }

    return finalDelta;
  }, new Delta());
}
