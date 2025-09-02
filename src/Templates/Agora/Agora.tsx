import {createContext, FC, ReactNode, useContext} from "react";
import {ICameraVideoTrack, IMicrophoneAudioTrack} from "agora-rtc-react";

interface AgoraContextType {
    localCameraTrack: ICameraVideoTrack | null;
    localMicrophoneTrack: IMicrophoneAudioTrack | null;
    children: ReactNode;
}

// Create the Agora context
const AgoraContext = createContext<AgoraContextType | null>(null);

// AgoraProvider component to provide the Agora context to its children
export const AgoraProvider: FC<AgoraContextType> = ({ children, localCameraTrack, localMicrophoneTrack }) => {
    return (
            <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack, children }}>
                {children}
            </AgoraContext.Provider>
    );
}

// Custom hook to access the Agora context
export const useAgoraContext = () => {
    const context = useContext(AgoraContext);
    if (!context) throw new Error("useAgoraContext must be used within an AgoraProvider");
    return context;
};