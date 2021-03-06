import Delta from 'quill-delta';
import { ClassAttributor, Scope } from 'parchment';
import Inline from '../blots/inline';
import Quill from '../core/quill';
import Module from '../core/module';
import { blockDelta } from '../blots/block';
import BreakBlot from '../blots/break';
import CursorBlot from '../blots/cursor';
import TextBlot, { escapeText } from '../blots/text';
import CodeBlock, { CodeBlockContainer } from '../formats/code';
import { traverse } from './clipboard';

import {
  CELL_IDENTITY_KEYS,
  CELL_ATTRIBUTES,
  ListBlockWrapper,
  SUPPORTED_LIST_TYPES,
} from './clickup-table/formats';

const IN_LIST = 'in-list';
const WRAPPER_INDENT = 'wrapper-indent';

const TokenAttributor = new ClassAttributor('code-token', 'hljs', {
  scope: Scope.INLINE,
});
class CodeToken extends Inline {
  static formats(node, scroll) {
    while (node != null && node !== scroll.domNode) {
      if (node.classList && node.classList.contains(CodeBlock.className)) {
        return super.formats(node, scroll);
      }
      node = node.parentNode;
    }
    return undefined;
  }

  constructor(scroll, domNode, value) {
    super(scroll, domNode, value);
    TokenAttributor.add(this.domNode, value);
  }

  format(format, value) {
    if (format !== CodeToken.blotName) {
      super.format(format, value);
    } else if (value) {
      TokenAttributor.add(this.domNode, value);
    } else {
      TokenAttributor.remove(this.domNode);
      this.domNode.classList.remove(this.statics.className);
    }
  }

  optimize(...args) {
    super.optimize(...args);
    if (!TokenAttributor.value(this.domNode)) {
      this.unwrap();
    }
  }
}
CodeToken.blotName = 'code-token';
CodeToken.className = 'ql-token';

class SyntaxCodeBlock extends CodeBlock {
  static create(value) {
    if (typeof value === 'string') {
      value = { [SyntaxCodeBlock.blotName]: value };
    }

    const domNode = super.create(value);

    if (typeof value[SyntaxCodeBlock.blotName] === 'string') {
      domNode.setAttribute('data-language', value[SyntaxCodeBlock.blotName]);
    }

    CELL_IDENTITY_KEYS.concat(CELL_ATTRIBUTES).forEach(key => {
      if (value[key]) {
        domNode.setAttribute(`data-${key}`, value[key]);
      }
    });

    if (value[IN_LIST]) {
      domNode.setAttribute(
        `data-${IN_LIST}`,
        SUPPORTED_LIST_TYPES.indexOf(value[IN_LIST]) >= 0
          ? value[IN_LIST]
          : 'none',
      );
    }

    if (value[WRAPPER_INDENT]) {
      domNode.setAttribute(`data-${WRAPPER_INDENT}`, value[WRAPPER_INDENT]);
    }

    return domNode;
  }

  static formats(domNode) {
    const formats = {};
    if (domNode.hasAttribute('data-language')) {
      formats[SyntaxCodeBlock.blotName] =
        domNode.getAttribute('data-language') || 'plain';
    }

    return CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS)
      .concat([IN_LIST, WRAPPER_INDENT])
      .reduce((result, attribute) => {
        if (domNode.hasAttribute(`data-${attribute}`)) {
          result[attribute] =
            domNode.getAttribute(`data-${attribute}`) || undefined;
        }
        return result;
      }, formats);
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('data-language', value);
    } else {
      super.format(name, value);
    }
  }

  optimize(context) {
    const formats = SyntaxCodeBlock.formats(this.domNode);
    const { row, cell, rowspan, colspan } = formats;
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row,
        cell,
        colspan,
        rowspan,
        [IN_LIST]: formats[IN_LIST],
        [WRAPPER_INDENT]: formats[WRAPPER_INDENT],
      });
    }

    super.optimize(context);
  }

  replaceWith(name, value) {
    this.formatAt(0, this.length(), CodeToken.blotName, false);
    return super.replaceWith(name, value);
  }
}

class SyntaxCodeBlockContainer extends CodeBlockContainer {
  static create(value) {
    const node = super.create(value);

    CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).forEach(attrName => {
      if (value[attrName]) {
        node.setAttribute(`data-${attrName}`, value[attrName]);
      }
    });

    if (value[IN_LIST]) {
      node.setAttribute(`data-${IN_LIST}`, 'true');
    }

    if (value[WRAPPER_INDENT]) {
      node.setAttribute(`data-${WRAPPER_INDENT}`, value[WRAPPER_INDENT]);
    }

