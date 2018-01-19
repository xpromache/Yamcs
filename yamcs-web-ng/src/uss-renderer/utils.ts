import { Color } from './Color';

/**
 * Searches the given node for a direct child with the specified name.
 *
 * @throws when no such child was found
 */
export function findChild(parentNode: Node, childNodeName: string) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      return child;
    }
  }

  throw new Error(`No child node named ${childNodeName} could be found`);
}

export function hasChild(parentNode: Node, childNodeName: string) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      return true;
    }
  }
  return false;
}

/**
 * Searches the given node for all direct children with the specified name.
 * If this name is undefined, all children will be included in the result
 * array.
 */
export function findChildren(parentNode: Node, childNodeName?: string) {
  const matchingChildren = [];
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeType !== 3) { // Ignore text or whitespace
      if (!childNodeName || (child.nodeName === childNodeName)) {
        matchingChildren.push(child);
      }
    }
  }
  return matchingChildren;
}

/**
 * Parses the child node contents of the given parent node as a string.
 *
 * @throws when no such child was found and defaultValue was undefined
 */
export function parseStringChild(parentNode: Node, childNodeName: string, defaultValue?: string) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      if (child.textContent !== null) {
        return child.textContent;
      }
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  } else {
    throw new Error(`No child node named ${childNodeName} could be found`);
  }
}

/**
 * Parses the child node contents of the given parent node as an integer.
 *
 * @throws when no such child was found and defaultValue was undefined.
 */
export function parseIntChild(parentNode: Node, childNodeName: string, defaultValue?: number) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      if (child.textContent !== null) {
        return parseInt(child.textContent, 10);
      }
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  } else {
    throw new Error(`No child node named ${childNodeName} could be found`);
  }
}

/**
 * Parses the child node contents of the given parent node as a float.
 *
 * @throws when no such child was found and defaultValue was undefined.
 */
export function parseFloatChild(parentNode: Node, childNodeName: string, defaultValue?: number) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      if (child.textContent !== null) {
        return parseFloat(child.textContent);
      }
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  } else {
    throw new Error(`No child node named ${childNodeName} could be found`);
  }
}

/**
 * Parses the child node contents of the given parent node as a boolean.
 *
 * @throws when no such child was found and defaultValue was undefined.
 */
export function parseBooleanChild(parentNode: Node, childNodeName: string, defaultValue?: boolean) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      return child.textContent === 'true';
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  } else {
    throw new Error(`No child node named ${childNodeName} could be found`);
  }
}

/**
 * Parses the child node contents of the given parent node as a color.
 *
 * @throws when no such child was found and defaultValue was undefined.
 */
export function parseColorChild(parentNode: Node, childNodeName: string, defaultValue?: Color) {
  for (let i = 0; i < parentNode.childNodes.length; i++) {
    const child = parentNode.childNodes[i];
    if (child.nodeName === childNodeName) {
      return parseColorNode(child);
    }
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  } else {
    throw new Error(`No child node named ${childNodeName} could be found`);
  }
}

export function parseColorNode(node: Node) {
  const r = parseFloatChild(node, 'red');
  const g = parseFloatChild(node, 'green');
  const b = parseFloatChild(node, 'blue');
  const a = parseFloatChild(node, 'alpha');
  return new Color(r, g, b, a);
}

export function parseFillStyle(node: Node) {
  const fillStyleNode = findChild(node, 'FillStyle');
  const pattern = parseStringChild(fillStyleNode, 'Pattern');
  return {
    fill: parseColorChild(fillStyleNode, 'Color'),
    'fill-opacity': (pattern.toLowerCase() === 'solid') ? 1 : 0,
  };
}

export function parseDrawStyle(node: Node) {
  const drawStyleNode = findChild(node, 'DrawStyle');
  const pattern = parseStringChild(drawStyleNode, 'Pattern');
  return {
    stroke: parseColorChild(drawStyleNode, 'Color'),
    'stroke-opacity': (pattern.toLowerCase() === 'solid') ? 1 : 0,
    'stroke-width': parseStringChild(drawStyleNode, 'Width'),
  };
}

export function parseTextStyle(e: Node) {
  const style: { [key: string]: any } = {
    fill: parseColorChild(e, 'Color'),
    'font-size': parseStringChild(e, 'Fontsize'),
    'font-family': parseStringChild(e, 'Fontname'),
  };

  // This is the most common Font, however since it is not
  // available on most browsers, default to any other monospace.
  if (style['font-family'] === 'Lucida Sans Typewriter') {
    style['font-family'] = 'Lucida Sans Typewriter, monospace';
  }
  if (parseBooleanChild(e, 'IsBold', false)) {
    style['font-weight'] = 'bold';
  }
  if (parseBooleanChild(e, 'IsItalic', false)) {
    style['font-style'] = 'italic';
  }
  if (parseBooleanChild(e, 'IsUnderlined', false)) {
    style['text-decoration'] = 'underline';
  }

  return style;
}

export function parseStringAttribute(node: Node, attributeName: string) {
  const attr = node.attributes.getNamedItem(attributeName);
  if (attr === null) {
    throw new Error(`No attribute named ${attributeName}`);
  } else {
    return attr.textContent || '';
  }
}

export function parseBooleanAttribute(node: Node, attributeName: string) {
  const attr = node.attributes.getNamedItem(attributeName);
  if (attr === null) {
    throw new Error(`No attribute named ${attributeName}`);
  } else {
    return attr.textContent === 'true';
  }
}

export function getReferencedElement(node: Node) {
  let e = node;

  const reference = parseStringAttribute(e, 'reference');
  for (const token of reference.split('/')) {
    if (token === '..') {
      if (!e.parentNode) {
        throw new Error('No such parent');
      }
      e = e.parentNode;
    } else {
      let idx = 0;
      const k = token.indexOf('[');
      let nodeName = token;
      if (k !== -1) {
        const idxStr = token.substring(k + 1, token.indexOf(']', k));
        idx = parseInt(idxStr, 10) - 1;
        nodeName = token.substring(0, k);
      }
      e = findChildren(e, nodeName)[idx];
    }
  }
  return e;
}
