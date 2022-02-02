import { Fragment } from "react";
import { PreCodeHighlight } from "../component/texts/PreCodeHightlight";

export const Page = () => {
  document.title = "Test - Test Page";

  return (
    <Fragment>
      <PreCodeHighlight
        label="super_hightlight.js"
        language="javascript"
      >{`import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
const Component = () => {
  const codeString = '(num) => num + 1';
  return (
    <SyntaxHighlighter language="javascript" style={docco}>
      {codeString}
    </SyntaxHighlighter>
  );
};`}</PreCodeHighlight>
    </Fragment>
  );
};

export default Page;
