import { DomElement } from "htmlparser2";
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import { cnord, simpleID } from "./utils";
import { Basic } from "../component/button/Button";
import { Heading } from "../component/texts/Heading";
import { Tips } from "../component/texts/InfoBar";
import { ParserError, ParserWrapper } from "../component/texts/ParserWrapper";
import { Link } from "react-router-dom";
import CustomPlayer from "../component/videoplayer/CustomPlayer";
import { PreCode } from "../component/texts/PreCode";
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
const transform = (node, _ = null) => {
  const index = simpleID();
  node.attribs = cnord(node.attribs, {});
  const props = {
    className: node.attribs["class"],
  };
  switch (node.name) {
    case "primary-button":
      return <Basic.Default {...props} key={index} children={convCH(node)} />;
    case "heading":
      return <Heading {...props} key={index} children={convCH(node)} />;
    case "tips":
      return <Tips {...props} key={index} children={convCH(node)} />;
    case "pre-code":
      return (
        <PreCode
          label={node.attribs["label"]}
          {...props}
          key={index}
          children={convCH(node)}
        />
      );
    case "links":
      return (
        <Link
          {...props}
          key={index}
          to={node.attribs["to"] ? node.attribs["to"] : "#"}
          children={convCH(node, index)}
        />
      );
    case "custom-player":
      return (
        <CustomPlayer
          {...props}
          key={index}
          source={node.attribs["source"] ?? ""}
        />
      );
  }
  return convertNodeToElement(node, index, transform);
};

/**
 * @param {DomElement} node
 */
const convCH = (node) => node.children?.map((e) => transform(e)) || [];
