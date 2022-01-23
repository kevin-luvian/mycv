import { Fragment } from "react";
import { useStore, useDispatch } from "../store/CacheStore";
import CustomPlayer from "../component/videoplayer/CustomPlayer";
import { ImageCarousel } from "../component/carousel/Carousel";

const url =
  "https://kevinlh.herokuapp.com/api/file/61e9e6d567268300160ce0d4/VID-20211102-WA0012.mp4";

export const Page = () => {
  document.title = "Test - Test Page";

  const store = useStore();
  const dispatch = useDispatch();
  return (
    <Fragment>
      <CustomPlayer source={url} />
      <ImageCarousel
        urls={[
          url,
          "https://kevinlh.herokuapp.com/api/file/61e9e54267268300160ce096/Exodia.png",
        ]}
        className="mt-3"
      />
    </Fragment>
  );
};

export default Page;
