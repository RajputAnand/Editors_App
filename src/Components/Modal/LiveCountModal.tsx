import { Dialog, Transition } from '@headlessui/react'
import React, { FC } from 'react'
import { MaterialSymbol } from 'react-material-symbols';
import FollowCard from '../Cards/FollowCard';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface ViewUser {
    id: number;
    name: string;
    user_name: string;
    profile_image: string;
    is_admin_verified: number;
}

interface ILiveCountModal {
    open: boolean;
    onClose: () => void;
    data: ViewUser[];
    reFetchProfileData: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, any>>;
}

const LiveCountModal: FC<ILiveCountModal> = (props) => {
    const { open, onClose, data, reFetchProfileData } = props;

    const handleOnClose = () => {
        onClose()
    }

    const renderListing = () => {
        return (
            <div className="w-full min-w-[2.75rem] rounded-lg mt-10 mb-5 p-[0.06rem] sm:p-[0.06rem]">
                <div className="flex items-center justify-between border-b pb-5">
                    <div className="flex flex-col items-start">
                        <h2 className="text-[#0E0E0E] font-bold text-lg">Viewers</h2>
                    </div>
                    <div className="flex items-center justify-between ">
                        <MaterialSymbol
                            icon={"cancel"}
                            className="!text-[2rem] text-[#80839F] cursor-pointer"
                            as={"div"}
                            onClick={handleOnClose}
                        />
                    </div>
                </div>
                <div className='custom-scrollbar overflow-y-auto max-h-[35em]'>
                    {data?.map((item: ViewUser) => {
                        return (
                            <FollowCard
                                profile_image={item.profile_image}
                                id={item.id} name={item.name}
                                user_name={item.user_name}
                                is_admiring={false}
                                reFetchProfileData={reFetchProfileData}
                                showButton={false}
                                is_admin_verified={item.is_admin_verified}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
    return (
        <Transition appear show={open} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={handleOnClose}>
                <div
                    className="fixed inset-0 bg-black bg-opacity-50"
                    aria-hidden="true"
                />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center tablet:items-center tablet:justify-end tablet:pr-[2.88rem] laptop:justify-center laptop:p-0">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="transform overflow-hidden rounded-2xl p-4 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[35%] tablet:px-[1.88rem] laptop:px-[2rem]">
                                {renderListing()}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default LiveCountModal