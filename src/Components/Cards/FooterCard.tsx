import { FC } from "react";
import { COPYRIGHT_TEXT, FOOTER_LINKS } from "../../Constants/Common.ts";

import { useNavigate } from "react-router-dom";
import Typography from "../Typography/Typography.tsx";
import { IPublicLayout } from "../Layouts/PublicLayout.tsx";

interface IPublicFooter extends IPublicLayout {}

const FooterCard: FC<IPublicFooter> = (props) => {
  const {} = props;
  const navigate = useNavigate();

  const PageNavigate = (path: string) => () => navigate(path);
  return (
    <footer className="globel-footer tablet:flex-row tablet:items-start sticky">
      <ul className="globel-footer-links">
        {FOOTER_LINKS.map((item, key) => (
          <li
            className="globel-footer-links-item cursor-pointer text-secondary-50"
            key={key}
          >
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
          </li>
        ))}
        <div className="footer-copyright">
          <Typography
            variant={"body"}
            size={"medium"}
            nodeProps={{ onClick: () => {} }}
            className={"text-secondary-50"}
          >
            {COPYRIGHT_TEXT}
          </Typography>
        </div>
      </ul>
    </footer>
    // <footer className="responsiveContainer flex justify-between flex-col gap-2 items-center tablet:flex-row tablet:items-start sticky top-[100vh]">
    //         <Typography variant="label" size="large" component="h5" className="text-secondary-50 text-center">{FOOTER_TEXT}</Typography>
    //         <div className="flex flex-row gap-2 flex-wrap items-center justify-center">
    //             {FOOTER_LINKS.map((item, key) => (
    //                 <Typography component="h5" variant={"body"} size={"medium"} nodeProps={{ onClick: PageNavigate(item.path)}} className={"cursor-pointer text-secondary-50"} key={key}>{item.title}</Typography>
    //             ))}
    //             <Typography variant={"body"} size={"medium"} nodeProps={{ onClick: () => {}}} className={"text-secondary-50"}>{COPYRIGHT_TEXT}</Typography>
    //         </div>
    //     </footer>
  );
};
export default FooterCard;
