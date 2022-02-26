import { DomElement } from "htmlparser2";
import ReactHtmlParser, { convertNodeToElement } from "react-html-parser";
import { cnord, simpleID, splitStr } from "./utils";
import { Basic } from "../component/button/Button";
import { Heading } from "../component/texts/Heading";
import { Tips } from "../component/texts/InfoBar";
import { ParserError, ParserWrapper } from "../component/texts/ParserWrapper";
import { Link } from "react-router-dom";
import CustomPlayer from "../component/videoplayer/CustomPlayer";
import { PreCodeHighlight } from "../component/texts/PreCodeHightlight";
import envs from "./envs";
import { ImageCarousel } from "../component/carousel/Carousel";

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

const baseFileURL = envs.API_URL + "/file";

/**
 * @param {String} s
 */
const modifyRawHTML = (s) => {
  s = s.replace("#_url", window.location.host);
  s = s.replace(/#_file/g, baseFileURL);
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
    case "carousel": {
      const images = splitStr(node.attribs["images"], ",").map(
        (s) => `${baseFileURL}/${s}/img.png`
      );
      let urls = JSON.parse(cnord(node.attribs["urls"], "[]"));
      urls = [...urls, ...images];
      return (
        <ImageCarousel
          urls={urls}
          height={node.attribs["height"]}
          {...props}
          key={index}
        />
      );
    }
    case "pre-code":
      return (
        <PreCodeHighlight
          label={node.attribs["label"]}
          language={node.attribs["language"]}
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
          height={node.attribs["height"]}
          source={node.attribs["source"] ?? ""}
          {...props}
          key={index}
        />
      );
  }
  return convertNodeToElement(node, index, transform);
};

/**
 * @param {DomElement} node
 */
const convCH = (node) => node.children?.map((e) => transform(e)) || [];
