import Delta from 'quill-delta';
import Quill from '../../../core/quill';

describe('Table Module', function() {
  describe('insert table', function() {
    it('empty', function() {
      const quill = this.initialize(Quill, '<p><br></p>', this.container, {
        modules: {
          table: {
            customRowId: rowIndex => `${rowIndex + 1}`,
            customCellId: (rowIndex, colIndex) =>
              `${rowIndex + 1}-${colIndex + 1}`,
          },
        },
      });
      const table = quill.getModule('table');
      quill.setSelection(0);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(`
        <p><br></p>
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
                  <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="1" data-cell="1-3" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="1" data-cell="1-3" data-rowspan="1" data-colspan="1"><br></div>
                </td>
              </tr>
              <tr data-row="2">
                <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="2" data-cell="2-3" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="2" data-cell="2-3" data-rowspan="1" data-colspan="1"><br></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br></p>
      `);
    });

    it('split', function() {
      const quill = this.initialize(Quill, '<p>0123</p>', this.container, {
        modules: {
          table: {
            customRowId: rowIndex => `${rowIndex + 1}`,
            customCellId: (rowIndex, colIndex) =>
              `${rowIndex + 1}-${colIndex + 1}`,
          },
        },
      });
      const table = quill.getModule('table');
      quill.setSelection(2);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(`
        <p>01</p>
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
                  <div class="qlbt-cell-line" data-row="1" data-cell="1-1" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="1" data-cell="1-2" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="1" data-cell="1-2" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="1" data-cell="1-3" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="1" data-cell="1-3" data-rowspan="1" data-colspan="1"><br></div>
                </td>
              </tr>
              <tr data-row="2">
                <td data-row="2" data-cell="2-1" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="2" data-cell="2-1" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="2" data-cell="2-2" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="2" data-cell="2-2" data-rowspan="1" data-colspan="1"><br></div>
                </td>
                <td data-row="2" data-cell="2-3" rowspan="1" colspan="1">
                  <div class="qlbt-cell-line" data-row="2" data-cell="2-3" data-rowspan="1" data-colspan="1"><br></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>23</p>
      `);
    });
  });

  describe('modify table', function() {
    beforeEach(function() {
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
        </div>
      `;
      this.quill = this.initialize(Quill, tableHTML, this.container, {
        modules: {
          table: {
            customRowId: rowIndex => `${rowIndex + 1}`,
            customCellId: (rowIndex, colIndex) =>
              `${rowIndex + 1}-${colIndex + 1}`,
          },
        },
      });
      this.table = this.quill.getModule('table');
    });

    it('insertText before', function() {
      this.quill.updateContents(new Delta().insert('\n'));
      expect(this.quill.root).toEqualHTML(`
        <p><br></p>
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
        </div>
      `);
    });

    it('insertText after', function() {
      this.quill.updateContents(new Delta().retain(22).insert('\n'));
      expect(this.quill.root).toEqualHTML(`
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
        </div>
        <p><br></p>
      `);
    });
  });
});
