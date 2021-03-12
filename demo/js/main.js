import 'assets/snow.styl';
import '../styles/style.styl';
import Quill from 'root/quill';
import Delta from 'quill-delta';

import { tableDeltaParser } from '../../modules/clickup-table/utils';

const oldTableDelta3 = new Delta({
  ops: [
    { insert: '\n' },
    { attributes: { 'table-col': { width: '150' } }, insert: '\n\n\n' },
    { insert: 'sdfsdfdsf' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'dsf' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'dsfsdfdsfsd' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'fdsf' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'ds' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'f' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'ds' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: 'fdsf' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-3',
        },
        row: '1',
        cell: '1-3',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '2',
          cell: '2-1',
        },
        row: '2',
        cell: '2-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '2',
          cell: '2-2',
        },
        row: '2',
        cell: '2-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '2',
          cell: '2-3',
        },
        row: '2',
        cell: '2-3',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '3',
          cell: '3-1',
        },
        row: '3',
        cell: '3-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '3',
          cell: '3-2',
        },
        row: '3',
        cell: '3-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '3',
          cell: '3-3',
        },
        row: '3',
        cell: '3-3',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '\n' },
  ],
});
const testTableDelta = new Delta({
  ops: [
    { insert: '\n' },
    { attributes: { 'table-col': { width: '150' } }, insert: '\n\n\n' },
    { insert: '1111111' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '11' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '1' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '1' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '1' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '1' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '111' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '11111' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-1',
        },
        row: '1',
        cell: '1-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '22222' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '22' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '2' },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-2',
        },
        row: '1',
        cell: '1-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '1',
          cell: '1-3',
        },
        row: '1',
        cell: '1-3',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '2',
          cell: '2-1',
        },
        row: '2',
        cell: '2-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '2',
          cell: '2-2',
        },
        row: '2',
        cell: '2-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '2',
          cell: '2-3',
        },
        row: '2',
        cell: '2-3',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '3',
          cell: '3-1',
        },
        row: '3',
        cell: '3-1',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '3',
          cell: '3-2',
        },
        row: '3',
        cell: '3-2',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    {
      attributes: {
        'table-cell-line': {
          rowspan: '1',
          colspan: '1',
          row: '3',
          cell: '3-3',
        },
        row: '3',
        cell: '3-3',
        rowspan: '1',
        colspan: '1',
      },
      insert: '\n',
    },
    { insert: '\n' },
  ],
});

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'link'], // toggled buttons
  ['blockquote', 'code-block', ['formula']],

  [{ header: 1 }, { header: 2 }], // custom button values
  [
    { list: 'ordered' },
    { list: 'bullet' },
    { list: 'unchecked' },
    { list: 'toggled' },
    { list: 'none' },
  ],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

window.onload = () => {
  Quill.enableBlockIdMode(false);
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      table: {
        tableTools: {
          zIndex: 100,
        },
        customRowId: rowIndex => `${rowIndex + 1}`,
        customCellId: (rowIndex, colIndex) => `${rowIndex + 1}-${colIndex + 1}`,
      },
      storage: true,
      syntax: true,
    },
  });

  const config = {
    app: 'quilljs',
    username: (Math.random() * 1000).toFixed(0),
    autoStart: true,
    showUI: false,
    showCursor: true,
    cursorAlwaysOn: true,
    editor: quill,
    docId: 'id',
  };
  const codox = new Codox();
  codox.start(config);

  // quill.on('text-change', (newDelta, oldContents, source) => {
  //   console.log(newDelta);
  // });

  // quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
  //   console.log(delta);
  //   return delta;
  // });

  window.quill = quill;
  // test parse old table delta to new
  quill.setContents(tableDeltaParser(testTableDelta));

  const tableModule = quill.getModule('table');

  document.querySelector('#insert-table').addEventListener(
    'click',
    () => {
      tableModule.insertTable(3, 3);
    },
    false,
  );

  document.querySelector('#get-delta').addEventListener(
    'click',
    () => {
      console.log(quill.getContents());
      quill.editor.applyDelta(
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
    },
    false,
  );

  document.querySelector('#get-html').addEventListener(
    'click',
    () => {
      console.log(quill.editor.getHTML(2, 20));
    },
    false,
  );

  document.getElementById('import-tables').addEventListener(
    'click',
    () => {
      const index = quill.getLength();
      const [line] = quill.getLine(index - 1);
      const lineFormats = line.formats();

      quill.updateContents(
        new Delta()
          .retain(index - 1)
          .insert('\n', lineFormats)
          .concat(
            tableDeltaParser(oldTableDelta3)
              .delete(1)
              .insert('\n'),
          ),
        Quill.sources.USER,
      );
    },
    false,
  );

  document.querySelector('#insert-quote').addEventListener(
    'click',
    () => {
      const range = quill.getSelection();
      const [line, offset] = quill.getLine(range.index);
      const lineFormats = line.formats();

      if (line.statics.blotName === 'list') {
        quill.format('blockquote', {
          ...lineFormats.list,
          'wrapper-indent': lineFormats.indent,
          'in-list': lineFormats.list.list,
        });
        quill.format('indent', false);
      } else {
        quill.format('blockquote', {});
      }
    },
    false,
  );

  document.querySelector('#insert-code').addEventListener(
    'click',
    () => {
      const range = quill.getSelection();
      const [line, offset] = quill.getLine(range.index);
      const lineFormats = line.formats();

      if (line.statics.blotName === 'list') {
        quill.format('code-block', {
          ...lineFormats.list,
          'wrapper-indent': lineFormats.indent,
          'in-list': lineFormats.list.list,
        });
        quill.format('indent', false);
      } else if (
        lineFormats[line.statics.blotName] &&
        lineFormats[line.statics.blotName]['in-list']
      ) {
        quill.format('code-block', {
          ...lineFormats[line.statics.blotName],
        });
      } else {
        quill.format('code-block', {});
      }
    },
    false,
  );

  document.getElementById('insert-formula').addEventListener(
    'click',
    () => {
      const range = quill.getSelection();
      const [line, offset] = quill.getLine(range.index);
      const lineFormats = line.formats();
      quill.insertEmbed(range.index, 'formula', 'e=mc^2', 'user');
    },
    false,
  );
};
