import { FC } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";

const TermsOfServicePage: FC<IWithRouter> = (props) => {
  const {} = props;
  return (
    <div className="my-4 mx-8 pb-4">
      <Typography
        variant="display"
        size="small"
        className="text-center !font-medium mb-4"
      >
        Our Concept (About)
      </Typography>
      <Typography variant="body" size="large">
        EditorsApp is a Social Networking Platform that allows users to give
        Updates on current events from around the world, network with
        (like-minded) people, share career opportunities, make public
        announcements, post videos, News releases, write short articles, discuss
        current affairs and comment on ongoing issues. In brief, EditorsApp
        provides resources that let users post responsible messages online. We
        take pride in making available a user-friendly platform that simplifies
        communications and inspire individuals to post, rebroadcast/share
        messages responsibly, and ensuring messages devoid of accuracy are
        discouraged on the internet.
      </Typography>
      <Typography variant="headline" size="small" className="my-4 !font-medium">
        Terms & Conditions of Service
      </Typography>
      <div className="tablet:ml-8">
        <Typography variant="body" size="large" className="mb-4">
               These terms & conditions govern the use of our app, website, its
          subdomains, special features, applications and interactive software.
          Collectively referred to as services, operated by Netxup, Inc. Please,
          note that throughout the textual description, the terms "we" "us" and
          "our" may often refer to Netxup Inc, while "you" "yours" "they" or
          "their" refers to the users of the EditorsApp, its domain
          (www.editorsapp.com) and all sub-domains. These terms of services
          constitute a binding agreement between Netxup, Inc and you, the users
          of EditorsApp.
        </Typography>
        <Typography variant="body" size="large">
          Aforementioned services allow users to create, manage and maintain
          profiles, post Updates, messages, new developments, write & publish
          short articles, comment, give News releases, upload videos, accept
          Admirers’ requests, Admire other users and Rebroadcast posts to other
          social platforms. Our platform accords every user an unrestrained
          option: whether to make elements of their profile private or public,
          accept or decline invitations, admit Admirers or others to Admiring
          (that is following) their page, making certain information about
          themselves public, private or available to certain users. These
          features are available in the profile's settings.
        </Typography>
      </div>
      <Typography variant="headline" size="small" className="my-4 !font-medium">
        Special Features:
      </Typography>
      <ul className="list-disc mx-5 my-4">
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>PROFILE PAGE: </b>
            This feature allows users to create self-described profiles that
            represent their true personality and give exact descriptions of what
            they want people to see, view, and know about when anyone searches
            their username or given name on our platform.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>POST LOG: </b>
            This tool exists to help users locate their posts in order they were
            posted, making it easier to identify and view previously posted
            messages/uploaded videos on their timeline.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>HOME PAGE: </b>
            This feature provides users the opportunity to see latest Updates,
            posts from friends, community or any user you are Admiring (that is,
            following) their page.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>Go Live: </b>
            This feature enables users to connect with their audience via live
            streaming videos, interact with their Admirers, friends, or
            colleagues.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>Add-Post: </b>
            This simply refers to the button that lets our users post messages,
            or upload videos onto our platform. The message is conveyed to the
            public.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>ADMIRERS: </b>
            This feature is designed specifically to enhance online digital
            capability. The service is partly developed for prospective
            entrepreneurs to promote and extend their social networks: It
            enables users to keep track of the numbers of people they have
            capability of reaching at once. For example, if you are promoting a
            product/brand, the magnitude of your reach is determined by the
            number of your Admirers (similar to followers). The Admirer service
            is created to facilitate, enhance, and promote Digital Networking.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>ADMIRING: </b>
            This feature allows users to receive messages, posts, or uploaded
            videos or Updates regularly from other users. In addition, users
            will be able to tag other users they are Admiring (following).
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>CHECK MARK (✓): </b>
            This feature exists to sustain means of legitimacy. Its appearance
            along a profile name verifies (in a limited manner) the user’s
            account.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>REBROADCAST: </b>
            This element is specifically designed to enable users to re-share
            content from our platform to another site
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>LIKE BUTTON: </b>
            This feature indicates a post receives favorable reviews
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>POST BUTTON: </b>
            It enables users to post messages on the platform
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>USERNAME: </b>
            This feature assigns unique identification to every user, which
            differentiate one user from one another.
          </Typography>
        </li>
        <li>
          <Typography variant="body" size="large" className="mb-4">
            <b>REMARK: </b>
            This element is designed to enable replies posted to an original
            post.
          </Typography>
        </li>
      </ul>
      <Typography variant="headline" size="small" className="my-4 !font-medium">
        ACCOUNT SETUP
      </Typography>
      <div className="tablet:ml-8">
        <Typography variant="body" size="large" className="mb-4">
          In order to access certain features and services, it may be necessary
          to create or maintain an account with EditorsApp, providing
          information that accurately matches your identity. This information is
          key to the creation, setting up your account and may be needed to
          reset your password in future. (For example, if you forget your
          password at a later time, you will need the information provided
          earlier to reset your password). You agree that the information
          provided during registration is accurate, complete, and current. You
          further acknowledge that if the information provided by you is
          inaccurate, misrepresenting and dishonest to mislead or to impersonate
          another person, your rights to continue accessing our services become
          void.
        </Typography>
      </div>
      <Typography variant="headline" size="small" className="my-4 !font-medium">
        CONTENT
      </Typography>
      <div className="tablet:ml-8">
        <Typography variant="body" size="large" className="mb-4">
          Any posts, images, animated files, texts, audios, videos, replies,
          graphic comments or plain comments, chats a user posts,
          rebroadcasts/shares, sends not limited to pictorial elements, adverts,
          write-ups, descriptive audios, links and other items bearing video
          contents, are not our properties (they are yours, we do not screen nor
          verify uploaded materials), and you do understand that other users and
          non-users may reuse, repost, rebroadcast/share through links, or
          transmit in remotely stored systems for a purpose we cannot envisage.
          By using our services to access any special designed features on our
          platform, you further consent that such posted, or uploaded materials
          (hereby referred to as CONTENT) may be used by a third party and will
          not impose any financial obligation upon us, or constitute any form of
          compensation, or impel any liability on our part. You are solely
          responsible for your posted, shared, Rebroadcasted or uploaded
          images/messages; you forfeit any rights associated with your contents
          and further absolve us of any financial burden that may arise from any
          litigation therein.
        </Typography>
        <Typography variant="body" size="large" className="mb-4">
          If you are creating an account on behalf of an entity, public/private
          organization or government or other legal institutions, you
          acknowledge that you have legal authority to act on their behalf.
        </Typography>
        <Typography variant="body" size="large" className="mb-4">
          Upon registration/login to use any of our services, you are agreed,
          consented and acknowledged to abide by our terms, and the conditions
          of service stated below:
        </Typography>
        <ul className="pl-4">
          <Typography variant="body" size="large" className="mb-4">
            <b>1.</b> You must be at least 16 years old (or with an adult
            consent) in order to create or set up an account to access our
            services.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>2.</b> You agree not to post, display, or share graphics
            depicting visual violence, or any form of violence into our
            platforms
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>3.</b>
            You agree not to post contents that inaugurate, or spread anything
            that exhibits illegality; illegality refers to any act prohibited or
            forbidden by law. You agree not to post contents that may impose
            criminal or civil liability on you.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>4.</b>
            You agree to refrain from engaging in any activity that may create
            or bear false impression, or deliberately mislead the public in
            order to promote a deceptive product or advance a cause designed to
            willfully obtain money under any false pretense. You agree not to
            give an appearance or impression different from the true nature of
            an event or a product.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>5.</b>
            You agree not to willfully use spam to disseminate bulk posts or
            transmit worms or Trojan horses with the sole intent of harming our
            services or other users.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>6.</b>
            You agree not to promote any activity that violates the rights of
            other users or illegally help supply copyrighted materials to anyone
            in our various platforms.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>7.</b>
            You agree to refrain from posting, sharing or uploading any contents
            aimed at manipulating other users, or use coded languages to pass
            communicative instructions to fellow users for the purpose of
            hurting themselves or inflicting mass injuries on the public.
          
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>8.</b>
            You must not attempt to willfully distribute viruses targeting our
            services or the services of other sites, or craftily initiate any
            malware for the purpose of hacking our services or the accounts of
            other users.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>9.</b>You agree not to promote, distribute or encourage hate
            speech, or misleading statements targeting any organization,
            government, individual or any group of people.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>10.</b>
            You agree not to post content that nurtures, or inspires any act
            encouraging child abuse on our platforms or use our services to
            create, Rebroadcast/share and distribute sexual images depicting
            children.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>11.</b>By using our services, you agree never to encourage animal
            cruelty or violence against any domesticated animal.
          </Typography>
          <Typography variant="body" size="large" className="mb-4">
            <b>12.</b>
            Once again, when setting up an account to use our various platforms,
            you agree not to willfully use the details of another person with
            the aim of impersonating or illegally misusing their identity.
          </Typography>
        </ul>
        <Typography variant="body" size="large" className="mb-4">
          You must adhere to the guidelines stated in this agreement; if you
          (the users of our platforms) cannot abide by the terms, do not use our
          services.
        </Typography>
        <Typography variant="body" size="large" className="mb-4">
          These terms & conditions constitute a binding agreement between
          Netxup, Inc. and you, (the users of our EditorsApp) and are subject to
          change. By using our services to access our (mobile app or websites
          collectively known as) platforms you are bound by this agreement and
          the terms & conditions stated therein. You further understand that any
          violation of the terms stated above renders your right to our various
          services void and absolves us of any legal, compensatory, and
          equitable remedy.
        </Typography>
        <Typography variant="body" size="large" className="mb-4">
          To report any violation, feedbacks and relevant information, please,
          provide full legal names and attention to:
        </Typography>
        <a
          href="mailto:support@editorsapp.net"
          className="bodyLarge text-primary underline"
        >
          support@editorsapp.net
        </a>
        <Typography variant="body" size="large" className="my-4">
          Netxup Inc (is a US based organization that) supports free expression
          and the rights of every earthly inhabitant to have access to the
          internet.
        </Typography>
      </div>
      <Typography
        variant="body"
        size="large"
        className="mb-4 !italic text-secondary-light"
      >
        EditorsApp, all its subdomains, logos, and names are owned and operated
        by Netxup Inc.
      </Typography>
      <Typography variant="body" size="large" className="!italic">
        Copyright © 2019-{new Date().getFullYear()} Netxup Inc. All right
        reserved.
      </Typography>
      <Typography variant="body" size="large" className="!italic">
        Netxup, Inc. 5711 Hillcroft St, Suite A1A, Houston, TX 77036, USA.
      </Typography>
      <Typography variant="body" size="large" className="!italic">
      Updated April 2023.
      </Typography>
    </div>
  );
};

export default TermsOfServicePage;
