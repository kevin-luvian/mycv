import { Fragment, useEffect, useState } from 'react';
import { useStore, useDispatch, updateFiles } from "../store/CacheStore";
import { ImageCarousel } from "../component/carousel/Carousel";

export const Page = () => {
    const [urls, setUrls] = useState([]);
    document.title = "Test - Test Page";

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => updateFiles(store, dispatch), [store, dispatch]);

    useEffect(() => {
        const imageFiles = store.files?.value?.filter(f => f.contentType?.includes("image")) ?? [];
        setUrls(imageFiles.map(f => f.url));
    }, [store.files]);

    return (
        <Fragment>
            <ImageCarousel urls={[
                "http://localhost:9000/api/file/6052c37d5504a52ac91f6052/Bwaaawasa.png",
                "http://localhost:9000/api/file/60572ec1a4b828505ebd895d/The%20Hobbit.jpg",
                "http://localhost:9000/api/file/6054620f7d881d1008498dff/favicon.ico",
                "http://localhost:9000/api/file/60572ec1a4b828505ebd895d/The%20Hobbit.jpg"
            ]} />
            <p>the files:</p>
            {urls.map((url, i) => <p key={i}>{url}</p>)}
        </Fragment>
    );
}

export default Page;