    return node;
  }

  attach() {
    super.attach();
    this.forceNext = false;
    this.scroll.emitMount(this);
  }

  format(name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
      this.children.forEach(child => {
        child.format(name, value);
      });
    }
  }

  formatAt(index, length, name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.forceNext = true;
    }
    super.formatAt(index, length, name, value);
  }

  highlight(highlight, forced = false) {
    if (this.children.head == null) return;
    const nodes = Array.from(this.domNode.childNodes).filter(
      node => node !== this.uiNode,
    );
    const text = `${nodes.map(node => node.textContent).join('\n')}\n`;
    const language = SyntaxCodeBlock.formats(this.children.head.domNode)[
      SyntaxCodeBlock.blotName
    ];
    if (forced || this.forceNext || this.cachedText !== text) {
      if (text.trim().length > 0 || this.cachedText == null) {
        const oldDelta = this.children.reduce((delta, child) => {
          return delta.concat(blockDelta(child, false));
        }, new Delta());
        const delta = highlight(text, language);
        oldDelta.diff(delta).reduce((index, { retain, attributes }) => {
          // Should be all retains
          if (!retain) return index;
          if (attributes) {
            Object.keys(attributes).forEach(format => {
              if (
                [SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)
              ) {
                this.formatAt(index, retain, format, attributes[format]);
              }
            });
          }
          return index + retain;
        }, 0);
      }
      this.cachedText = text;
      this.forceNext = false;
    }
  }

  optimize(context) {
    const formats = this.getFormats();
    const { row, cell, rowspan, colspan } = formats;
    if (formats[IN_LIST] && !(this.parent instanceof ListBlockWrapper)) {
      this.wrap(ListBlockWrapper.blotName, {
        row,
        cell,
        colspan,
        rowspan,
        list: 'none',
        [WRAPPER_INDENT]: formats[WRAPPER_INDENT],
      });
    }

    super.optimize(context);
    if (
      this.parent != null &&
      this.children.head != null &&
      this.uiNode != null
    ) {
      const language = SyntaxCodeBlock.formats(this.children.head.domNode)[
        SyntaxCodeBlock.blotName
      ];
      if (language !== this.uiNode.value) {
        this.uiNode.value = language;
      }
    }
  }

  getFormats() {
    const formats = {};
    return CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS)
      .concat([IN_LIST, WRAPPER_INDENT])
      .reduce((result, attribute) => {
        if (this.domNode.hasAttribute(`data-${attribute}`)) {
          result[attribute] =
            this.domNode.getAttribute(`data-${attribute}`) || undefined;
        }
        return result;
      }, formats);
  }
}
SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, CursorBlot, TextBlot, BreakBlot];

class Syntax extends Module {
  static register() {
    Quill.register(CodeToken, true);
    Quill.register(SyntaxCodeBlock, true);
    Quill.register(SyntaxCodeBlockContainer, true);
    ListBlockWrapper.addAllowChildren(SyntaxCodeBlockContainer);
  }

  constructor(quill, options) {
    super(quill, options);
    if (this.options.hljs == null) {
      throw new Error(
        'Syntax module requires highlight.js. Please include the library on the page before Quill.',
      );
    }
    this.languages = this.options.languages.reduce((memo, { key }) => {
      memo[key] = true;
      return memo;
    }, {});
    this.highlightBlot = this.highlightBlot.bind(this);
    this.initListener();
    this.initTimer();
  }

  initListener() {
    this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, blot => {
      if (!(blot instanceof SyntaxCodeBlockContainer)) return;
      const select = this.quill.root.ownerDocument.createElement('select');
      this.options.languages.forEach(({ key, label }) => {
        const option = select.ownerDocument.createElement('option');
        option.textContent = label;
        option.setAttribute('value', key);
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        blot.format(SyntaxCodeBlock.blotName, select.value);
        this.quill.root.focus(); // Prevent scrolling
        this.highlight(blot, true);
      });
      if (blot.uiNode == null) {
        blot.attachUI(select);
        if (blot.children.head) {
          select.value = SyntaxCodeBlock.formats(blot.children.head.domNode)[
            SyntaxCodeBlock.blotName
          ];
        }
      }
    });
  }

  initTimer() {
    let timer = null;
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.highlight();
        timer = null;
      }, this.options.interval);
    });
  }

  highlight(blot = null, force = false) {
    if (this.quill.selection.composing) return;
    this.quill.update(Quill.sources.USER);
    const range = this.quill.getSelection();
    const blots =
      blot == null
        ? this.quill.scroll.descendants(SyntaxCodeBlockContainer)
        : [blot];
    blots.forEach(container => {
      container.highlight(this.highlightBlot, force);
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }

  highlightBlot(text, language = 'plain') {
    language = this.languages[language] ? language : 'plain';
    if (language === 'plain') {
      return escapeText(text)
        .split('\n')
        .reduce((delta, line, i) => {
          if (i !== 0) {
            delta.insert('\n', { [CodeBlock.blotName]: language });
          }
          return delta.insert(line);
        }, new Delta());
    }
    const container = this.quill.root.ownerDocument.createElement('div');
    container.classList.add(CodeBlock.className);
    container.innerHTML = this.options.hljs.highlight(language, text).value;
    return traverse(
      this.quill.scroll,
      container,
      [
        (node, delta) => {
          const value = TokenAttributor.value(node);
          if (value) {
            return delta.compose(
              new Delta().retain(delta.length(), {
                [CodeToken.blotName]: value,
              }),
            );
          }
          return delta;
        },
      ],
      [
        (node, delta) => {
          return node.data.split('\n').reduce((memo, nodeText, i) => {
            if (i !== 0) memo.insert('\n', { [CodeBlock.blotName]: language });
            return memo.insert(nodeText);
          }, delta);
        },
      ],
      new WeakMap(),
    );
  }
}
Syntax.DEFAULTS = {
  hljs: (() => {
    return window.hljs;
  })(),
  interval: 1000,
  languages: [
    { key: 'plain', label: 'Plain' },
    { key: 'bash', label: 'Bash' },
    { key: 'cpp', label: 'C++' },
    { key: 'cs', label: 'C#' },
    { key: 'css', label: 'CSS' },
    { key: 'diff', label: 'Diff' },
    { key: 'xml', label: 'HTML/XML' },
    { key: 'java', label: 'Java' },
    { key: 'javascript', label: 'Javascript' },
    { key: 'markdown', label: 'Markdown' },
    { key: 'php', label: 'PHP' },
    { key: 'python', label: 'Python' },
    { key: 'ruby', label: 'Ruby' },
    { key: 'sql', label: 'SQL' },
  ],
};

export { SyntaxCodeBlock as CodeBlock, CodeToken, Syntax as default };
