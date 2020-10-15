import 'assets/snow.styl'
import '../styles/style.styl'
import Quill from 'root/quill'
import Delta from 'quill-delta'

import { tableDeltaParser } from '../../modules/clickup-table/utils'

const oldTableDelta3 = new Delta({"ops":[{"insert":"\n\n\n","attributes":{"table-col":{"width":150}}},{"insert":"1.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-fg27-1","row":"row-fg27","colspan":"1","rowspan":"1"}}},{"insert":"1.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-fg27-2","row":"row-fg27","colspan":"1","rowspan":"1"}}},{"insert":"1.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-fg27-3","row":"row-fg27","colspan":"1","rowspan":"1"}}},{"insert":"2.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-ifuh-1","row":"row-ifuh","colspan":"1","rowspan":"1"}}},{"insert":"2.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-ifuh-2","row":"row-ifuh","colspan":"1","rowspan":"1"}}},{"insert":"2.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-ifuh-3","row":"row-ifuh","colspan":"1","rowspan":"1"}}},{"insert":"3.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-bc1e-1","row":"row-bc1e","colspan":"1","rowspan":"1"}}},{"insert":"3.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-bc1e-2","row":"row-bc1e","colspan":"1","rowspan":"1"}}},{"insert":"3.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-bc1e-3","row":"row-bc1e","colspan":"1","rowspan":"1"}}},{"insert":"\n"},{"insert":"\n\n\n","attributes":{"table-col":{"width":150}}},{"insert":"1.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-22gt-1","row":"row-22gt","colspan":"1","rowspan":"1"}}},{"insert":"1.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-22gt-2","row":"row-22gt","colspan":"1","rowspan":"1"},"align":"center"}},{"insert":"1.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-22gt-3","row":"row-22gt","colspan":"1","rowspan":"1"},"align":"right"}},{"insert":"2.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-rboe-1","row":"row-rboe","colspan":"1","rowspan":"1"}}},{"insert":"2.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-rboe-2","row":"row-rboe","colspan":"1","rowspan":"1"},"align":"center"}},{"insert":"2.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-rboe-3","row":"row-rboe","colspan":"1","rowspan":"1"},"align":"right"}},{"insert":"3.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-poe7-1","row":"row-poe7","colspan":"1","rowspan":"1"}}},{"insert":"3.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-poe7-2","row":"row-poe7","colspan":"1","rowspan":"1"},"align":"center"}},{"insert":"3.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-poe7-3","row":"row-poe7","colspan":"1","rowspan":"1"},"align":"right"}},{"insert":"\n"},{"insert":"\n\n\n","attributes":{"table-col":{"width":150}}},{"insert":"1."},{"attributes":{"bold":true},"insert":"1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-icuc-1","row":"row-icuc","colspan":"1","rowspan":"1"}}},{"insert":"1.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-icuc-2","row":"row-icuc","colspan":"1","rowspan":"1"}}},{"insert":"1.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-icuc-3","row":"row-icuc","colspan":"1","rowspan":"1"}}},{"insert":"2.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-ctzo-1","row":"row-ctzo","colspan":"1","rowspan":"1"}}},{"insert":"2.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-ctzo-2","row":"row-ctzo","colspan":"1","rowspan":"1"}}},{"insert":"2.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-ctzo-3","row":"row-ctzo","colspan":"1","rowspan":"1"}}},{"insert":"3.1"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-whe3-1","row":"row-whe3","colspan":"1","rowspan":"1"}}},{"insert":"3.2"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-whe3-2","row":"row-whe3","colspan":"1","rowspan":"1"}}},{"insert":"3.3"},{"insert":"\n","attributes":{"table-cell-line":{"cell":"row-whe3-3","row":"row-whe3","colspan":"1","rowspan":"1"}}}]})

const testDelta3 = new Delta(
  {"ops":[{"insert":"first line\n"},{"attributes":{"table-col":{"width":"150"}},"insert":"\n\n\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-exw3i2","cell":"cell-rff5rf"},"row":"row-exw3i2","cell":"cell-rff5rf","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-exw3i2","cell":"cell-fyxuz5"},"row":"row-exw3i2","cell":"cell-fyxuz5","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-exw3i2","cell":"cell-5cr5vc"},"row":"row-exw3i2","cell":"cell-5cr5vc","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-u6aqdg","cell":"cell-r4yphs"},"row":"row-u6aqdg","cell":"cell-r4yphs","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-u6aqdg","cell":"cell-nb3dv9"},"row":"row-u6aqdg","cell":"cell-nb3dv9","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-u6aqdg","cell":"cell-69thjk"},"row":"row-u6aqdg","cell":"cell-69thjk","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-qf1u7u","cell":"cell-stvkkb"},"row":"row-qf1u7u","cell":"cell-stvkkb","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-qf1u7u","cell":"cell-9f4kco"},"row":"row-qf1u7u","cell":"cell-9f4kco","rowspan":"1","colspan":"1"},"insert":"\n"},{"attributes":{"table-cell-line":{"rowspan":"1","colspan":"1","row":"row-qf1u7u","cell":"cell-kyzc76"},"row":"row-qf1u7u","cell":"cell-kyzc76","rowspan":"1","colspan":"1"},"insert":"\n"},{"insert":"second line\ncode block"},{"attributes":{"code-block":"plain"},"insert":"\n"},{"insert":"code block"},{"attributes":{"code-block":"plain"},"insert":"\n"},{"insert":"third line\n"}]}
)

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'unchecked' }, { 'list': 'toggled' }, { 'list': 'none' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
]

window.onload = () => {
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions,
      dragDropBlocks: {
        anchorOffsetLeft: () => 1,
        anchorAlignCenter: () => true,
        dragStartCallback: (e, draggingBlot) => console.log(draggingBlot)
      },
      table: {
        tableTools: {
          zIndex: 100
        }
      }
    }
  })

  const config = {
    app: 'quilljs',
    username: (Math.random() * 1000).toFixed(0),
    autoStart: true,
    showUI: false,
    showCursor: true,
    cursorAlwaysOn: true,
    editor: quill,
    docId: 'id'
  };
  const codox = new Codox();
  codox.start(config);

  quill.on('text-change', (newDelta, oldContents, source) => {
    console.log(newDelta)
  })

  window.quill = quill
  // test parse old table delta to new
  quill.setContents(tableDeltaParser(testDelta3))

  const tableModule = quill.getModule('table')

  document.querySelector('#insert-table')
    .addEventListener('click', () => {
      tableModule.insertTable(3, 3)
    }, false)

  document.querySelector('#get-delta')
    .addEventListener('click', () => {
      console.log(quill.getContents())
    }, false)

  document.getElementById('import-tables')
    .addEventListener('click', () => {
      const index = quill.getLength();
      const [line] = quill.getLine(index - 1)
      const lineFormats = line.formats()

      quill.updateContents(
        new Delta().retain(index - 1).insert('\n', lineFormats).concat(tableDeltaParser(oldTableDelta3).delete(1).insert('\n')),
        Quill.sources.USER
      )
    }, false)
}
