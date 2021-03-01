import { css } from './utils';

const TOOLTIP_HEIGHT = 24;
const trangleSize = 4;

export default class TableTooltip {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.tooltip = null;
  }

  show(target, content) {
    if (this.tooltip) {
      this.hide();
    }

    this.tooltip = this.quill.addContainer('ql-table-tooltip');
    this.tooltip.innerHTML = content || this.options.content || '';

    const parent = this.quill.root.parentNode;
    const containerRect = parent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    css(this.tooltip, {
      height: `${TOOLTIP_HEIGHT}px`,
      lineHeight: `${TOOLTIP_HEIGHT}px`,
      left: `${targetRect.left -
        containerRect.left +
        parent.scrollLeft +
        targetRect.width / 2}px`,
      top: `${targetRect.top -
        containerRect.top +
        parent.scrollTop -
        TOOLTIP_HEIGHT -
        trangleSize * 2}px`,
      zIndex: `${this.options.zIndex || 101}`,
    });
  }

  hide() {
    this.tooltip && this.tooltip.remove();
    this.tooltip = null;
  }
}
