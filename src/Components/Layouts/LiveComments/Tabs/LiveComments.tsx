import { FC, useEffect, useRef, useState } from "react"
import { MaterialSymbol } from "react-material-symbols"
import { useUserDetais, Agora } from "../../../../Hooks/useMessage.tsx"
import { configType } from "../../../../Pages/Dashboard/Live/config.ts";
import AgoraRTM, { RtmChannel } from "agora-rtm-sdk";
import LiveCommentCard from "../../../Cards/LiveCommentCard.tsx";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useMutationQuery } from "../../../../Api/QueryHooks/useMutationQuery.tsx";
import { Endpoints } from "../../../../Api/Endpoints.ts";

interface ILiveComments {
  liveId: string;
  config: configType
}

const LiveComments: FC<ILiveComments> = (props) => {
  const { config } = props;
  const { user } = useUserDetais(Number(config.uid))
  const { generateAgoraToken } = Agora()
  const { mutate, data } = generateAgoraToken()
  const [isAuthDataLoaded, setIsAuthDataLoaded] = useState<boolean>(false)
  const [authData, setAuthData] = useState<any>(null)
  const [message, setMessage] = useState<string>("");
  const [comments, setComments] = useState<{ id:string; username: string; text: string; time: string }[]>([]);
  const [rtmClient, setRtmClient] = useState<any>(null);
  const [rtmChannel, setRtmChannel] = useState<RtmChannel | null>(null);
  const [isEmojiPickerVisible,setEmojiPickerVisible] = useState<boolean>(false)
  const commentsContainerRef = useRef(null);

  const { data: tokenData, mutate: generateTokenMutate } = useMutationQuery({
    mutationKey: [Endpoints.GenerateRtmToken, "POST"]
  })

  const appKey = import.meta.env.VITE_AGORA_APP_ID;
  const userId = authData?.data?.agora_username;
  const userToken = authData?.data?.agora_bearer_token;
  const chatRoomId = config?.channelName;
  const rtmToken = tokenData?.data?.agora_rtm_token;

  console.error(rtmToken,chatRoomId);

  useEffect(() => {
    generateTokenMutate({
      user_id: config.uid,
      token_expire: 3600
    })
  },[])

  useEffect(() => {
    if (data && data?.data && data?.data?.agora_username) {
      setAuthData(data)
      setIsAuthDataLoaded(true)
    }
  }, [data]);

  useEffect(() => {
    mutate({})
  }, [userId]);

  useEffect(() => {
    const initializeRTM = async () => {
      try {
        console.log("Initializing RTM...");
        const client = AgoraRTM.createInstance(appKey);
        console.log("Client created successfully.");

        await client.login({ uid: String(Date.now()), token: userToken });
        console.log("Logged in successfully.");

        const channel = client.createChannel(chatRoomId);
        await channel.join();
        console.log("Joined channel successfully.");

        channel.removeAllListeners("ChannelMessage");

        setRtmClient(client);
        setRtmChannel(channel);

        // Listen for messages
        channel.on("ChannelMessage", (message, senderId) => {
          console.log(`Message received from ${senderId}:`, message);
          const { text, userName,id } = JSON.parse(message.text || "");
          const timestamp = new Date().toString();
          setComments((prevComments) => {
            // Check if the comment already exists
            if (!prevComments.some(comment => comment.id === id)) {
              return [
                ...prevComments,
                {
                  username: userName || "UserName",
                  text: text || "",
                  time: timestamp,
                  id: id
                },
              ]
            }
            return prevComments
          })
        });
        console.log("RTM initialized and joined channel");
      } catch (error) {
        console.error("RTM Initialization failed:", error);
      }
    };

    initializeRTM();

    // Cleanup on unmount
    return () => {
      rtmChannel?.leave();
      rtmClient?.logout();
    };
  }, [isAuthDataLoaded, userId]);
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: commentsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comments]);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji)
  }
  
  const sendMessage = async () => {
    if (message.trim() && rtmChannel) {
      try {
        const userName = user?.data?.user_name || "UserName"; // Default to "Anonymous" if username is undefined
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        const messagePayload = JSON.stringify({
          text: message,
          userName: userName,
          id:id
        });

        await rtmChannel.sendMessage({ text: messagePayload });
        // setComments((prevComments) => [
        //   ...prevComments,
        //   { username: user?.data?.user_name || "Me", text: message, time: timestamp },
        // ]);
        setMessage("");// Clear the input field
      } catch (error) {
        console.error("Message send failed:", error);
      }
    }
  };
  const renderInput = () => {
    return (
      <div className="flex items-center gap-2">
        <div className='w-[5%] flex items-center justify-center relative'>
          <MaterialSymbol
            className={`text-gray-500 text-center !text-[1.7rem] cursor-pointer`}
            icon={"mood"}
            onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
          />
          {isEmojiPickerVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded max-w-screen-lg max-h-screen overflow-y-auto">
                <div className="flex justify-end">
                  <button
                    className="bg-gray-100 hover:text-red-500 text-red-300 text-5xl w-8 h-8 mb-2 flex items-center justify-center"
                    onClick={() => setEmojiPickerVisible(false)}
                  >&times;
                  </button>
                </div>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </div>
          )}
        </div>
        <div className="w-[88%]">
          <input
            value={message}
            type="text"
            placeholder="Enter your comment"
            className="h-12 w-full outline-1 outline-blue-400 rounded-md border border-gray-300"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>
        <div onClick={sendMessage} className={`${message?.length > 0 ? "cursor-pointer bg-blue-700" : "bg-gray-400 cursor-not-allowed"} rounded-full `} >
          <MaterialSymbol
            className='text-white text-center !text-[1.7rem] m-1'
            icon={"send"}
            fill
          />
        </div>
      </div>
    )
  }
  return (
    <div className="h-[20em]">
      <div ref={commentsContainerRef} className="h-[85%] overflow-y-auto">
        {comments.map((comment, index) => (
          <div key={index} className="p-1">
            <LiveCommentCard comment={comment} />
          </div>
        ))}
      </div>
      {renderInput()}
    </div>
  )
}

export default LiveComments