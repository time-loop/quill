import Delta from 'quill-delta';

function cellId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 8);
  return `cell-${id}`;
}
/**
 * omit
 * @param  {Object} obj         target Object
 * @param  {Array} uselessKeys  keys of removed properties
 * @return {Object}             new Object without useless properties
 */
export function omit(obj, uselessKeys) {
  return (
    obj &&
    Object.keys(obj).reduce((acc, key) => {
      return uselessKeys.includes(key)
        ? acc
        : Object.assign({}, acc, { [key]: obj[key] });
    }, {})
  );
}

// compatible with old native table delta in quilljs
// compatible with old native list delta in quilljs
export function tableDeltaParser(oldDelta) {
  let delta = new Delta();
  const tokens = scanTableColumnTokens(oldDelta);
  let columnCount = 0;
  let currentToken = null;

  delta = oldDelta.reduce((newDelta, op) => {
    if (op.insert && typeof op.insert === 'string') {
      if (op.attributes && op.attributes.table) {
        [currentToken] = tokens;
        while (currentToken) {
          if (currentToken === op.attributes.table) {
            tokens.shift();
            columnCount += 1;
            [currentToken] = tokens;
          } else {
            tokens.shift();
            [currentToken] = tokens;
          }
        }

        // it means there is a table here: columnCount > 0
        if (columnCount > 0) {
          // collect contents in the first cell
          let prevOp = newDelta.ops.pop();
          const reversedOpsInFirstCell = [];
          while (prevOp) {
            if (typeof prevOp.insert === 'string') {
              if (prevOp.insert.indexOf('\n') >= 0) {
                const linesArr = prevOp.insert.split('\n');
                const lastLine = linesArr.pop();
                newDelta.insert(`${linesArr.join('\n')}\n`, prevOp.attributes);

                if (lastLine) {
                  reversedOpsInFirstCell.push({
                    insert: lastLine,
                    attributes: prevOp.attributes || {},
                  });
                }
                prevOp = null;
              } else {
                reversedOpsInFirstCell.push(prevOp);
                prevOp = newDelta.ops.pop();
              }
            } else {
              reversedOpsInFirstCell.push(prevOp);
              prevOp = newDelta.ops.pop();
            }
          }

          // insert tableCol
          newDelta.insert(
            new Array(columnCount)
              .fill(0)
              .map(() => '\n')
              .join(''),
            { 'table-col': { width: '150' } },
          );

          // insert contents in the first cell
          const deltaInFirstCell = new Delta(reversedOpsInFirstCell.reverse());
          newDelta = newDelta.concat(deltaInFirstCell);

          columnCount = 0;
        }

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

        lines.forEach(str => {
          if (str === '\n') {
            newDelta.insert(
              str,
              Object.assign(
                {},
                { row: op.attributes.table, rowspan: 1, colspan: 1 },
                {
                  'table-cell-line': {
                    row: op.attributes.table,
                    rowspan: 1,
                    colspan: 1,
                    cell: cellId(),
                  },
                },
                omit(op.attributes, ['table']),
              ),
            );
          } else {
            newDelta.insert(str, omit(op.attributes, ['table']));
          }
        });
      } else if (
        op.attributes &&
        op.attributes.list &&
        typeof op.attributes.list === 'string'
      ) {
        newDelta.insert(
          op.insert,
          Object.assign({}, op.attributes, {
            list: { list: op.attributes.list },
          }),
        );
      } else {
        const count = op.insert.split('').filter(char => char === '\n').length;
        new Array(count).fill(0).forEach(() => {
          tokens.shift();
        });
        columnCount = 0;
        newDelta.insert(op.insert, op.attributes);
      }
    } else {
      newDelta.insert(op.insert, op.attributes);
    }

    return newDelta;
  }, new Delta());

  return delta;
}
// help scan the count of columns for each table in old delta
function scanTableColumnTokens(oldDelta) {
  return oldDelta.reduce((countMap, op) => {
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
      if (tailStr) {
        lines.push(tailStr);
      }
      lines.forEach(str => {
        if (str === '\n') {
          countMap.push((op.attributes && op.attributes.table) || false);
        }
      });
    }
    return countMap;
  }, []);
}
