import { FC, useState, useEffect, useRef } from "react"
import { MaterialSymbol } from "react-material-symbols"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AC, { AgoraChat } from "agora-chat"
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import MessageCard from "./MessageCard.tsx"
import Avatar from "../Avatar/Avatar.tsx"
import { useUserDetais, Agora } from "../../Hooks/useMessage.tsx"
import { GetUserOnlineStatus } from "../../Utils/GetUserOnlineStatus.ts"
import { Endpoints } from "../../Api/Endpoints.ts"
import DeleteConfirm from "../Modal/DeleteConfirm.tsx"
import Typography from "../Typography/Typography.tsx"
import toast from "react-hot-toast"

const conn = new AC.connection({
    appKey: import.meta.env.VITE_AGORA_APP_KEY
}), formatDate = (date: Date) => {
    if (isToday(date))
        return 'Today'
    else if (isYesterday(date))
        return 'Yesterday'
    else
        return format(date, 'EEEE, MMMM d, yyyy')
}

interface MsgLogEntry {
    isReceived: boolean
    message: any
    type: string
    data: any | null
}

interface IMessageUserCard {
    userId?: any
    apiToken: string
}

const MessageUserCard: FC<IMessageUserCard> = (props) => {
    const { userId, apiToken } = props,
        AuthData = useSelector((state: any) => state.AuthData),
        { user } = useUserDetais(userId),
        { generateAgoraToken } = Agora(),
        { mutate, data } = generateAgoraToken(),
        navigate = useNavigate(),
        [isAuthDataLoaded, setIsAuthDataLoaded] = useState<boolean>(false),
        [authData, setAuthData] = useState<any>(null),
        [peerMessage, setPeerMessage] = useState<string>(''),
        [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false),
        [selectedFiles, setSelectedFiles] = useState<File[]>([]),
        [filePreviews, setFilePreviews] = useState<string[]>([]),
        [is3dotPopupVisible, setIs3dotPopupVisible] = useState<boolean>(false),
        [isSearchTermInputVisible, setIsSearchTermInputVisible] = useState<boolean>(false),
        [searchTerm, setSearchTerm] = useState<string>(''),
        [isPopupVisible, setIsPopupVisible] = useState<boolean>(false),
        [isRecording, setIsRecording] = useState(false),
        [time, setTime] = useState(0),
        [audioURL, setAudioURL] = useState<string | null>(null),
        [voiceMsgAudioFile, setVoiceMsgAudioFile] = useState<File | null>(null),
        [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null),
        [isAudioPopupVisible, setIsAudioPopupVisible] = useState(false),
        [unReadCount, setUnReadCount] = useState<number>(0),
        [logDetail, setLogDetail] = useState<MsgLogEntry[]>([]),
        [historyLogDetail, setHistoryLogDetail] = useState<MsgLogEntry[]>([]),
        [historyLogDetailBackUp, setHistoryLogDetailBackUp] = useState<MsgLogEntry[]>([]),
        [cursor, setCursor] = useState<string | undefined>(undefined),
        [deleteModal, setDeleteModal] = useState<boolean>(false),
        [blockModal, setBlockModal] = useState<boolean>(false),
        scrollRef = useRef<HTMLDivElement | null>(null),
        inputSearchTermRef = useRef<HTMLInputElement | null>(null),
        isBlocked = user?.data?.agora_chat_status === 'blocked',
        peerUserAgoraName = user?.data?.agora_username

    let lastDate: null | Date

    useEffect(() => {
        if (data && data?.data && data?.data?.agora_username) {
            setAuthData(data)
            setIsAuthDataLoaded(true)
        }
    }, [data])

    useEffect(() => {
        mutate({})
        setHistoryLogDetail([])
        setHistoryLogDetailBackUp([])
        setLogDetail([])
        setSearchTerm('')
        setCursor(undefined)
        lastDate = null
        setIs3dotPopupVisible(false)
        setIsSearchTermInputVisible(false)
    }, [userId])

    useEffect(() => {
        const agoraUser = authData?.data
        if (agoraUser) {
            setUnReadCount(user?.data?.unread_count || 0)
            conn.open({
                user: agoraUser?.agora_username,
                agoraToken: agoraUser?.agora_bearer_token
            }).then(() => {
                fetchOlderMessages()
                console.log("_____LOGIN_____")
            }).catch((error) => {
                console.log("_____LOGIN FAILED_____", error.message)
            }).finally(() => {
                console.log("_____LOGIN WAIT_____")
            })
            if (historyLogDetail.length < 1)
                fetchOlderMessages()
        }
    }, [isAuthDataLoaded, user, userId])

    useEffect(() => {
        const timeouts = [333].map(delay =>
            setTimeout(() => {
                updateAgoraChatUser()
                scrollToBottom()
            }, delay)
        )
        return () => {
            timeouts.forEach(clearTimeout)
        }
    }, [logDetail])

    useEffect(() => {
        if (historyLogDetail.length < 21) {
            updateAgoraChatUser()
            if (scrollRef.current)
                scrollRef.current.scrollTop = 0
            setTimeout(() => {
                scrollToBottom()
            }, 333)
        }
    }, [historyLogDetail])

    useEffect(() => {
        const handleReceivedTextMessage = (message: AgoraChat.TextMsgBody) => {
            const openedChatUser = user?.data?.agora_username
            if (message.from === openedChatUser) {
                setUnReadCount(0)
                setLogDetail(prevLogDetails => [
                    ...prevLogDetails,
                    {
                        isReceived: true,
                        message: message.msg,
                        type: message.type,
                        data: message
                    }
                ])
            }
        }

        const handleReceivedFileMessage = (message: AgoraChat.FileMsgBody) => {
            const openedChatUser = user?.data?.agora_username
            if (message.from === openedChatUser) {
                setUnReadCount(0)
                setLogDetail(prevLogDetails => [
                    ...prevLogDetails,
                    {
                        isReceived: true,
                        message: {
                            filename: message.filename,
                            filetype: message.filetype,
                            url: message.url,
                            length: message.file_length || message.length
                        },
                        type: message.type,
                        data: message
                    }
                ])
            }
        }

        conn.addEventHandler("connection&message", {
            onTextMessage: handleReceivedTextMessage,
            onFileMessage: handleReceivedFileMessage,
        })

        return () => {
            conn.removeEventHandler("connection&message")
        }
    }, [user, userId])

    useEffect(() => {
        return () => {
            filePreviews.forEach(preview => URL.revokeObjectURL(preview))
        }
    }, [filePreviews])

    useEffect(() => {
        let timer: NodeJS.Timeout | number | undefined;
        if (isRecording) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRecording])

    const handleDeleteModal = () => {
        setDeleteModal((_) => !_);
    };
    const handleBlockModal = () => {
        setBlockModal((_) => !_);
    };

    const fetchOlderMessages = () => {
        const agoraUserId = user?.data?.agora_username
        const options = {
            targetId: agoraUserId as string,
            chatType: 'singleChat' as 'singleChat',
            pageSize: 20,
            searchDirection: 'up' as 'up',
            cursor: cursor
        }
        conn.getHistoryMessages(options).then((response) => {
            type MessagesType = AgoraChat.TextMsgBody | AgoraChat.FileMsgBody | any
            const messages: MessagesType[] = response.messages || []

            const formattedMessages = messages.map((message) => {
                const isReceived = message.from === agoraUserId
                if (message.type === 'txt')
                    return {
                        isReceived,
                        message: message.msg,
                        type: 'txt',
                        data: message
                    }
                else if (message.type === 'file')
                    return {
                        isReceived,
                        message: {
                            filename: message.filename,
                            filetype: message.filetype,
                            url: message.url,
                            length: message.file_length || message.length
                        },
                        type: 'file',
                        data: message
                    }
                return {
                    isReceived: false,
                    message: '',
                    type: 'unidentified',
                    data: message
                }
            })
            if (response.cursor != cursor && response.cursor !== 'undefined') {
                setHistoryLogDetail((prevMessages) => [...prevMessages, ...formattedMessages])
                setHistoryLogDetailBackUp((prevMessages) => [...prevMessages, ...formattedMessages])
                setCursor(response.cursor)
            } else
                console.log("_____HISTORY NO MORE_____")
        }).catch((error) => {
            console.log("_____HISTORY FETCH FAILED_____", error.message)
        })
    }

    const updateAgoraChatUser = async (isNewMsg = 0) => {
        const receiverUserId = user?.data?.id
        if (receiverUserId)
            try {
                await fetch(import.meta.env.VITE_API_URL + Endpoints.UpdateAgoraChatUser, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': apiToken
                    },
                    body: JSON.stringify({
                        receiver_user_id: receiverUserId,
                        is_new_msg_sender: isNewMsg
                    })
                })
            } catch (error) {
                console.error('Error updating agora chat user : ', error)
            }
    }, blockOrUnAgoraChatUser = async (status: string) => {
        const receiverUserId = user?.data?.id
        if (receiverUserId && (status === 'active' || status === 'blocked'))
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + Endpoints.UpdateAgoraChatUser, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': apiToken
                    },
                    body: JSON.stringify({
                        receiver_user_id: receiverUserId,
                        status
                    })
                })
                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`)
                const responseData = await response.json()
                if (responseData.success)
                    toast.success(`Successfully ${status === "active"? "Unblocked": "Blocked"}`)
                    window.location.reload()
            } catch (error) {
                console.error('Error updating agora chat user : ', error)
                toast.error("Something wrong happened! Please try again later.")
            }
    }, handleClickUserProfile = () => {
        if (user?.data?.user_name) {
            navigate(`/${user.data.user_name}`);
        }
    }

    const handleSendMessage = () => {
        const agoraUserId = user?.data?.agora_username
        if (agoraUserId && peerMessage) {
            const option: AgoraChat.CreateTextMsgParameters = {
                chatType: 'singleChat' as AgoraChat.ChatType,
                type: 'txt',
                to: agoraUserId,
                from: AuthData?.agoraUsername,
                msg: peerMessage
            };
            const msg = AC.message.create(option);
            conn.send(msg).then(() => {
                updateAgoraChatUser(1)
                setUnReadCount(unReadCount + 1)
                setLogDetail(
                    prevLogDetails => [
                        ...prevLogDetails,
                        {
                            isReceived: false,
                            message: peerMessage,
                            type: 'txt',
                            data: msg
                        }
                    ]
                )
            }).catch((reason) => {
                console.log("_____SEND FAILED_____", reason.message)
            });
            setPeerMessage('')
        }
    }, handleDeleteMessage = async (targetId: string, messageId: string) => {
        try {
            const options: any = {
                targetId,
                chatType: 'singleChat' as AgoraChat.ChatType,
                messageIds: [messageId]
            }
            await conn.removeHistoryMessages(options)
            console.log(`Message with ID ${messageId} deleted successfully.`)
            setLogDetail(prevLogDetails =>
                prevLogDetails.filter(details => details.data.id !== messageId)
            )
            setHistoryLogDetail(prevLogDetails =>
                prevLogDetails.filter(details => details.data.id !== messageId)
            )
            setHistoryLogDetailBackUp(prevLogDetails =>
                prevLogDetails.filter(details => details.data.id !== messageId)
            )
        } catch (error) {
            console.error(`Failed to delete message with ID ${messageId}:`, error)
        }
    }, handleDeleteConversation = async (channel: string) => {
        try {
            const result = await conn.deleteConversation({
                channel: channel,
                chatType: 'singleChat',
                deleteRoam: true
            })
            if (result.success) {
                console.log('Conversation deleted successfully:', result)
            }
            else
                console.error('Failed to delete conversation:', result)
            setLogDetail([])
            setHistoryLogDetail([])
            setHistoryLogDetailBackUp([])
            handleDeleteModal()
            toast.success("Conversation deleted successfully")
        } catch (error) {
            console.error('Error occurred while deleting conversation:', error)
            toast.error("Error occurred while deleting conversation")
        }
    }, handleEmojiClick = (emojiObject: EmojiClickData) => {
        setPeerMessage(prevMessage => prevMessage + emojiObject.emoji)
    }, handleClosePicker = () => {
        setEmojiPickerVisible(false)
    }, handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setSelectedFiles(files)
        setFilePreviews(files.map(file => URL.createObjectURL(file)))
        setIsPopupVisible(files.length > 0)
    }, handleClosePopup = () => {
        filePreviews.forEach(preview => URL.revokeObjectURL(preview))
        setIsPopupVisible(false)
        setSelectedFiles([])
        setFilePreviews([])
    }, handleRemoveFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(updatedFiles)
        setFilePreviews(updatedFiles.map(file => URL.createObjectURL(file)))
        if (updatedFiles.length === 0) {
            setIsPopupVisible(false)
        }
    }, handleSavePopup = () => {
        const agoraUserId = user?.data?.agora_username
        if (agoraUserId && selectedFiles.length > 0) {
            let fileNames: string[] = []
            const maxSizeInBytes = 5 * 1024 * 1024
            selectedFiles.forEach((file: File) => {
                if (file.size > maxSizeInBytes)
                    fileNames.push(file.name)
            })
            if (fileNames.length > 0) {
                alert(`${fileNames.join(', ')} is/are greater than 5 MB, please remove them.`)
                return
            }
            selectedFiles.forEach((file: File) => {
                let fileType = ''
                if (file.type)
                    fileType = file.type
                else {
                    const parts = file.name ? file.name.split('.') : []
                    const extension = parts.length > 1 ? parts.pop() : ''
                    fileType = extension ? extension.toLowerCase() : ''
                }
                const fileObj: AgoraChat.FileObj = {
                    url: URL.createObjectURL(file),
                    filename: file.name,
                    filetype: fileType,
                    data: file
                }
                const option: AgoraChat.CreateFileMsgParameters = {
                    chatType: 'singleChat' as AgoraChat.ChatType,
                    type: "file",
                    to: agoraUserId,
                    from: AuthData?.agoraUsername,
                    file: fileObj,
                    filename: fileObj.filename
                };
                const msg = AC.message.create(option);
                conn.send(msg).then((res: AgoraChat.FileObj | any) => {
                    updateAgoraChatUser(1)
                    setUnReadCount(unReadCount + 1)
                    setLogDetail(
                        prevLogDetails => [
                            ...prevLogDetails,
                            {
                                isReceived: false,
                                message: {
                                    filename: file.name,
                                    filetype: file.type,
                                    url: res.message?.url,
                                    length: file.size
                                },
                                type: 'file',
                                data: msg
                            }
                        ]
                    )
                    console.log('_____File sent successfully_____')
                    filePreviews.forEach(preview => URL.revokeObjectURL(preview))
                    setIsPopupVisible(false)
                    setSelectedFiles([])
                    setFilePreviews([])
                }).catch((error) => {
                    console.error('_____Failed to send file_____:', error.message)
                });
            })
        }
    }

    const handleMicClick = async () => {
        setIsAudioPopupVisible(true)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        const audioChunks: Blob[] = [];
        recorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
            const audioUrl = URL.createObjectURL(audioBlob)
            setAudioURL(audioUrl)
            const file = new File([audioBlob], "voice_message.mp3", { type: 'audio/mp3' })
            setVoiceMsgAudioFile(file)
        };

        recorder.start();
        setIsRecording(true);
    }, stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
    }, cancelVoiceMessage = () => {
        setMediaRecorder(null)
        setIsRecording(false)
        setAudioURL(null)
        setIsAudioPopupVisible(false)
        setTime(0)
    }, sendVoiceMessage = () => {
        const audioFile = voiceMsgAudioFile,
            agoraUserId = user?.data?.agora_username
        if (audioFile && agoraUserId) {
            let fileType = audioFile.type || 'audio/mp3';
            const fileObj: AgoraChat.FileObj = {
                url: URL.createObjectURL(audioFile),
                filename: audioFile.name,
                filetype: fileType,
                data: audioFile
            };
            const option: AgoraChat.CreateFileMsgParameters = {
                chatType: 'singleChat' as AgoraChat.ChatType,
                type: "file",
                to: agoraUserId,
                from: AuthData?.agoraUsername,
                file: fileObj,
                filename: fileObj.filename
            };
            const msg = AC.message.create(option);
            conn.send(msg).then((res: AgoraChat.FileObj | any) => {
                updateAgoraChatUser(1);
                setUnReadCount(unReadCount + 1)
                setLogDetail(
                    prevLogDetails => [
                        ...prevLogDetails,
                        {
                            isReceived: false,
                            message: {
                                filename: audioFile.name,
                                filetype: audioFile.type,
                                url: res.message?.url,
                                length: audioFile.size
                            },
                            type: 'file',
                            data: msg
                        }
                    ]
                );
                console.log('_____Voice message sent successfully_____');
            }).catch((error) => {
                console.error('_____Failed to send voice message_____:', error.message);
            });
        }
        setMediaRecorder(null)
        setIsRecording(false)
        setAudioURL(null)
        setIsAudioPopupVisible(false)
        setTime(0)
    }

    const handle3dotMouseEnter = () => {
        setIs3dotPopupVisible(true)
    }, handle3dotSearchMouseEnter = () => {
        setIsSearchTermInputVisible(true)
    }, handle3dotSearchMouseLeave = () => {
        setIsSearchTermInputVisible(false)
    }, handle3dotMouseLeave = () => {
        setIs3dotPopupVisible(false)
        setIsSearchTermInputVisible(false)
    }, handle3dotSearch = (searchTerm: string) => {
        if (searchTerm.trim())
            setHistoryLogDetail(historyLogDetail.filter(details => {
                const message = details.message
                return typeof message === 'string' && message.toLowerCase().includes(searchTerm.toLowerCase())
            }))
        else
            setHistoryLogDetail(historyLogDetailBackUp)
        scrollToBottom()
    }, handle3dotBlock = (status: string) => {
        blockOrUnAgoraChatUser(status)
        setIs3dotPopupVisible(false)
        setIsSearchTermInputVisible(false)
    }, handle3dotDelete = () => {
        if (peerUserAgoraName)
            handleDeleteConversation(peerUserAgoraName)
        setIs3dotPopupVisible(false)
        setIsSearchTermInputVisible(false)
        console.log('Delete option clicked', peerUserAgoraName)
    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    const handleScroll = () => {
        if (scrollRef.current) {
            const currentScrollHeight = scrollRef.current?.scrollHeight || 900
            const { scrollTop } = scrollRef.current
            if (scrollTop === 0) {
                fetchOlderMessages()
                setTimeout(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight - currentScrollHeight
                    }
                }, 300)
            }
        }
    }

    const renderDateDivider = (currentDate: Date) => {
        return (
            <div className="flex justify-center items-center p-3 my-5 text-xs text-gray-500">
                __________     {formatDate(currentDate)}     __________
            </div>
        )
    }, renderUserMessages = (messages: MsgLogEntry[], isReverseOrder: boolean = false) => {
        const lastReceiverUserId = user?.data?.last_receiver_user_id || 0
        const isDifferentReceiver = lastReceiverUserId !== authData?.data?.id

        const logLength = logDetail.length
        const unReadCountLive = isDifferentReceiver ? Math.min(logLength, unReadCount) : 0
        const unReadCountHistory = isDifferentReceiver ? Math.max(0, unReadCount - unReadCountLive) : 0

        const processedMessages = isReverseOrder ? messages.slice().reverse() : messages
        const onlineStatus = GetUserOnlineStatus(user?.data?.last_active_at)

        return processedMessages.map((entry, index) => {
            const currentDate = new Date(entry.data.time)
            const showDateDivider = !lastDate || !isSameDay(currentDate, lastDate)
            lastDate = currentDate

            const isRead = isReverseOrder
                ? index + 1 <= historyLogDetail.length - unReadCountHistory
                : index + 1 <= logLength - unReadCountLive

            return (
                <div key={index}>
                    {showDateDivider && renderDateDivider(currentDate)}
                    <MessageCard
                        isReceived={entry.isReceived}
                        msg={entry.message}
                        type={entry.type}
                        data={entry.data}
                        user={entry.isReceived ? user?.data : authData?.data}
                        onlineStatus={entry.isReceived ? onlineStatus : "active"}
                        isRead={isRead}
                        onDeleteMessage={handleDeleteMessage}
                    />
                </div>
            )
        })
    }

    return (
        <div className="sticky top-0 bg-surface-1 pt-[20px] pb-[27px] w-full laptop:top-[50px] left-0 z-[10]">
            <div className="flex justify-between items-center">
                <div className="flex cursor-pointer"
                    onClick={handleClickUserProfile}>
                    <div className="mr-2 cursor-pointer ml-5">
                        <div className="relative videocontainernotification">
                            <Avatar
                                image={user?.data?.profile_image}
                                classNameAvatarContainer="!w-[3rem] !h-[3rem]"
                                className="!text-[1.9rem] "
                            />
                            {user?.data?.is_admin_verified === 1 && (
                                <MaterialSymbol
                                    className={`text-primary text-center !text-[1.4rem] absolute bottom-[-6px] right-0`}
                                    icon={"verified"}
                                    fill
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-center h-full">
                        <span className="mr-2 text-2xl font-bold">{user?.data?.name}</span>
                        <span className="text-sm text-gray-500">
                            {user?.data?.user_name
                                ? `@${user?.data?.user_name}`
                                : `@${user?.data?.name}`}
                        </span>
                    </div>
                </div>
                <div className="relative mr-10">
                    <MaterialSymbol
                        className='text-center !text-[1.7rem] text-gray-500 cursor-pointer'
                        icon={"more_vert"}
                        fill
                        onMouseEnter={handle3dotMouseEnter}
                    />
                    {is3dotPopupVisible && (
                        <div
                            className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-48"
                            onMouseEnter={handle3dotMouseEnter}
                            onMouseLeave={handle3dotMouseLeave}
                        >
                            {isSearchTermInputVisible ?
                                (<input
                                    ref={inputSearchTermRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        handle3dotSearch(e.target.value)
                                    }}
                                    placeholder="Type to search..."
                                    className="w-full px-4 py-2 border-b border-gray-300"
                                    autoFocus
                                    onMouseLeave={handle3dotSearchMouseLeave}
                                />) :
                                (
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onMouseEnter={handle3dotSearchMouseEnter}
                                    >
                                        Search message
                                    </button>
                                )
                            }
                            {isBlocked && user?.data?.last_receiver_user_id === user?.data?.id ?
                                (
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                        // onClick={() => handle3dotBlock('active')}
                                        onClick={handleBlockModal}
                                    >
                                        Unblock user
                                    </button>
                                ) : isBlocked && user?.data?.last_receiver_user_id !== user?.data?.id ? (
                                    <></>
                                ) : (
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                        // onClick={() => handle3dotBlock('blocked')}
                                        onClick={handleBlockModal}
                                    >
                                        Block user
                                    </button>
                                )
                            }
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                // onClick={handle3dotDelete}
                                onClick={handleDeleteModal}
                            >
                                Delete conversation
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            <DeleteConfirm
                isOpen={deleteModal}
                closeModal={handleDeleteModal}
                buttonName="Delete"
                onClickYes={handle3dotDelete}
            >
                <div className="pb-6 flex flex-col gap-1 items-center justify-center">
                    <Typography variant="body" size="large" className="text-black">
                        Delete conversation with{" "}
                        <span className="font-bold">{user?.data?.name}?</span>
                    </Typography>
                    <Typography variant="body" size="medium" className="text-black">
                        The conversation with {user?.data?.name} will be deleted.
                    </Typography>
                </div>
            </DeleteConfirm>
            {/* Block or UnBlock Confirm Modal */}
            <DeleteConfirm
                isOpen={blockModal}
                closeModal={handleBlockModal}
                buttonName={
                    isBlocked && user?.data?.last_receiver_user_id === user?.data?.id ?
                        ('Unblock') : (isBlocked && user?.data?.last_receiver_user_id !== user?.data?.id) ?
                            ('') : ('Block')
                }
                onClickYes={
                    isBlocked && user?.data?.last_receiver_user_id === user?.data?.id ?
                        (() => handle3dotBlock('active')) : (isBlocked && user?.data?.last_receiver_user_id !== user?.data?.id) ?
                            (() => { }) : (() => handle3dotBlock('blocked'))
                }
            >
                <div className="pb-6 flex flex-col gap-1 items-center justify-center">
                    <Typography variant="body" size="large" className="text-black">
                        {
                            isBlocked && user?.data?.last_receiver_user_id === user?.data?.id ?
                                ('Unblock posts and updates from') : (isBlocked && user?.data?.last_receiver_user_id !== user?.data?.id) ?
                                    ('') : ('Block posts and updates from')
                        }
                        <span className="font-bold">&nbsp;{user?.data?.name}?</span>
                    </Typography>
                    <Typography variant="body" size="medium" className="text-black">
                    {
                            isBlocked && user?.data?.last_receiver_user_id === user?.data?.id ?
                                ('You will be shown the content, posts and updates from ') : (isBlocked && user?.data?.last_receiver_user_id !== user?.data?.id) ?
                                    ('') : ('You will not be shown any content, posts and updates from ')
                        }
                        {user?.data?.name}.
                    </Typography>
                </div>
            </DeleteConfirm>
            <div className='m-5 h-screen'>
                <div className='h-[80%] bg-white border border-gray-300 rounded-2xl'>
                    <div className='h-[90%] p-3 bg-surface-1 overflow-y-scroll' ref={scrollRef} onScroll={handleScroll}>
                        {renderUserMessages(historyLogDetail, true)}
                        {renderUserMessages(logDetail)}
                    </div>
                    <div className='h-[10%] border-t-2 flex flex-row'>
                        <div className='w-[10%] flex items-center justify-center relative'>
                            <MaterialSymbol
                                className={`text-gray-500 text-center !text-[1.7rem] ${isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                icon={"mood"}
                                onClick={() => !isBlocked && setEmojiPickerVisible(!isEmojiPickerVisible)}
                            />
                            {isEmojiPickerVisible && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-5 rounded max-w-screen-lg max-h-screen overflow-y-auto">
                                        <div className="flex justify-end">
                                            <button
                                                className="bg-gray-100 hover:text-red-500 text-red-300 text-5xl w-8 h-8 mb-2 flex items-center justify-center"
                                                onClick={handleClosePicker}
                                            >&times;
                                            </button>
                                        </div>
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='w-[70%] flex items-center justify-center'>
                            <input
                                className={`w-[100%] h-[75%] ${isBlocked ? 'cursor-not-allowed placeholder-red-500 placeholder-bold' : ''}`}
                                type="text"
                                placeholder={isBlocked ? "Unable to send ( Blocked )" : "Write a message..."}
                                id="peerMessage"
                                value={peerMessage}
                                onChange={(e) => !isBlocked && setPeerMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isBlocked}
                            />
                        </div>
                        <div className='w-[20%] mr-3 flex items-center justify-end'>
                            <div className="mr-2">
                                <label htmlFor="fileUpload">
                                    <MaterialSymbol
                                        className={`text-center !text-[1.7rem] text-gray-500 ${isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        icon={"attach_file"}
                                        fill
                                    />
                                </label>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={(e) => !isBlocked && handleFileChange(e)}
                                    disabled={isBlocked}

                                />
                            </div>
                            <div>
                                {peerMessage.trim() ?
                                    (
                                        <div className='bg-blue-700 rounded-full cursor-pointer' onClick={() => !isBlocked && handleSendMessage()}>
                                            <MaterialSymbol
                                                className='text-white text-center !text-[1.7rem] m-1'
                                                icon={"send"}
                                                fill
                                            />
                                        </div>
                                    ) : (
                                        <div className={`bg-blue-700 text-white rounded-full ${isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => !isBlocked && handleMicClick()}>
                                            <MaterialSymbol
                                                className='text-center !text-[1.7rem] m-1'
                                                icon={"mic"}
                                                fill
                                            />
                                        </div>
                                    )}

                                {isAudioPopupVisible && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <div className="bg-white rounded-lg p-4">
                                            {isRecording && (
                                                <div className="grid grid-cols-2 justify-center items-center">
                                                    <div className="timer">
                                                        {Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}
                                                    </div>
                                                    <button onClick={stopRecording} className="bg-orange-500 text-white p-2 rounded">
                                                        Stop recording
                                                    </button>
                                                </div>
                                            )}
                                            {audioURL && (
                                                <div className="flex flex-col items-center">
                                                    <audio controls src={audioURL}></audio>
                                                    <div className="mt-2 grid grid-cols-2">
                                                        <button onClick={sendVoiceMessage} className="bg-green-600 text-white p-2 rounded mr-2">
                                                            Send voice message
                                                        </button>
                                                        <button onClick={cancelVoiceMessage} className="bg-red-500 text-white p-2 rounded">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isPopupVisible && selectedFiles.length > 0 && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-5 rounded max-w-screen-lg max-h-screen overflow-y-auto">
                                    <h3 className="text-xl font-semibold mb-3">Selected Files</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="relative mb-3">
                                                <div className="bg-gray-100 mb-5 flex items-center justify-center">
                                                    <p>{file.name}</p>
                                                    <button
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                                {file.type.startsWith('image/') && (
                                                    <img src={filePreviews[index]} alt="Preview" className="max-w-full max-h-64" />
                                                )}
                                                {file.type.startsWith('video/') && (
                                                    <video controls className="max-w-full max-h-64">
                                                        <source src={filePreviews[index]} type={file.type} />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                                {file.type.startsWith('audio/') && (
                                                    <audio controls className="max-w-full max-h-64">
                                                        <source src={filePreviews[index]} type={file.type} />
                                                        Your browser does not support the audio tag.
                                                    </audio>
                                                )}
                                                {file.type === 'application/pdf' && (
                                                    <iframe src={filePreviews[index]} className="max-w-full max-h-64" />
                                                )}
                                                {file.type === 'text/plain' && (
                                                    <iframe src={filePreviews[index]} className="max-w-full max-h-64" />
                                                )}
                                                {(file.type === 'application/msword' ||
                                                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                                                    file.type === 'application/vnd.ms-excel' ||
                                                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                                                    file.type === 'application/vnd.ms-powerpoint' ||
                                                    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') && (
                                                        <iframe
                                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(filePreviews[index])}`}
                                                            className="max-w-full max-h-64"
                                                            allowFullScreen
                                                        />
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <button
                                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                                            onClick={handleClosePopup}
                                        >
                                            Close
                                        </button>
                                        <div></div>
                                        <button
                                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                            onClick={handleSavePopup}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
};

export default MessageUserCard;