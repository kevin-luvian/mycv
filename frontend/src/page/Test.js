import { Fragment } from "react";
import { PreCode } from "../component/texts/PreCode";

export const Page = () => {
  document.title = "Test - Test Page";

  return (
    <Fragment>
      <PreCode className="">{`
      dependencies:
        flutter:
          sdk: flutter
        responsive_framework: ^0.1.4
      `}</PreCode>
    </Fragment>
  );
};

export default Page;
