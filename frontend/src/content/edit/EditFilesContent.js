import {
  useRef,
  Fragment,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import Button, { Basic as BtnBasic } from "../../component/button/Button";
import Notification from "../../component/notification/Notification";
import {
  TextInput,
  IconInput,
  SearchFilterInput,
} from "../../component/input/Inputs";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import { SimpleValidation } from "../../component/modal/Modal";
import {
  ColoredIcon,
  iconColors,
  icons,
} from "../../component/decoration/Icons";
import { Divider } from "../../component/decoration/TileBreaker";
import { btyeToKB, concat, KBToMB, parseByteToString } from "../../util/utils";
import styles from "./styles.module.scss";
import { Post, Delete, Put } from "../../axios/Axios";
import $ from "jquery";
import { useStore, useDispatch, updateFiles } from "../../store/CacheStore";
import ResponsivePlayer from "../../component/videoplayer/ResponsivePlayer";

const FileInput = ({ onUploaded }) => {
  const [upload, setUpload] = useState({
    loading: false,
    success: false,
    time: 0,
  });
  const [file, setFile] = useState(undefined);
  const [fileUrl, setFileUrl] = useState(undefined);
  const [filename, setFilename] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    if (file?.type.includes("image")) setFileUrl(URL.createObjectURL(file));
    else setFileUrl(undefined);
  }, [file]);

  const hiddenInput = useRef();

  const getUploadTimeStr = (time, success) => {
    if (time == 0) return "";
    const seconds = (time / 1000).toFixed(1);
    return concat(
      `took ${seconds}s`,
      success ? "to upload." : ", upload failed."
    );
  };

  const changeFile = (event) => {
    setFile(event.target.files[0]);
    setFilename(event.target.files[0].name);
    resetUpload();
  };
  const triggerInput = () => hiddenInput.current.click();
  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const headers = { filename, group };
      let time = Date.now();
      setUpload({ ...upload, loading: true });
      const res = await Post("/file", formData, { headers });
      if (res.success) {
        onUploaded();
        time = Date.now() - time;
      }
      res.notify();
      setUpload({ success: res.success, loading: false, time: time });
    } else {
      Notification.create("no file is selected", Notification.type.warning);
    }
  };
  const clear = () => {
    setFile(undefined);
    setFileUrl(undefined);
    setFilename("");
    setGroup("");
    resetUpload();
  };

  const resetUpload = () => {
    setUpload({
      success: false,
      loading: false,
      time: 0,
    });
  };

  return (
    <Fragment>
      <div className={styles.fileInput}>
        <div className={styles.form}>
          <div className="col-8 col-lg-9 pl-0">
            <IconInput
              className="mb-0"
              label="file"
              value={filename}
              onChange={setFilename}
              onClick={triggerInput}
              icon={FindInPageIcon}
            />
          </div>
          <div className="col-4 col-lg-3 pr-0 my-auto">
            <Button
              loading={upload.loading}
              className="w-100"
              onClick={uploadFile}
            >
              submit
            </Button>
          </div>
          <input
            ref={hiddenInput}
            className="d-none"
            type="file"
            onChange={changeFile}
          />
        </div>
        {file && (
          <Fragment>
            <div className={concat(styles.form, "mt-3")}>
              <div className="col-8 col-lg-9 pl-0">
                <TextInput
                  className="mb-0"
                  label="group"
                  value={group}
                  onChange={setGroup}
                />
              </div>
              <div className="col-4 col-lg-3 pr-0 my-auto">
                <BtnBasic.Danger className="w-100" onClick={clear}>
                  clear
                </BtnBasic.Danger>
              </div>
            </div>
            {fileUrl && (
              <div className="text-center">
                <img src={fileUrl} alt="file" />
              </div>
            )}
            <p className="mt-3">type: {file.type}</p>
            <p>size: {parseByteToString(file.size)}</p>
            <p>
              {upload.time > 0 && getUploadTimeStr(upload.time, upload.success)}
            </p>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export const EditFileModal = forwardRef(
  ({ id, filename, group, onChange }, ref) => {
    const [mFilename, setFilename] = useState(filename);
    const [mGroup, setGroup] = useState(group);
    const modalRef = useRef();

    useImperativeHandle(ref, () => ({
      open() {
        openModal();
      },
    }));

    const update = async () => {
      Notification.create(`updating file ${mFilename}`);
      const data = { filename: mFilename, group: mGroup };
      const res = await Put("/file/" + id, data);
      if (res.success) {
        onChange();
        Notification.create(`${mFilename} updated`, Notification.type.success);
        modalRef.current.close();
      } else {
        Notification.create(res.message, Notification.type.danger);
      }
    };

    const openModal = () => {
      modalRef.current.open();
      setFilename(filename);
      setGroup(group);
    };

    return (
      <SimpleValidation
        title="Edit file metadata"
        ref={modalRef}
        onContinue={update}
      >
        <TextInput label="filename" value={mFilename} onChange={setFilename} />
        <TextInput label="group" value={mGroup} onChange={setGroup} />
      </SimpleValidation>
    );
  }
);

const composeServerFile = ({
  _id,
  filename,
  contentType,
  size,
  uploadDate,
  url,
  group,
}) => {
  return { _id, filename, contentType, size, uploadDate, url, group };
};

const FileElement = ({ nameSearch, className, file, onChange }) => {
  const [open, setOpen] = useState(false);
  const cFile = useCallback(() => composeServerFile(file), [file]);

  const deleteModalRef = useRef();
  const editModalRef = useRef();
  const contentRef = useRef();

  useEffect(
    () =>
      open
        ? $(contentRef.current).slideDown()
        : $(contentRef.current).slideUp(),
    [open]
  );

  const showThis = useCallback(
    () =>
      cFile()
        .filename.toLowerCase()
        .includes(nameSearch?.toLowerCase() ?? ""),
    [cFile, nameSearch]
  );

  const deleteFile = async () => {
    const res = await Delete("/file/" + cFile()._id);
    if (res.success) {
      Notification.create(res.message, Notification.type.success);
      onChange();
      setOpen(false);
    } else {
      Notification.create(res.message, Notification.type.danger);
    }
  };

  const downloadFile = () => window.open(cFile().url, "_blank");

  return (
    <Fragment>
      {showThis() && (
        <div className={concat(styles.fileElement, styles.fadeAnim, className)}>
          <SimpleValidation ref={deleteModalRef} onContinue={deleteFile} />
          <EditFileModal
            ref={editModalRef}
            id={cFile()._id}
            filename={cFile().filename}
            group={cFile().group}
            onChange={onChange}
          />
          <div className={styles.header}>
            <div className={styles.title}>
              <p>{cFile().filename}</p>
            </div>
            <div className={styles.actions}>
              <ColoredIcon
                color={iconColors.warning}
                icon={icons.edit}
                onClick={() => editModalRef.current.open()}
              />
              <ColoredIcon
                color={iconColors.primary}
                icon={icons.download}
                onClick={downloadFile}
              />
              <ColoredIcon
                color={iconColors.danger}
                icon={icons.delete}
                onClick={() => deleteModalRef.current.open()}
              />
              <ColoredIcon
                className={concat(styles.expand, open ? styles.rotated : "")}
                color={iconColors.default}
                icon={icons.arrowDown}
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <div className={styles.content} ref={contentRef}>
            {cFile().contentType.includes("image") && (
              <div className="w-100 text-center mb-2">
                <img src={open ? cFile().url : ""} alt="" />
              </div>
            )}
            {cFile().contentType.includes("video") && (
              <ResponsivePlayer className="mt-3" source={cFile().url} />
            )}
            <div className={styles.contentDesc}>
              <p>group: {cFile().group}</p>
              <p>type: {cFile().contentType}</p>
              <p>size: {parseByteToString(cFile().size)}</p>
              <p>upload date: {cFile().uploadDate}</p>
              <Divider className="mt-3 mb-2" />
              <p style={{ overflowWrap: "break-word" }}>{cFile().url}</p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const Page = () => {
  const [search, setSearch] = useState("");

  const store = useStore();
  const dispatch = useDispatch();

  useEffect(() => updateFiles(store, dispatch), [store, dispatch]);

  const reupdate = async () => updateFiles(store, dispatch, true);

  return (
    <Fragment>
      <h2 className="mb-4">Edit Files</h2>
      <FileInput onUploaded={reupdate} />
      <SearchFilterInput
        placeholder="Search Files"
        className="my-3 col-8 p-0 ml-auto"
        onEnter={(val) => setSearch(val)}
      />
      {store.files?.value?.map((file, index) => (
        <FileElement
          key={index}
          nameSearch={search}
          className="mb-2"
          file={file}
          onChange={reupdate}
        />
      ))}
    </Fragment>
  );
};

export default Page;
