import React, {FC, ReactElement} from "react";
import { Popover } from '@headlessui/react'
import Typography from "../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";

interface IPopoverTemplate {
    button: ReactElement,
    className?: string,
    title?: string,
    disabled?: boolean,
    children?: any,
    closeButtonId?: string
    classNotification?:string
    // onClick?:any
    // addClass?:any
}

const PopoverTemplate:FC<IPopoverTemplate> = (props) => {

    const { button, className, children, title, disabled, closeButtonId,classNotification} = props

    return (
        <Popover className="tablet:relative">
            <Popover.Button className="outline-none" disabled={disabled}>
                {button}
            </Popover.Button>
            <Popover.Panel style={{ filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.15)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.30))" }} 
            className={`p-4 fixed tablet:absolute z-50 inset-0 tablet:inset-auto w-screen tablet:max-w-sm px-4 tablet:mt-2 tablet:right-[-0.11rem] rounded-[0.25rem] lg:max-w-3xl bg-white notificationpopover ${className}`}>
                {({close}) => {
                    return (
                        <React.Fragment>
                            <div className={`flex items-center pb-[1.5rem] px-4 tablet:px-0 ${classNotification}`}>
                                <MaterialSymbol id={closeButtonId} as="a" onClick={() => close()} icon={"arrow_back"} className="!text-[1.8rem] mr-1 tablet:!hidden"/>
                                {title && <Typography variant="headline" size="small" className="!text-xl text-black !leading-8 !font-medium">{title}</Typography>}
                            </div>
                            {children}
                        </React.Fragment>
                    )
                }}
            </Popover.Panel>
        </Popover>
    )
}

export default PopoverTemplate