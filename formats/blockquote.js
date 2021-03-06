import Quill from '../core/quill';
import Block from '../blots/block';
import Container from '../blots/container';

import {
  CELL_IDENTITY_KEYS,
  CELL_ATTRIBUTES,
  ListBlockWrapper,
  SUPPORTED_LIST_TYPES,
} from '../modules/clickup-table/formats';

const IN_LIST = 'in-list';
const WRAPPER_INDENT = 'wrapper-indent';

export class BlockquoteContainer extends Container {
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
BlockquoteContainer.blotName = 'blockquote-container';
BlockquoteContainer.className = 'ql-blockquote-container';
BlockquoteContainer.tagName = 'DIV';

class Blockquote extends Block {
  static register() {
    Quill.register(BlockquoteContainer);
    ListBlockWrapper.addAllowChildren(BlockquoteContainer);
  }

  static create(value) {
    if (typeof value !== 'object') {
      value = { blockquote: value };
    }

    const node = super.create(value);
    CELL_IDENTITY_KEYS.concat(CELL_ATTRIBUTES).forEach(key => {
      if (value[key]) node.setAttribute(`data-${key}`, value[key]);
    });

    if (value[IN_LIST]) {
      node.setAttribute(
        `data-${IN_LIST}`,
        SUPPORTED_LIST_TYPES.indexOf(value[IN_LIST]) >= 0
          ? value[IN_LIST]
          : 'none',
      );
    }

    if (value[WRAPPER_INDENT]) {
      node.setAttribute(`data-${WRAPPER_INDENT}`, value[WRAPPER_INDENT]);
    }

    return node;
  }

  static formats(domNode) {
    const formats = {};
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

  optimize(context) {
    const formats = Blockquote.formats(this.domNode);
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
}
Blockquote.blotName = 'blockquote';
Blockquote.tagName = 'blockquote';

BlockquoteContainer.allowedChildren = [Blockquote];
Blockquote.requiredContainer = BlockquoteContainer;

export default Blockquote;
