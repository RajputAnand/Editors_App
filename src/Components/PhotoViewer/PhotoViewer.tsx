import {FC, Fragment} from "react";
import {Transition} from "@headlessui/react";
import {MaterialSymbol} from "react-material-symbols";

import { Tooltip } from 'react-tooltip'
interface IPhotoViewer {
    index: number,
    handlePreviewImage: (index?: number) => void,
    images: Array<string>
}

const PhotoViewer:FC<IPhotoViewer> = (props) => {

    const {index, handlePreviewImage, images} = props

    const handleLeft = () => {
        if (!Boolean(images[index - 1])) return <div className="flex-1"/>
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center border border-white cursor-pointer"  onClick={() => handlePreviewImage(index - 1)}>
                    <MaterialSymbol icon={"chevron_left"} className="!text-[3rem] mx-auto text-white text-center" as="div"/>
                </div>
            </div>
        )
    }

    const handleRight = () => {
        if (!Boolean(images[index + 1])) return <div className="flex-1"/>
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center border border-white cursor-pointer" onClick={() => handlePreviewImage(index + 1)}>
                    <MaterialSymbol icon={"chevron_right"} className="!text-[3rem] mx-auto text-white text-center" as="div"/>
                </div>
            </div>
        )
    }

    return (
        <Transition show={true}>
            <div className="relative w-full h-full z-10">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80"/>
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="flex items-center justify-center h-full">
                            {handleLeft()}
                            <img alt="preview image" className="w-10/12" src={images[index]}/>
                            {handleRight()}
                        </div>
                    </Transition.Child>
                </div>
            </div>
            <div className="fixed top-5 left-0 z-[11] m-[2.5rem]" data-tooltip-id="my-tooltip" data-tooltip-content="Close">
            <Tooltip id="my-tooltip" className="custom-tooltip mt-2" place="bottom"/>
            
                <MaterialSymbol icon={"close"} className="text-white !text-[2rem] cursor-pointer" as="div"
               
                 onClick={() => handlePreviewImage(undefined)}/>
              
            </div>
        </Transition>
    )
}

export default PhotoViewer