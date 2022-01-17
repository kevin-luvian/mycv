import { DomElement } from "htmlparser2";
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import { cnord } from "./utils";
import { Basic } from "../component/button/Button";
import { Heading } from "../component/texts/Heading";
import { Tips } from "../component/texts/InfoBar";

export const parse = (s) => {
  try {
    const parsed = ReactHtmlParser(s, { transform });
    return parsed;
  } catch (err) {
    return <p> error, cant parse html content </p>;
  }
};

/**
 * @param {DomElement} node
 */
const transform = (node, index) => {
  node.attribs = cnord(node.attribs, {});
  const props = {
    key: index,
    className: node.attribs["class"],
  };
  switch (node.name) {
    case "primary-button":
      return <Basic.Default {...props} children={convCH(node, index)} />;
    case "heading":
      return <Heading {...props} children={convCH(node, index)} />;
    case "tips":
      return <Tips {...props} children={convCH(node, index)} />;
  }
  return convertNodeToElement(node, index, transform);
};

/**
 * @param {DomElement} node
 */
const convCH = (node, index) =>
  node.children?.map((e) => convertNodeToElement(e, index + 1, transform)) ||
  [];
