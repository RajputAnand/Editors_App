import { FC } from "react";
import { IWithRouter } from "../../../../Hoc/WithRouter.tsx";
import Card from "../../../../Components/Cards/Card.tsx";
import MultiSelectImage from "../../../../Components/Inputs/ImageSelect/MultiSelectImage.tsx";
import { useForm } from "react-hook-form";
import TextField from "../../../../Components/Inputs/TextField.tsx";
import Button from "../../../../Components/Buttons/Button.tsx";
import { useMutationQuery } from "../../../../Api/QueryHooks/useMutationQuery.tsx";
import { z } from "zod";
import { ZOD_TITLE } from "../../../../Utils/CommonValidation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import Live from "../Live.tsx";

const ValidationSchema = z.object({
    title: ZOD_TITLE,
    image: z.any().refine(val => val?.length > 0, "Image is required")
})

const LiveTab: FC<IWithRouter> = (props) => {

    const { endpoints, params, navigate, paths } = props

    const { id, channel_id } = params

    const { watch, setValue, resetField, control, handleSubmit, formState, reset: fromReset } = useForm({ resolver: zodResolver(ValidationSchema) });
    const { errors } = formState

    const { mutate, isPending, reset } = useMutationQuery({ mutationKey: [endpoints.CreateLive, "POST"], onSuccess: (data: any) => navigate(paths.LiveNow.replaceWithObject({ channel_id: data?.channel_id, id: data?.id }), { state: { isHost: true } }) }, true)

    const onSubmit = (data: any) => mutate({
        ...data,
        image: data?.image?.[0]
    })


    const renderLiveScreen = () => {
        if (id && channel_id) return <Live channelId={channel_id} id={id} reset={reset} fromReset={fromReset} {...props} />
        return (
            <form onSubmit={handleSubmit(onSubmit)} className="tablet:px-[10%] laptop:px-[20%] py-[5%]">
                <MultiSelectImage
                    showOnlyPhoto={false}
                    isSinglePhotoSelect={true}
                    control={control}
                    watch={watch}
                    resetField={resetField}
                    setValue={setValue}
                    errorMessage={errors?.image && errors?.image.message as string}
                />
                <TextField
                    control={control}
                    name={"title"}
                    placeHolder={"Add your title..."}
                    classNameContainer="pb-[2.5rem]"
                />
                <Button type="submit" isLoading={isPending} variant="primary" className="w-full h-[3.5rem]">Go live</Button>
            </form>
        )
    }

    return (
        <Card>
            {renderLiveScreen()}
        </Card>
    )
}

export default LiveTab