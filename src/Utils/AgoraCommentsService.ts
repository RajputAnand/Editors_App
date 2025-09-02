import { RtmClient, RtmChannel } from "agora-rtm-sdk";

let rtmClient: RtmClient | null = null;
let rtmChannel: RtmChannel | null = null;

export const initializeRtm = async (appId: string, channelName: string, userId: string) => {
  rtmClient = await AgoraRTM.createInstance(appId);

  await rtmClient.login({ uid: userId });

  rtmChannel = rtmClient.createChannel(channelName);
  await rtmChannel.join();

  return { rtmClient, rtmChannel };
};

export const sendMessage = async (message: string) => {
  if (rtmChannel) {
    await rtmChannel.sendMessage({ text: message });
  }
};

export const subscribeToMessages = (callback: (message: string, userId: string) => void) => {
  if (rtmChannel) {
    rtmChannel.on("ChannelMessage", (message, memberId) => {
      callback(message.text, memberId);
    });
  }
};

export const leaveRtmChannel = async () => {
  if (rtmChannel) {
    await rtmChannel.leave();
  }
  if (rtmClient) {
    await rtmClient.logout();
  }
};
