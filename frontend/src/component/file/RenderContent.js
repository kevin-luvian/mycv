const RenderContent = ({ contentType, src }) => {
  if (contentType.includes("image")) {
    return (
      <div className="w-100 text-center mb-2">
        <img src={src} alt="" />
      </div>
    );
  } else if (contentType.includes("video")) {
    return <ResponsivePlayer className="mt-3" source={src} />;
  } else {
    return <span />;
  }
};
