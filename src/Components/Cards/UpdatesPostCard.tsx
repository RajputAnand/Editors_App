import {FC} from "react";
import Avatar from "../Avatar/Avatar.tsx";
import Typography from "../Typography/Typography.tsx";
interface IUpdatesPostCard {
    video: Array<string>,
    title: string,
    profileDetails?: { image?: string, name: string },
    className?: string,
    onClick?: () => void
}

const UpdatesPostCard:FC<IUpdatesPostCard> = (props) => {

    const { video, profileDetails, title, className, onClick} = props

    const renderInnerContent = () => {

        return (
            <div className="absolute inset-0 flex items-start justify-end flex-col h-full p-2">
                {
                    Boolean(profileDetails) && (
                        <div className="flex items-center mb-2">
                            <Avatar classNameAvatarContainer={`bg-surface-2`} image={profileDetails?.image}/>
                            <Typography variant="title" size="small" className="text-white pl-2">{profileDetails?.name}</Typography>
                        </div>
                    )
                }
                <Typography variant="title" size="medium" className="text-white">
                    {title}
                </Typography>
            </div>
        )
    }

    return (

        
        <div onClick={onClick} className={`relative max-w-[45%] w-full h-[60vw] tablet:max-w-[48%] laptop:max-w-[33%] laptop:h-[30vw] cursor-pointer ${className} scrollbarzindex`}>
         <video preload="metadata" className="relative w-full h-full flex items-center justify-center rounded-[0.75rem] object-cover">
               <source src={video?.[0]} className="object-cover"/>
           </video>
          {renderInnerContent()}
            
         </div> 
    )
}

export default UpdatesPostCard