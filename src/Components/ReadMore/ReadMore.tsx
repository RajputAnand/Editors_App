import { FC, Fragment, useState } from "react";
import Typography from "../Typography/Typography.tsx";
import { PathConstants } from "../../Router/PathConstants.ts";
import { useNavigate, useLocation } from "react-router-dom";
interface IReadMore {
  text: string;
  count: number;
}

const ReadMore: FC<IReadMore> = (props) => {
  const [readMore, setReadMore] = useState<boolean>(false);
  const { text, count } = props;
  const handleReadMore = () => setReadMore((_) => !_);
  const renderContent = () => {
    const _text = text.replaceLinksWithAHashTag();

    if (_text.length > count) {
      if (readMore) return _text.split("\n")[0].replaceLinksInTextWithATags?.();
    }
    return _text?.replaceLinksInTextWithATags?.();
  };

  return (
    <Fragment>
      <Typography
        variant="body"
        size="large"
        className="text-black htmlContents break-words whitespace-pre-line anchortagtext"
        component="p"
        nodeProps={{ dangerouslySetInnerHTML: { __html: renderContent() } }}
      />
      {text.length > count && text.split("\n")?.length > 1 && (
        <span className="text-primary cursor-pointer" onClick={handleReadMore}>
          Read {readMore ? "More" : "Less"} ...
        </span>
      )}
    </Fragment>
  );
};

export default ReadMore;
