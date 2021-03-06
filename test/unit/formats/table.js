import Delta from 'quill-delta';
import Editor from '../../../core/editor';

const tableDelta = new Delta()
  .insert('\n\n\n', { 'table-col': { width: '150' } })
  .insert('a1')
  .insert('\n', {
    'table-cell-line': { row: '1', cell: '1-1', rowspan: '1', colspan: '1' },
    cell: '1-1',
    colspan: '1',
    row: '1',
    rowspan: '1',
  })
  .insert('a2')
  .insert('\n', {
    'table-cell-line': { row: '1', cell: '1-2', rowspan: '1', colspan: '1' },
    cell: '1-2',
    colspan: '1',
    row: '1',
    rowspan: '1',
  })
  .insert('a3')
  .insert('\n', {
    'table-cell-line': { row: '1', cell: '1-3', rowspan: '1', colspan: '1' },
    cell: '1-3',
    colspan: '1',
    row: '1',
    rowspan: '1',
  })
  .insert('b1')
  .insert('\n', {
    'table-cell-line': { row: '2', cell: '2-1', rowspan: '1', colspan: '1' },
    cell: '2-1',
    colspan: '1',
    row: '2',
    rowspan: '1',
  })
  .insert('b2')
  .insert('\n', {
    'table-cell-line': { row: '2', cell: '2-2', rowspan: '1', colspan: '1' },
    cell: '2-2',
    colspan: '1',
    row: '2',
    rowspan: '1',
  })
  .insert('b3')
  .insert('\n', {
    'table-cell-line': { row: '2', cell: '2-3', rowspan: '1', colspan: '1' },
    cell: '2-3',
    colspan: '1',
    row: '2',
    rowspan: '1',
  });

