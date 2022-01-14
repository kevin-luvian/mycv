import { DomElement } from "htmlparser2";
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import { cnord, concat } from "./utils";
import styles from "./styles.module.scss";

export const parse = (s) => {
  try {
    const parsed = ReactHtmlParser(s, {
      transform: transformButton
    });
    console.log(parsed);
    return parsed;
  } catch (err) {
    return <p> error, cant parse html content </p>
  }
}

/**
 * @param {DomElement} node 
 */
const transform = (node, index) => {
  transformButton(node);
  return convertNodeToElement(node, index, transform);
}

/**
 * @param {DomElement} node
 */
const transformButton = (node) => {
  node.attribs = cnord(node.attribs, {});
  switch (node.name) {
    case "primary-button":
      node.name = "button";
      node.attribs["class"] = concat(node.attribs["class"], styles.btn, styles.primary);
      break;
  }
}