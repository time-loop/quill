import Quill from './core';

import { AlignClass, AlignStyle } from './formats/align';
import {
  DirectionAttribute,
  DirectionClass,
  DirectionStyle,
} from './formats/direction';
import {
  voidDetectAttribute
} from './formats/void-detect.js';
import {
  BlockIdentityAttribute
} from './formats/block-id';
import Indent from './formats/indent';

import Blockquote from './formats/blockquote';
import Header from './formats/header';
// clickup: remove 
// import List from './modules/clickup-list/list';

import { BackgroundClass, BackgroundStyle } from './formats/background';
import { ColorClass, ColorStyle } from './formats/color';
import { FontClass, FontStyle } from './formats/font';
import { SizeClass, SizeStyle } from './formats/size';

import Bold from './formats/bold';
import Italic from './formats/italic';
import Link from './formats/link';
import Script from './formats/script';
import Strike from './formats/strike';
import Underline from './formats/underline';

import Formula from './formats/formula';
import Image from './formats/image';
import Video from './formats/video';

import CodeBlock, { Code as InlineCode } from './formats/code';

import Syntax from './modules/syntax';
// clickup: replace the import path of table module to clickup-table
import Table from './modules/clickup-table/table';
import Toolbar from './modules/toolbar';
import DragDropBlocks from './modules/drag-drop-blocks/drag-drop-blocks';
import Storage from './modules/clickup-storage/storage';

import Icons from './ui/icons';
import Picker from './ui/picker';
import ColorPicker from './ui/color-picker';
import IconPicker from './ui/icon-picker';
import Tooltip from './ui/tooltip';

import BubbleTheme from './themes/bubble';
import SnowTheme from './themes/snow';

Quill.register(
  {
    'attributors/attribute/direction': DirectionAttribute,
    'attributors/attribute/void-detect': voidDetectAttribute,
    'attributors/attribute/block-id': BlockIdentityAttribute,

    'attributors/class/align': AlignClass,
    'attributors/class/background': BackgroundClass,
    'attributors/class/color': ColorClass,
    'attributors/class/direction': DirectionClass,
    'attributors/class/font': FontClass,
    'attributors/class/size': SizeClass,

    'attributors/style/align': AlignStyle,
    'attributors/style/background': BackgroundStyle,
    'attributors/style/color': ColorStyle,
    'attributors/style/direction': DirectionStyle,
    'attributors/style/font': FontStyle,
    'attributors/style/size': SizeStyle,
  },
  true,
);

Quill.register(
  {
    'formats/void-detect': voidDetectAttribute,
    'formats/block-id': BlockIdentityAttribute,
    'formats/align': AlignClass,
    'formats/direction': DirectionClass,
    'formats/indent': Indent,

    'formats/background': BackgroundStyle,
    'formats/color': ColorStyle,
    'formats/font': FontClass,
    'formats/size': SizeClass,

    'formats/blockquote': Blockquote,
    'formats/code-block': CodeBlock,
    'formats/header': Header,
    // remove quilljs built-in list
    // 'formats/list': List,

    'formats/bold': Bold,
    'formats/code': InlineCode,
    'formats/italic': Italic,
    'formats/link': Link,
    'formats/script': Script,
    'formats/strike': Strike,
    'formats/underline': Underline,

    'formats/formula': Formula,
    'formats/image': Image,
    'formats/video': Video,

    'modules/syntax': Syntax,
    // 'modules/table': Table,
    'modules/toolbar': Toolbar,
    'modules/dragDropBlocks': DragDropBlocks,
    'modules/storage': Storage,

    'themes/bubble': BubbleTheme,
    'themes/snow': SnowTheme,

    'ui/icons': Icons,
    'ui/picker': Picker,
    'ui/icon-picker': IconPicker,
    'ui/color-picker': ColorPicker,
    'ui/tooltip': Tooltip,
  },
  true,
);

export default Quill;
