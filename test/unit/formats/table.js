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
    const cells =
      editor.scroll.children.head.children.head.children.tail.children.head
        .children;
    // editor.scroll.children.head.children.head.children.tail.children.head.optimize();
    cells.forEach(cell => {
      console.log(cell);
      cell.optimize();
    });
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
      `<table>
        <tbody>
          <tr>
            <td data-row="a">A1</td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
          </tr>
          <tr>
            <td data-row="c">C1</td>
            <td data-row="c">C2</td>
            <td data-row="c">C3</td>
          </tr>
        </tbody>
      </table>`,
    );
    editor.scroll.children.head.balanceCells();
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="a">A1</td>
            <td data-row="a"><br></td>
            <td data-row="a"><br></td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
            <td data-row="b"><br></td>
          </tr>
          <tr>
            <td data-row="c">C1</td>
            <td data-row="c">C2</td>
            <td data-row="c">C3</td>
          </tr>
        </tbody>
      </table>`,
    );
  });

  it('format', function() {
    const editor = this.initialize(Editor, '<p>a</p><p>b</p><p>1</p><p>2</p>');
    editor.formatLine(0, 4, { table: 'a' });
    editor.formatLine(4, 4, { table: 'b' });
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="a">a</td>
            <td data-row="a">b</td>
          </tr>
          <tr>
            <td data-row="b">1</td>
            <td data-row="b">2</td>
          </tr>
        </tbody>
      </table>`,
    );
  });

  it('applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta().insert('\n\n', { table: 'a' }).insert('\n\n', { table: 'b' }),
    );
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="a"><br></td>
            <td data-row="a"><br></td>
          </tr>
          <tr>
            <td data-row="b"><br></td>
            <td data-row="b"><br></td>
          </tr>
        </tbody>
      </table>
      <p><br></p>`,
    );
  });

  it('unbalanced table applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta()
        .insert('A1\nB1\nC1\n', { table: '1' })
        .insert('A2\nB2\nC2\n', { table: '2' })
        .insert('A3\nB3\n', { table: '3' }),
    );
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
            <td data-row="1">B1</td>
            <td data-row="1">C1</td>
          </tr>
          <tr>
            <td data-row="2">A2</td>
            <td data-row="2">B2</td>
            <td data-row="2">C2</td>
          </tr>
          <tr>
            <td data-row="3">A3</td>
            <td data-row="3">B3</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>`,
    );
  });

  it('existing table applyDelta', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
          </tr>
          <tr>
            <td data-row="2"><br></td>
            <td data-row="2">B1</td>
          </tr>
        </tbody>
      </table>`,
    );
    editor.applyDelta(
      new Delta()
        .retain(3)
        .retain(1, { table: '1' })
        .insert('\n', { table: '2' }),
    );
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
            <td data-row="1"><br></td>
          </tr>
          <tr>
            <td data-row="2"><br></td>
            <td data-row="2">B1</td>
          </tr>
        </tbody>
      </table>`,
    );
  });
});
