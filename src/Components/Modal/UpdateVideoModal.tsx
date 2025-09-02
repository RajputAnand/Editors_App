import {FC, Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import Typography from "../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";
import UpdateSelectCamera from "../Inputs/ImageSelect/UpdateSelectCamera.tsx";
import { useForm } from "react-hook-form";
import Button from "../Buttons/Button.tsx";
import toast from "react-hot-toast";
import { Endpoints } from "../../Api/Endpoints.ts";
import { useMutationQuery } from "../../Api/QueryHooks/useMutationQuery.tsx";
import TextAreaField from "../Inputs/TextAreaField.tsx";
import { PathConstants } from "../../Router/PathConstants.ts";
import { useNavigate } from "react-router-dom";
interface IPostReportModal {
    open: boolean,
    handle: () => void,
    onClose?: () => void,
    onReportSuccess?: () => void,
 
}

const UpdateVideoModal:FC<IPostReportModal> = (props) => {
    const navigate = useNavigate();
    const {open, handle, onClose } = props
   
    const {
        control,
        handleSubmit,
        watch,
        resetField,
        setValue,
        formState,
      } =  useForm()
    const handleOnClose = () => {
        handle()
        if (onClose) onClose()
         window.location.reload()
    }

    const renderHeader = () => {

        return (
            <div className="flex items-center justify-between mb-[1.25rem] cursor-pointer">
             
                <Typography variant={"title"} size={"medium"} className="!text-[1.25rem] !font-medium !leading-[1.89669rem]
                 text-secondary-light">Create video</Typography>
                
                <MaterialSymbol icon={"close"} fill className="!text-[2rem] text-surface-20 cursor-pointer" as={"div"} onClick={handleOnClose}/>
            </div>
        )
    }
    const handlePostOnSuccess = (data: any) => {
        toast.success(data?.message);
        window.location.reload()
        return navigate(PathConstants.Home)
        
      };
    const { mutate, isPending } = useMutationQuery(
        {
          mutationKey: [Endpoints.AddPost, "POST"],
          onSuccess: handlePostOnSuccess,
        },
        true,
      );
    
    const onSubmit = (data: any) =>
        {
           
            mutate(data)
            // mutate({
            //     "title" : "njhugyu",
            //     "video[]" : data.video,
            //     "is_update_page_video" : 1
            // })
            
        }
    const renderListing = () => {
      
        return (<div>
             <form onSubmit={handleSubmit(onSubmit)}>
                <UpdateSelectCamera
                  control={control}
                  watch={watch}
                  resetField={resetField}
                  setValue={setValue}
                
                />
                {watch("Video")|| watch("video") &&
                <TextAreaField
                    classNameContainer="mb-4"
                    classNameOutline="border-none"
                    className="bg-[#77768029] placeholder:!text-surface-20 h-[10rem]"
                    control={control}
                    placeHolder="Add your message here ..."
                    name={"title"}
                />}
                  <Button
            isLoading={isPending}
            variant="primary"
            className="w-full h-[3.5rem]"
            type="submit"
          >
          Create video
          </Button>
                </form>
        </div>
           
        )
        
    }
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
                            <Dialog.Panel className="transform overflow-hidden rounded-2xl p-4 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[43%] tablet:px-[1.88rem] laptop:px-[2rem] mt-20">
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

export default UpdateVideoModal