const tableHTML = `
  <div class="clickup-table-view">
    <table class="clickup-table">
      <colgroup>
        <col width="150">
        <col width="150">
        <col width="150">
      </colgroup>
      <tbody>
        <tr data-row="1">
          <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
            <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
          </td>
          <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
            <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1">a2</div>
          </td>
          <td data-row="1" data-cell="1-3" rowspan="1" colspan="1">
            <div class="qlbt-cell-line" data-row="1" data-cell="1-3" data-rowspan="1" data-colspan="1">a3</div>
          </td>
        </tr>
        <tr data-row="2">
          <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
            <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1">b1</div>
          </td>
          <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
            <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">b2</div>
          </td>
          <td data-row="2" data-cell="2-3" rowspan="1" colspan="1">
            <div class="qlbt-cell-line" data-row="2" data-cell="2-3" data-rowspan="1" data-colspan="1">b3</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;

describe('Table', function() {
  it('initialize', function() {
    const editor = this.initialize(Editor, tableHTML);
    expect(editor.getDelta()).toEqual(tableDelta);
    expect(this.container).toEqualHTML(tableHTML);
  });

  it('add', function() {
    const editor = this.initialize(Editor, '');
    editor.applyDelta(new Delta([...tableDelta.ops]).delete(1));
    expect(this.container).toEqualHTML(tableHTML);
  });

  it('add format plaintext', function() {
    const editor = this.initialize(Editor, '<p>Test</p>');
    editor.formatLine(0, 6, {
      'table-cell-line': { row: '1', cell: '1-1', rowspan: '1', colspan: '1' },
    });
    expect(this.container).toEqualHTML(`
      <div class="clickup-table-view">
        <table class="clickup-table">
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">Test</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });

  it('add format replace', function() {
    const editor = this.initialize(Editor, '<h1>Test</h1>');
    editor.formatLine(0, 6, {
      'table-cell-line': { row: '1', cell: '1-1', rowspan: '1', colspan: '1' },
    });
    expect(this.container).toEqualHTML(`
      <div class="clickup-table-view">
        <table class="clickup-table">
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">Test</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });

  it('remove format plaintext', function() {
    const editor = this.initialize(
      Editor,
      `<div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">Test</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
    editor.formatLine(0, 6, { 'table-cell-line': null });
    editor.scroll.children.head.children.head.balanceCells();
    expect(this.container).toEqualHTML('<p>Test</p>');
  });

  it('remove format replace', function() {
    const editor = this.initialize(
      Editor,
      `<div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">Test</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
    editor.formatLine(0, 6, { header: 1 });
    editor.scroll.children.head.children.head.balanceCells();
    expect(this.container).toEqualHTML('<h1>Test</h1>');
  });

  it('group rows', function() {
    const editor = this.initialize(
      Editor,
      `<div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">A</div>
              </td>
            </tr>
            <tr data-row="1">
              <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1">B</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
    editor.scroll.children.head.children.head.children.tail.children.head.optimize();
    expect(this.container).toEqualHTML(`
    <div class="clickup-table-view">
      <table class="clickup-table">
        <colgroup>
          <col width="150">
        </colgroup>
        <tbody>
          <tr data-row="1">
            <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">A</div>
            </td>
            <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1">B</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`);
  });

  it('split rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">A</div>
              </td>
              <td data-row="2" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="1-2" data-rowspan="1" data-colspan="1">B</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      `,
    );
    editor.scroll.children.head.children.head.children.tail.children.head.optimize();
    expect(this.container).toEqualHTML(`
    <div class="clickup-table-view">
      <table class="clickup-table">
        <colgroup>
          <col width="150">
        </colgroup>
        <tbody>
          <tr data-row="1">
            <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">A</div>
            </td>
          </tr>
          <tr data-row="2">
            <td data-row="2" data-cell="1-2" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="2" data-cell="1-2" data-rowspan="1" data-colspan="1">B</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    `);
  });

  it('group and split rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr><td data-row="a">A</td><td data-row="b">B1</td></tr>
          <tr><td data-row="b">B2</td></tr>
        </tbody>
      </table>
    `,
    );
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(this.container).toEqualHTML(`
      <table>
        <tbody>
          <tr><td data-row="a">A</td></tr>
          <tr><td data-row="b">B1</td><td data-row="b">B2</td></tr>
        </tbody>
      </table>
    `);
  });

  xit('group and split multiple rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr><td data-row="1"><br></td><td data-row="1"><br></td><td data-row="1"><br></td></tr>
          <tr><td data-row="2"><br></td><td data-row="2"><br></td><td data-row="2"><br></td></tr>
          <tr><td data-row="3"><br></td><td data-row="3"><br></td></tr>
          <tr><td data-row="3"><br></td><td data-row="4"><br></td></tr>
          <tr><td data-row="4"><br></td><td data-row="4"><br></td></tr>
        </tbody>
      </table>
    `,
    );
    editor.scroll.children.head.children.head.optimize();
    expect(this.container).toEqualHTML(`
      <table>
        <tbody>
          <tr><td data-row="1"><br></td><td data-row="1"><br></td><td data-row="1"><br></td></tr>
          <tr><td data-row="2"><br></td><td data-row="2"><br></td><td data-row="2"><br></td></tr>
          <tr><td data-row="3"><br></td><td data-row="3"><br></td><td data-row="3"><br></td></tr>
          <tr><td data-row="4"><br></td><td data-row="4"><br></td><td data-row="4"><br></td></tr>
        </tbody>
      </table>
    `);
  });

  it('balance cells', function() {
    const editor = this.initialize(
      Editor,
      `<div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
              </td>
              <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1"><br></div>
              </td>
            </tr>
            <tr data-row="2">
              <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1"><br></div>
              </td>
              <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">b1</div>
              </td>
            </tr>
          </tbody>
          <colgroup>
            <col width="150">
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="3">
              <td data-row="3" data-cell="3-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="3" data-cell="3-1" data-rowspan="1" data-colspan="1">a1</div>
              </td>
              <td data-row="3" data-cell="3-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="3" data-cell="3-2" data-rowspan="1" data-colspan="1"><br></div>
              </td>
            </tr>
            <tr data-row="4">
              <td data-row="4" data-cell="4-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="4" data-cell="4-1" data-rowspan="1" data-colspan="1"><br></div>
              </td>
              <td data-row="4" data-cell="4-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="4" data-cell="4-2" data-rowspan="1" data-colspan="1">b1</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
    editor.scroll.children.head.children.head.balanceCells();
    editor.scroll.children.head.children.head.children.forEach(child =>
      child.optimize(),
    );
    expect(this.container).toEqualHTML(
      `<div class="clickup-table-view">
      <table class="clickup-table">
        <colgroup>
          <col width="150">
          <col width="150">
        </colgroup>
        <tbody>
          <tr data-row="1">
            <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
            </td>
            <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1"><br></div>
            </td>
          </tr>
          <tr data-row="2">
            <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1"><br></div>
            </td>
            <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">b1</div>
            </td>
          </tr>
          <tr data-row="3">
            <td data-row="3" data-cell="3-1" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="3" data-cell="3-1" data-rowspan="1" data-colspan="1">a1</div>
            </td>
            <td data-row="3" data-cell="3-2" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="3" data-cell="3-2" data-rowspan="1" data-colspan="1"><br></div>
            </td>
          </tr>
          <tr data-row="4">
            <td data-row="4" data-cell="4-1" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="4" data-cell="4-1" data-rowspan="1" data-colspan="1"><br></div>
            </td>
            <td data-row="4" data-cell="4-2" rowspan="1" colspan="1">
              <div class="qlbt-cell-line" data-row="4" data-cell="4-2" data-rowspan="1" data-colspan="1">b1</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
    );
  });

  it('format', function() {
    const editor = this.initialize(Editor, '<p>a</p><p>b</p><p>1</p><p>2</p>');
    editor.formatLine(0, 2, {
      'table-cell-line': { cell: '1-1', row: '1', colspan: '1', rowspan: '1' },
    });
    editor.formatLine(2, 2, {
      'table-cell-line': { cell: '1-2', row: '1', colspan: '1', rowspan: '1' },
    });
    editor.formatLine(4, 2, {
      'table-cell-line': { cell: '2-1', row: '2', colspan: '1', rowspan: '1' },
    });
    editor.formatLine(6, 2, {
      'table-cell-line': { cell: '2-2', row: '2', colspan: '1', rowspan: '1' },
    });
    expect(this.container).toEqualHTML(
      `<div class="clickup-table-view">
        <table class="clickup-table">
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a</div>
              </td>
              <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1">b</div>
              </td>
            </tr>
            <tr data-row="2">
              <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1">1</div>
              </td>
              <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">2</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
  });

  it('applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta()
        .insert('\n\n', { 'table-col': { width: '150' } })
        .insert('a1')
        .insert('\n', {
          'table-cell-line': {
            row: '1',
            cell: '1-1',
            rowspan: '1',
            colspan: '1',
          },
          cell: '1-1',
          colspan: '1',
          row: '1',
          rowspan: '1',
        })
        .insert('a2')
        .insert('\n', {
          'table-cell-line': {
            row: '1',
            cell: '1-2',
            rowspan: '1',
            colspan: '1',
          },
          cell: '1-2',
          colspan: '1',
          row: '1',
          rowspan: '1',
        })
        .insert('b1')
        .insert('\n', {
          'table-cell-line': {
            row: '2',
            cell: '2-1',
            rowspan: '1',
            colspan: '1',
          },
          cell: '2-1',
          colspan: '1',
          row: '2',
          rowspan: '1',
        })
        .insert('b2')
        .insert('\n', {
          'table-cell-line': {
            row: '2',
            cell: '2-2',
            rowspan: '1',
            colspan: '1',
          },
          cell: '2-2',
          colspan: '1',
          row: '2',
          rowspan: '1',
        }),
    );
    expect(this.container).toEqualHTML(`
      <div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
              </td>
              <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1">a2</div>
              </td>
            </tr>
            <tr data-row="2">
              <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1">b1</div>
              </td>
              <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">b2</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br></p>`);
  });

  it('unbalanced table applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta()
        .insert('\n\n', { 'table-col': { width: '150' } })
        .insert('a1')
        .insert('\n', {
          'table-cell-line': {
            row: '1',
            cell: '1-1',
            rowspan: '1',
            colspan: '1',
          },
          cell: '1-1',
          colspan: '1',
          row: '1',
          rowspan: '1',
        })
        .insert('a2')
        .insert('\n', {
          'table-cell-line': {
            row: '1',
            cell: '1-2',
            rowspan: '1',
            colspan: '1',
          },
          cell: '1-2',
          colspan: '1',
          row: '1',
          rowspan: '1',
        })
        .insert('b1')
        .insert('\n', {
          'table-cell-line': {
            row: '2',
            cell: '2-1',
            rowspan: '1',
            colspan: '1',
          },
          cell: '2-1',
          colspan: '1',
          row: '2',
          rowspan: '1',
        }),
    );
    expect(this.container).toEqualHTML(`
      <div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
              </td>
              <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1">a2</div>
              </td>
            </tr>
            <tr data-row="2">
              <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1">b1</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br></p>`);
  });

  it('existing table applyDelta', function() {
    const editor = this.initialize(
      Editor,
      `
      <div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
              </td>
            </tr>
            <tr data-row="2">
              <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1"><br></div>
              </td>
              <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">b1</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
    editor.applyDelta(
      new Delta()
        .retain(5)
        .retain(1, {
          'table-cell-line': {
            cell: '1-2',
            row: '1',
            colspan: '1',
            rowspan: '1',
          },
        })
        .insert('\n', {
          'table-cell-line': {
            cell: '2-1',
            row: '2',
            colspan: '1',
            rowspan: '1',
          },
        }),
    );
    expect(this.container).toEqualHTML(
      `<div class="clickup-table-view">
        <table class="clickup-table">
          <colgroup>
            <col width="150">
            <col width="150">
          </colgroup>
          <tbody>
            <tr data-row="1">
              <td data-row="1" data-cell="1-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1">a1</div>
              </td>
              <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1"><br></div>
              </td>
            </tr>
            <tr data-row="2">
              <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1"><br></div>
              </td>
              <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1">b1</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`,
    );
  });
});
