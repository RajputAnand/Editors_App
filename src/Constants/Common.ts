//Site Details
import { PathConstants } from "../Router/PathConstants.ts";

const isDev = import.meta.env.VITE_DEV === "true";

export const TITLE = "EditorsApp";
// export const RE_SHARE_LINK ="https://be.editorsapp.com/post/redirect/:id?type=:type";
export const RE_SHARE_NETWORK_LINK = isDev
  ? "https://api-editorsapp.voicene.com/network/redirect/:id"
  : "https://be.editorsapp.com/network/redirect/:id";

export const RE_SHARE_LINK = isDev
  ? "https://api-editorsapp.voicene.com/post/redirect/:id?type=:type"
  : "https://be.editorsapp.com/post/redirect/:id?type=:type";

export const LIVE_SHARE_LINK = `${window.origin}${PathConstants.LiveJoin}`;
// export const LIVE_SHARE_LINK = `http://localhost:5173/${PathConstants.LiveJoin}`;

export const PLAY_STORE_APP_LINK =
  "https://play.google.com/store/apps/details?id=com.editorsapp.editorsapp";
export const FOOTER_TEXT =
  "editorsapp.com, all its subdomains, including names are owned and operated by Netxup Inc.";
export const COPYRIGHT_TEXT = `©${new Date().getFullYear()} EditorsApp`;
export const FOOTER_LINKS: Array<{ title: string; path: string }> = [
  {
    title: "Our Concept",
    path: PathConstants.OurConcept,
  },
  {
    title: "Privacy Policy",
    path: PathConstants.PrivacyPolicy,
  },
  {
    title: "Terms & Condition",
    path: PathConstants.TermsOfService,
  },
  {
    title: "Our Ads Policy",
    path: PathConstants.OurAdsPolicy,
  },
];

export const OTP_RESEND_TIME = 60;

//Images
export const LOGO = "Assets/Images/Logo.png";

export const COMMON_MESSAGE = "Oops! Something went wrong.";

export const LOGIN_MESSAGE = "Successfully Logged In";

export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export const DashboardMenus = [
  {
    title: "Home",
    icon: "Home",
    path: PathConstants.Home,
    iconProps: { fill: false },
  },
  {
    title: "Live",
    icon: "mic",
    path: PathConstants.Live,
    iconProps: { fill: false },
  },
  {
    title: "Add post",
    icon: "add_circle",
    path: PathConstants.AddPost,
    iconProps: { fill: false },
  },
  {
    title: "Updates",
    icon: "updates_custom_icon",
    path: PathConstants.Updates,
    iconProps: { fill: false },
  },
  {
    title: "Networks",
    icon: "networks_custom_icon",
    path: PathConstants.Networks,
    iconProps: { fill: false },
  },
  {
    title: "Chat",
    icon: "message",
    path: PathConstants.Messages,
    iconProps: { fill: false },
  },
  {
    title: "Profile",
    icon: "person_2",
    path: PathConstants.Profile,
    iconProps: { fill: false },
  },
];
export const NetworkMenus = [
  {
    title: "Feeds",
    icon: "feeds_icon",
    active: "feeds",
    iconProps: { fill: false },
  },
  {
    title: "Discover",
    icon: "discover_icon",
    active: "discover",
    iconProps: { fill: false },
  },
  {
    title: "Your Networks",
    icon: "network_icon",
    active: "networks",
    iconProps: { fill: false },
  },
];
export const ProfilePopoverMenu = [
  { title: "Edit profile", path: PathConstants.EditProfile },
  { title: "ID verification", path: PathConstants.IDverification },
  { title: "Change password", path: PathConstants.ChangePassword },
  { title: "Settings", path: PathConstants.Settings },
];

export const ShareButtons = [
  {
    title: "WhatsApp",
    icon: "Assets/Images/WhatsApp.png",
    link: " https://wa.me/?text=YOUR_URL_HERE",
  },
  {
    title: "Facebook",
    icon: "Assets/Images/Facebook.png",
    link: "https://www.facebook.com/sharer/sharer.php?u=YOUR_URL_HERE",
  },
  {
    title: "X",
    icon: "Assets/Images/X.png",
    link: "https://twitter.com/intent/tweet?url=YOUR_URL_HERE&text=",
  },
];

export const WhoCanAdmireMe = [
  { label: "Everyone", value: 0 },
  { label: "People I Admire", value: 1 },
];

export const ApproveAdmireRequest = [
  { label: "Yes", value: 0 },
  { label: "No", value: 1 },
];

export const PermissionDropDown = [
  { label: "Everyone", value: 0 },
  { label: "People I Admire", value: 1 },
  { label: "Only me", value: 2 },
];
export const PermissionAdmireDropDown = [
  { label: "Everyone", value: 0 },
  { label: "People I Admire", value: 1 },
  { label: "Only me", value: 2 },
  { label: "Only My Admirers", value: 3 },
];
export const DeleteData = [
  { value: 1, label: "I no longer need this account" },
  {
    value: 2,
    label: "I experienced data breach/security issue with my account",
  },
  { value: 3, label: "My account is hacked" },
  {
    value: 4,
    label: "EditorsApp platform is inefficient/doesn't work as expected",
  },
  { value: 5, label: "Other" },
];
export const ReportData = [
  { id: 1, value: "Sexual content" },
  { id: 2, value: "Violent or repulsive content" },
  { id: 3, value: "Hateful or abusive content" },
  { id: 4, value: "Harmful or dangerous acts" },
  { id: 5, value: "Spam or misleading" },
  { id: 6, value: "Child abuse" },
];
