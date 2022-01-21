import { DomElement } from "htmlparser2";
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import { cnord } from "./utils";
import { Basic } from "../component/button/Button";
import { Heading } from "../component/texts/Heading";
import { Tips } from "../component/texts/InfoBar";
import { ParserError, ParserWrapper } from "../component/texts/ParserWrapper";
import { Link } from "react-router-dom";
import CustomPlayer from "../component/videoplayer/CustomPlayer";
/**
 * @param {String} html
 */
export const parse = (html) => {
  try {
    return (
      <ParserWrapper>
        {ReactHtmlParser(modifyRawHTML(html), { transform })}
      </ParserWrapper>
    );
  } catch (err) {
    return (
      <ParserError>
        error, cant parse html content <br className="mb-3" /> {err.message}
      </ParserError>
    );
  }
};

/**
 * @param {String} s
 */
const modifyRawHTML = (s) => {
  s = s.replace("#_url", window.location.host);
  return s;
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
    case "links":
      return (
        <Link
          {...props}
          to={node.attribs["to"] ?? "#"}
          children={convCH(node, index)}
        />
      );
    case "custom-player":
      return <CustomPlayer source={node.attribs["source"] ?? ""} />;
  }
  return convertNodeToElement(node, index, transform);
};

/**
 * @param {DomElement} node
 */
const convCH = (node, index) =>
  node.children?.map((e, i) => transform(e, index + i)) || [];
