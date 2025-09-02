import { FC } from "react";
import Typography from "../../Typography/Typography.tsx";
import {
  COPYRIGHT_TEXT,
  FOOTER_LINKS,
  FOOTER_TEXT,
} from "../../../Constants/Common.ts";
import { IPublicLayout } from "../PublicLayout.tsx";
import { useNavigate } from "react-router-dom";

interface IPublicFooter extends IPublicLayout {}

const PublicFooter: FC<IPublicFooter> = (props) => {
  const {} = props;
  const navigate = useNavigate();

  const PageNavigate = (path: string) => () => navigate(path);

  return (
    <footer className="responsiveContainer flex justify-between flex-col gap-2 items-center tablet:flex-row tablet:items-start top-[100vh] sticky bottom-0">
      {/*  */}
      <Typography
        variant="label"
        size="large"
        component="h5"
        className="text-secondary-50 text-center"
      >
        {FOOTER_TEXT}
      </Typography>
      <div className="flex flex-row gap-2 flex-wrap items-center justify-center">
        {FOOTER_LINKS.map((item, key) => (
          <Typography
            component="h5"
            variant={"body"}
            size={"medium"}
            nodeProps={{ onClick: PageNavigate(item.path) }}
            className={"cursor-pointer text-secondary-50"}
            key={key}
          >
            {item.title}
          </Typography>
        ))}
        <Typography
          variant={"body"}
          size={"medium"}
          nodeProps={{ onClick: () => {} }}
          className={"text-secondary-50"}
        >
          {COPYRIGHT_TEXT}
        </Typography>
      </div>
    </footer>
  );
};

export default PublicFooter;
