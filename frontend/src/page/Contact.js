import { Fragment, useState, useEffect } from "react";
import { useStore, useDispatch, updateCache } from "../store/CacheStore";
import { Get } from "../axios/Axios";
import { Banner } from "../component/decoration/Text";
import { FunCardBorderless } from "../component/card/FunCard";
import ContentPadding from "./extra/ContentPadding";
import Loader from "../component/loader/hash";

const fetchFunction = (url) => async () => {
  const res = await Get(url);
  res.notify();
  return res.data;
};

const Page = () => {
  document.title = "View My Contact";

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => {
    updateCache(store, dispatch, "contact", fetchFunction("/contact"))
      .then(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const contacts = store.contact?.value ?? [];
    if (contacts.length === 0)
      setLoading(true);
    setContacts(contacts);
  }, [store]);

  return (
    <Fragment>
      <Banner title="Contact" className="mb-3" />
      {loading ? <Loader /> :
        <ContentPadding className="mt-5">
          {contacts?.map((c, i) => (
            <FunCardBorderless
              key={i}
              icon={c.icon}
              title={c.title}
              description={c.description}
            />
          ))}
        </ContentPadding>
      }
    </Fragment>
  );
};

export default Page;
