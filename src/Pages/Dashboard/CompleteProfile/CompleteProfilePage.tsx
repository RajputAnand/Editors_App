import {FC, useEffect} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import OnboardingTemplate from "../../../Templates/Authentication/OnboardingTemplate.tsx";
import {useForm} from "react-hook-form";
import ImageSelectField from "../../../Components/Inputs/ImageSelect/ImageSelectField.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import {z} from "zod";
import {ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE} from "../../../Constants/Common.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import useLogin from "../../../Hooks/useLogin.tsx";
import {useMutationQuery} from "../../../Api/QueryHooks/useMutationQuery.tsx";
import {useDispatch, useSelector} from "react-redux";
import {setAuthData} from "../../../Store/Reducers/AuthReducer.ts";
import toast from "react-hot-toast";
import {ZOD_USERNAME} from "../../../Utils/CommonValidation.ts";

const validationSchema = z.object({
    profile_image: z
        .any()
        .nullable()
        .refine((files) => {
            return !files || (files?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type));
        }, {
            message: "Invalid image. Max size is 5MB, and only .jpg, .jpeg, .png, and .webp formats are supported.",
        }),
    user_name: ZOD_USERNAME
})

const CompleteProfilePage: FC<IWithRouter> = (props) => {
    if (typeof document !== 'undefined') {
        document.title = "Profile | EditorsApp"
    }
    const { paths, endpoints, navigate } = props
    const { Logout } = useLogin();
    const dispatch = useDispatch();
    const selector = useSelector((state: any) => state.AuthData)

    useEffect(() => {
        if (selector.isCompletedProfile) {
            navigate(paths.FindPeople)
        }
    }, [selector])

    const { handleSubmit, control, setError } = useForm({ resolver: zodResolver(validationSchema), mode: "onChange" })
    const handleOnSuccess = (data: any) => {
        toast.success(data?.message)
        dispatch(setAuthData({ isLoggedIn: true, isCompletedProfile: true }))
    }

    const { mutate, isPending } = useMutationQuery({ mutationKey: [endpoints.UpdateProfile, "POST"], onSuccess: handleOnSuccess }, true, setError)

    const TriggerSubmit = (data: any) => mutate(data)

    const handleLogout = () => Logout(paths.SingIn)

    return (
       
        <OnboardingTemplate className="!block tablet:!flex">
            <form className="mt-[7rem] w-full tablet:w-[80%] m-auto">
                <ImageSelectField
                    control={control}
                    name={"profile_image"}
                    classNameContainer="mb-[1.5rem]"
                />
                <TextField
                    defaultValue={selector?.isLoginUsername}
                    control={control}
                    name={"user_name"}
                    placeHolder="Username"
                    classNameContainer="mb-[2.5rem]"
                    // disabled={isPending}
                />
                <Button className="w-full" isLoading={isPending} variant="primary" onClick={handleSubmit(TriggerSubmit)}>Continue</Button>
                <Typography variant={"body"} size={"large"} className="text-center mt-[1.5rem]">Already have an account? <span onClick={handleLogout} className="text-primary cursor-pointer">Sign in</span></Typography>
            </form>
        </OnboardingTemplate>
     
    )
}

export default CompleteProfilePage