import React, { useState } from 'react'
import { FaCheck, FaCopy, FaDownload, FaFileAlt, FaFilePdf, FaTrashAlt, FaUndo } from 'react-icons/fa'
import Avatar from "../Avatar/Avatar.tsx"

interface MessageProps {
    isReceived: boolean
    msg: any | null
    type: String
    data: any
    user: any | null
    onlineStatus: string
    isRead: boolean
    onDeleteMessage: (targetId: string, messageId: string) => void
}

const getFileTypeFromExtension = (extension: string, filename: string) => {
    let ext = extension
    if (!ext) {
        const parts = filename ? filename.split('.') : []
        const extension = parts.length > 1 ? parts.pop() : ''
        ext = extension ? extension.toLowerCase() : ''
    }
    switch (ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'webp':
        case 'tiff':
        case 'svg':
        case 'ico':
        case 'image/jpg':
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/bmp':
        case 'image/webp':
        case 'image/tiff':
        case 'image/svg+xml':
        case 'image/x-icon':
            return 'image'
        case 'mp4':
        case 'webm':
        case 'ogg':
        case 'avi':
        case 'mov':
        case 'wmv':
        case 'flv':
        case 'mkv':
        case '3gp':
        case 'mpeg':
        case 'video/mp4':
        case 'video/webm':
        case 'video/ogg':
        case 'video/avi':
        case 'video/quicktime':
        case 'video/x-ms-wmv':
        case 'video/x-flv':
        case 'video/x-matroska':
        case 'video/3gpp':
        case 'video/mpeg':
            return 'video'
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'aac':
        case 'm4a':
        case 'wma':
        case 'audio/mp3':
        case 'audio/mpeg':
        case 'audio/wav':
        case 'audio/ogg':
        case 'audio/flac':
        case 'audio/aac':
        case 'audio/x-m4a':
        case 'audio/x-ms-wma':
            return 'audio'
        case 'pdf':
        case 'application/pdf':
            return 'pdf'
        case 'txt':
        case 'text/plain':
            return 'text'
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'ppt':
        case 'pptx':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'document'
        default:
            return 'unknown'
    }
}, convertTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return { time }
}

const TextMessage: React.FC<{ isReceived: boolean, text: string, time: string }> = ({ isReceived, text, time }) => (
    <p className={`p-4 rounded-lg min-w-32 max-w-96 break-words ${isReceived ? 'bg-white' : 'bg-blue-500 text-white'}`}>
        <span className="block">{text}</span>
        <span className={`block text-right mt-3 text-sm ${isReceived ? 'text-gray-400' : 'text-gray-300'}`}>{time}</span>
    </p>
)

