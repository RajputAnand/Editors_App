import React, { FC, useEffect } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import { useForm } from "react-hook-form";
import ProfileImagePicker from "../../../Components/Inputs/ProfileImagePicker/ProfileImagePicker.tsx";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import Card from "../../../Components/Cards/Card.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import { z } from "zod";
import { ZOD_ADDRESS, ZOD_BIO, ZOD_DATE, ZOD_EMAIL_ONLY, ZOD_HOBBY, ZOD_LOCATION, ZOD_NAME, ZOD_PHONE, ZOD_SCHOOL, ZOD_USERNAME, ZOD_WEBSITE_OPTIONAL } from "../../../Utils/CommonValidation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import toast from "react-hot-toast";
import DateSelector from "../../../Components/Inputs/DatePicker/DatePicker.tsx";
import CountryCodePhone from "../../../Components/Inputs/CountryCodePhone.tsx";
import { PathConstants } from "../../../Router/PathConstants.ts";


const validationSchema = z.object({
    profile_image: z.any().optional(),
    banner_image: z.any().optional(),
    name: ZOD_NAME,
    user_name: ZOD_USERNAME,
    bio: ZOD_BIO,
    dob: ZOD_DATE,
    address: ZOD_ADDRESS,
    location: ZOD_LOCATION,
    phone: ZOD_PHONE.optional(),
    email: ZOD_EMAIL_ONLY,
    hobby: ZOD_HOBBY,
    school: ZOD_SCHOOL,
    website: ZOD_WEBSITE_OPTIONAL
})

const EditProfilePage: FC<IWithRouter> = (props) => {

    const { endpoints, navigate } = props

    const { control, watch, handleSubmit, setError } = useForm({ resolver: zodResolver(validationSchema) })
    const { data, isPending: isLoading, refetch } = useGetQuery({ queryKey: [endpoints.Me, "GET"], staleTime: Infinity });
    const handleOnSuccess = (data: any) => {
        refetch()
        toast.success(data?.message)
        navigate(PathConstants.Profile)
    }
    const { isPending, mutate } = useMutationQuery({ mutationKey: [endpoints.Me, "POST"], onSuccess: handleOnSuccess }, true, setError)

    useEffect(() => {
        refetch().then(() => null)
        return () => { }
    }, [])

    const onSubmit = (data: any) => {
        console.log("submit clicked");

        mutate(data)
    }
    const renderFrom = () => {
        if (isLoading) return (
            <div className="w-full h-full flex items-center justify-center">
                <Loading />
            </div>
        )
        return (
            <React.Fragment>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ProfileImagePicker
                        watch={watch}
                        control={control}
                        {...data?.data}
                    />
                    <div className="my-[2%] flex flex-col gap-4 w-[80%] laptop:w-[60%] mx-auto">
                        <TextField control={control} placeHolder="Name" name={"name"} defaultValue={data?.data?.name} />
                        <TextField control={control} placeHolder="Username" name={"user_name"} defaultValue={data?.data?.user_name} />
                        <TextField control={control} placeHolder="Enter short desc of yourself" name={"bio"} defaultValue={data?.data?.bio} />
                        <DateSelector control={control} name={"dob"} defaultValue={data?.data?.dob} />
                        <TextField control={control} placeHolder="Address" name={"address"} defaultValue={data?.data?.address} />
                        <TextField control={control} placeHolder="Location" name={"location"} defaultValue={data?.data?.location} />
                        {/* <TextField control={control} placeHolder="Phone Number" name={"phone"} defaultValue={data?.data?.phone}/> */}
                        <CountryCodePhone control={control} placeHolder="Phone Number" name={"phone"} defaultValue={data?.data?.phone} />
                        <TextField control={control} placeHolder="Email" name={"email"} defaultValue={data?.data?.email} />
                        <TextField control={control} placeHolder="Hobby" name={"hobby"} defaultValue={data?.data?.hobby} />
                        <TextField control={control} placeHolder="School" name={"school"} defaultValue={data?.data?.school} />
                        <TextField control={control} placeHolder="Website" name={"website"} defaultValue={data?.data?.website} />
                        <Button
                            isLoading={isPending}
                            disabled={isPending}
                            className="titleMedium py-[0.62rem] mb-[2rem] my-[1.5rem]"
                            type="submit"
                        // onClick={handleSubmit(onSubmit)}
                        >
                            Update
                        </Button>
                    </div>
                </form>
            </React.Fragment>
        )
    }
    useEffect(() => {
        console.log('control state:', control);
        console.log('watch values:', watch());
    }, [control, watch]);
    return (
        <DashboardInnerPageTemplate navBarProps={{ title: "Edit Profile" }} isMobFullScreen={true}>
            <Card className="!p-0 overflow-auto h-[95%] ">
                {renderFrom()}
            </Card>
        </DashboardInnerPageTemplate>
    )
}

export default EditProfilePage