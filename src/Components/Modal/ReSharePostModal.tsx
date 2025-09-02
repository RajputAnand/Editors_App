import React, {FC} from "react";
import PromptModal from "./PromptModal.tsx";
import {MaterialSymbol} from "react-material-symbols";
import Typography from "../Typography/Typography.tsx";
import {ShareButtons} from "../../Constants/Common.ts";

interface IReSharePostModal {
    link: string,
    openReshareModal: boolean,
    handleOpenReShareModal: () => void,
    copyPostLink: (text: string) => void,
}

const ReSharePostModal:FC<IReSharePostModal> = (props) => {
    const {openReshareModal, handleOpenReShareModal, copyPostLink, link} = props

    const renderContent = () => {

        return (
            <React.Fragment>
                <div className="flex gap-2 items-center cursor-pointer" onClick={() => copyPostLink(link)}>
                    <MaterialSymbol icon={"content_copy"} className="!text-[2rem] text-surface-10"/>
                    <Typography>Copy link</Typography>
                </div>
                <hr className="my-2"/>
                <div className="flex gap-2 my-2">
                    {
                        ShareButtons?.map((item, key) => {
                            return (
                                <a target="_blank" title={item.title} key={key}
                                   href={item?.link?.replace("YOUR_URL_HERE", link)}>
                                    <img className="w-[2rem] h-[2rem]" alt={item.title} src={item?.icon}/>
                                </a>
                            )
                        })
                    }
                </div>
            </React.Fragment>
        )
    }

    return (
        <PromptModal bgClassName="!bg-transparent" hideButtons isOpen={openReshareModal} closeModal={handleOpenReShareModal}>
            {renderContent()}
        </PromptModal>
    )
}

export default ReSharePostModal