const FileMessage: React.FC<{ filetype: string, filename: string, url: string, isReceived: boolean, time: string }> = ({
    filetype,
    filename,
    url,
    isReceived,
    time
}) => {
    const [isFullScreen, setIsFullScreen] = useState(false)

    const fileType = getFileTypeFromExtension(filetype, filename),
        truncatedFilename = filename.length > 15 ? `${filename.substring(0, 15)}...` : filename

    const handleOpen = () => {
        setIsFullScreen(true)
    }, handleClose = () => {
        setIsFullScreen(false)
    }

    return (
        <div className={`p-2 rounded-lg ${isReceived ? 'bg-white' : 'bg-blue-500 text-white'}`}>
            <span className="block">
                {fileType === 'image' ? (
                    <div>
                        <img
                            src={url}
                            alt={filename}
                            className="max-w-32 max-h-64 cursor-pointer bg-white"
                            onClick={handleOpen}
                        />
                        {isFullScreen && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                                <div className="relative w-1/2 h-1/2">
                                    <img
                                        src={url}
                                        alt={filename}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                    <a
                                        href={url}
                                        download={filename}
                                        className="absolute top-4 right-4 text-white bg-gray-800 p-2 rounded-md hover:bg-gray-600"
                                    >
                                        Download
                                    </a>
                                    <button
                                        onClick={handleClose}
                                        className="absolute top-4 left-4 text-white bg-gray-800 p-2 rounded-md hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : fileType === 'video' ? (
                    <video
                        controls
                        className="max-w-64 max-h-64 cursor-pointer"
                    >
                        <source src={url} type={filetype} />
                        Your browser does not support the video tag.
                    </video>
                ) : fileType === 'audio' ? (
                    <audio
                        controls
                        className="max-w-64 max-h-64 cursor-pointer"
                    >
                        <source src={url} type={filetype} />
                        Your browser does not support the audio tag.
                    </audio>
                ) : fileType === 'pdf' ? (
                    <div className="flex items-center space-x-2">
                        <FaFilePdf className="text-red-500 text-4xl bg-white p-[1px]" />
                        <div>
                            <p className="text-sm font-bold">{truncatedFilename}</p>
                            <a href={url} download={filename} className={`${isReceived ? 'text-blue-500' : 'text-gray-700'} flex items-center space-x-1`}>
                                <FaDownload />
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                ) : fileType === 'text' ? (
                    <div className="flex items-center space-x-2">
                        <FaFilePdf className="text-blue-500 text-4xl bg-white p-[1px]" />
                        <div>
                            <p className="text-sm font-bold">{truncatedFilename}</p>
                            <a href={url} download={filename} className={`${isReceived ? 'text-blue-500' : 'text-gray-700'} flex items-center space-x-1`}>
                                <FaDownload />
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <FaFileAlt className="text-gray-700 text-4xl bg-white p-[1px]" />
                        <div>
                            <p className="text-sm font-bold">{truncatedFilename}</p>
                            <a href={url} download={filename} className={`${isReceived ? 'text-blue-500' : 'text-gray-700'} flex items-center space-x-1`}>
                                <FaDownload />
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                )}
            </span>
            <span className={`block text-right mt-3 text-sm ${isReceived ? 'text-gray-400' : 'text-gray-300'}`}>{time}</span>
        </div>
    )
}

const MessageCard: React.FC<MessageProps> = ({ onDeleteMessage, isRead, onlineStatus, user, data, msg, type, isReceived }) => {
    const { time } = convertTimestamp(data.time),
        [isHovered, setIsHovered] = useState(false),
        [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

    const handleMouseEnter = (e: any) => {
        setIsHovered(true)
        setContextMenuPosition({ x: e.clientX, y: e.clientY })
    }, handleMouseLeave = () => {
        setIsHovered(false)
    }, handleCopy = () => {
        let textToCopy = ''
        if (type === 'txt')
            textToCopy = msg
        else if (type === 'file')
            textToCopy = `File: ${msg.filename}`
        if (textToCopy)
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    console.log('Text copied to clipboard')
                })
                .catch(err => {
                    console.error('Failed to copy text to clipboard:', err)
                })
        setIsHovered(false)
    }, handleDelete = () => {
        const messageId = data.id
        if (messageId && data?.from && data?.to) {
            if (isReceived)
                onDeleteMessage(data.from, messageId)
            else
                onDeleteMessage(data.to, messageId)
        }
        setIsHovered(false)
    }

    return (
        <div className={`flex ${isReceived ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={`flex ${isReceived ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className='flex justify-center items-end px-2'>
                    <Avatar
                        image={user?.profile_image}
                        classNameAvatarContainer="!w-[2.5rem] !h-[2.5rem]"
                        className="!text-[1.9rem]"
                        onlineStatus={onlineStatus}
                    />
                </div>
                <div
                    className="message-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {isHovered && (
                        <div
                            className="context-menu flex flex-row items-end justify-end"
                            style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
                        >
                            <div className='m-1 p-2 rounded-xl cursor-pointer' onClick={handleCopy}>
                                <FaCopy className='text-lime-500 text-xl' />
                            </div>
                            {isReceived ?
                                <div className='m-1 p-2 rounded-xl cursor-pointer' onClick={handleDelete}>
                                    <FaTrashAlt className='text-red-500 text-xl' />
                                </div> :
                                <div className='m-1 p-2 rounded-xl cursor-pointer' onClick={handleDelete}>
                                    <FaTrashAlt className='text-red-600 text-xl' />
                                </div>
                            }
                        </div>
                    )}
                    {type === 'txt' ? (
                        <TextMessage isReceived={isReceived} text={msg} time={time} />
                    ) : type === 'file' ? (
                        <FileMessage
                            filetype={msg.filetype}
                            filename={msg.filename}
                            url={msg.url}
                            isReceived={isReceived}
                            time={time}
                        />
                    ) : null}
                </div>
                <div className={`flex justify-center items-end px-2`}>
                    {isRead ? (
                        <FaCheck className="text-green-500 text-xs" />
                    ) : (
                        <FaCheck className="text-gray-500 text-xs" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageCard
