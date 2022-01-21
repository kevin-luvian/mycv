import { Fragment } from "react";
import { useStore, useDispatch } from "../store/CacheStore";
import CustomPlayer from "../component/videoplayer/CustomPlayer";

export const Page = () => {
  document.title = "Test - Test Page";

  const store = useStore();
  const dispatch = useDispatch();
  return (
    <Fragment>
      <CustomPlayer source="http://kevinlh.herokuapp.com/api/file/61e9e6d567268300160ce0d4/VID-20211102-WA0012.mp4" />
    </Fragment>
  );
};

export default Page;
