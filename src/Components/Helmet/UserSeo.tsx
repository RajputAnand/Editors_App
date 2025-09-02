import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { TITLE } from "../../Constants/Common.ts";

interface IUserSeo {
  data: any;
}

const UserSeo: FC<IUserSeo> = (props) => {
  const { data } = props;

  const pageTitle = `${data?.data?.name} | ${TITLE}`;
  const pageDescription = data?.data?.bio;
  const pageUrl = window.location.href;
  const profileImage = data?.data?.profile_image;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={profileImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={profileImage} />
    </Helmet>
  );
};

export default UserSeo;
