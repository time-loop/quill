/**
 * getEventComposedPath
 *  compatibility fixed for Event.path/Event.composedPath
 *  Event.path is only for chrome/opera
 *  Event.composedPath is for Safari, FF
 *  Neither for Micro Edge
 * @param {Event} evt
 * @return {Array} an array of event.path
 */
export function getEventComposedPath(evt) {
  let path;
  // chrome, opera, safari, firefox
  path = evt.path || (evt.composedPath && evt.composedPath());

  // other: edge
  if (!path && evt.target) {
    path = [];
    let { target } = evt;
    path.push(target);

    while (target && target.parentNode) {
      target = target.parentNode;
      path.push(target);
    }
  }

  return path;
}

export function css(domNode, rules) {
  if (typeof rules === 'object') {
    Object.keys(rules).forEach(key => {
      if (rules[key]) {
        domNode.style[key] = rules[key];
      }
    });
  }
}
