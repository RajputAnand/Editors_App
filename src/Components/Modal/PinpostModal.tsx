import {FC, Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import Typography from "../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";
import {QueryObserverResult, RefetchOptions, useInfiniteQuery} from "@tanstack/react-query";
import {Endpoints} from "../../Api/Endpoints.ts";
import {buildRequest} from "../../Api/buildRequest.ts";
import Loading from "../Common/Loading.tsx";
import {useForm} from "react-hook-form";
import useUser from "../../Hooks/useUser.tsx";
import toast from "react-hot-toast";
import { usePost } from "../../Hooks/usePost.tsx";

interface IPostReportModal {
    open: boolean,
    handle: () => void,
    post_id: string,
    onClose?: () => void,
    usePublic?: boolean
    onReportSuccess?: () => void,
    show_pinned_post_only?: number,
    onDeleteSuccess?: () => void,
     reFetchProfileData: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<any, any>>,
 
}

const PinpostModal:FC<IPostReportModal> = (props) => {
    const {open, handle, post_id, onClose, usePublic,onReportSuccess,show_pinned_post_only,onDeleteSuccess,
        reFetchProfileData
        } = props

    const {me} = useUser();
    const { data: meData, isLoading: meIsLoading } = me()
    const LIMIT_PAGINATION = 10;
    const [seeMore, setSeeMore] = useState<boolean>(false)
    const [reportDatas, setReportDatas] = useState<string>("")
    const post_endpoint = usePublic ? Endpoints.PublicPostList : Endpoints.FeedPosts
    const {fetchNextPage, isLoading, hasNextPage,  refetch,data,isRefetching} = useInfiniteQuery({
        queryKey: [post_endpoint, "GET", { post_id: post_id, per_page: LIMIT_PAGINATION, replied_to: post_id }],
        queryFn: (args) => buildRequest(args),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!seeMore) return undefined;
            return lastPage.data.length === LIMIT_PAGINATION ? allPages.length + 1 : undefined;
        },
        staleTime: Infinity,
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
    })

    const handleOnClose = () => {
        handle()
        if (onClose) onClose()
    }

    const {handleSubmit} = useForm();
    const { reportPost,deletePostPin } =usePost()
    const { mutate:pinningMutate} = reportPost({ mutationKey: [Endpoints.PostPin.replaceWithObject({post_id: post_id}), "POST"] })  
    // const { mutate:pinningDeleteMutate} = reportPost({ mutationKey: [Endpoints.DeletePostPin .replaceWithObject({post_id: post_id}), "DELETE"] })        
    const { mutate: deleteMutate, isSuccess } = deletePostPin({ mutationKey: [Endpoints.DeletePostPin.replaceWithObject({ id: post_id }), "DELETE"] })
   
    const onSubmit = (data: any) =>{
       
    const handlePinButton = () => {
        if (onReportSuccess) 
          
            onReportSuccess()
            
            toast.success("Pinning post success")
            handleOnClose()
            refetch().then(() => null)
             window.location.reload()
            return reFetchProfileData().then(r => r)
          
    }

    return pinningMutate({
        post_id: post_id
   }, { onSuccess: handlePinButton });
    } 
   
    const renderHeader = () => {

        return (
            <div className="flex items-center justify-between mb-[1.25rem]">
                 {show_pinned_post_only === 0 ?
                <Typography variant={"title"} size={"medium"} className="!text-[1.25rem] !font-medium !leading-[1.89669rem]
                 text-secondary-light">Pin this post</Typography>
                :
                <Typography variant={"title"} size={"medium"} className="!text-[1.25rem] !font-medium !leading-[1.89669rem]
                text-secondary-light">Unpin post from your profile</Typography>}
                <MaterialSymbol icon={"close"} fill className="!text-[2rem] text-surface-20 cursor-pointer" as={"div"} onClick={handleOnClose}/>
            </div>
        )
    }
  const searchOnChange=(value:string)=>{
    setReportDatas(value)

  }
    const renderListing = () => {
        const loadingWithText = (
            <div className="flex items-center gap-1 w-full justify-center my-8">
                <Loading iconClassName="!w-[2rem] !h-[2rem]"/>
                <Typography variant="title" size="large">Loading</Typography>
            </div>
        )

        if (isLoading || meIsLoading || isRefetching) return loadingWithText
        return (<div>
              {show_pinned_post_only === 0 ?
               <Typography variant="body" size="large" className="mb-4">
            {/* // <Typography className="flex 1text-center py-2  text-secondary-50 !font-normal truncate bodyMedium mb-2"> */}
                This will appear at the top of your profile and replace any previously pinned post.
          </Typography>:
          <Typography variant="body" size="large" className="mb-4">
            {/* // <Typography className="flex 1text-center py-2  text-secondary-50 !font-normal truncate bodyMedium mb-2"> */}
                 This will no longer appear automatically at the top of your profile.
            </Typography>}
          
                  <div className="flex justify-end gap-2">
               
                <button type="button" onClick={handleOnClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
               {show_pinned_post_only === 0 ?
                <button type="submit" 
                onClick={handleSubmit(onSubmit)}
                 className="text-gray-600 px-4 py-2 rounded-md hover:bg-primary hover:text-white ">Pin</button> :
                 <button type="submit" 
                onClick={handleSubmit(handleDeleteButton)}
                 className="text-gray-600 px-4 py-2 rounded-md hover:bg-primary hover:text-white ">Unpin</button>
                 }
                 {/* <button type="submit" 
                onClick={handleSubmit(handleDeleteButton)}
                 className="text-gray-600 px-4 py-2 rounded-md hover:bg-primary hover:text-white ">Unpin</button> */}
                {/* {!unPin && <button type="submit" 
                onClick={handleSubmit(onSubmit)}
                 className="text-gray-600 px-4 py-2 rounded-md hover:bg-primary hover:text-white ">Pin</button>}
                            {unPin &&<button type="submit" 
                onClick={handleSubmit(handleDeleteButton)}
                 className="text-gray-600 px-4 py-2 rounded-md hover:bg-primary hover:text-white ">Unpin</button>} */}
              </div>
        </div>
           
        )
        
    }
    const handleDeleteButton = () => {
        const handleDeleteOnSuccess = () => {
            if (onDeleteSuccess) onDeleteSuccess()
             window.location.reload()
            refetch().then(() => null)
             return reFetchProfileData().then(r => r)
        }

        deleteMutate({}, { 
            onSuccess: handleDeleteOnSuccess });
    }
    if (isSuccess) return <></>
    return(
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleOnClose}>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center tablet:items-center tablet:justify-end tablet:pr-[2.88rem] laptop:justify-center laptop:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="transform overflow-hidden rounded-2xl p-4 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[43%] tablet:px-[1.88rem] laptop:px-[2rem]">
                                {renderHeader()}
                                {renderListing()}
                            
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                    </div>
            </Dialog>
        </Transition>
)
}

export default PinpostModal