const config: configType = {
    uid: 0,
    appId: "",
    channelName: "",
    rtcToken: "",
};

export type configType = {
    uid: string | number;
    appId: string;
    channelName: string;
    rtcToken: string | null;
};

export default config;