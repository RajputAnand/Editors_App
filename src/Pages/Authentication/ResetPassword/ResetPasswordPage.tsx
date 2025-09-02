import {FC} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import OnboardingTemplate from "../../../Templates/Authentication/OnboardingTemplate.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import {z} from "zod";
import {ZOD_OTP, ZOD_PASSWORD} from "../../../Utils/CommonValidation.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutationQuery} from "../../../Api/QueryHooks/useMutationQuery.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";

const validationSchema = z.object({
    otp: ZOD_OTP,
    password: ZOD_PASSWORD("Password"),
    password_confirmation: ZOD_PASSWORD("Confirm password")
}).refine(({ password, password_confirmation }) => {
    return password === password_confirmation
}, {
    message: "Passwords don't match",
    path: ["password_confirmation"], // path of error
})

const ResetPasswordPage:FC<IWithRouter> = (props) => {

    const {endpoints, location, navigatePage, paths} = props
    if (location.state.code != 200) navigatePage(paths.ERROR404);
    const { control, handleSubmit, setError} = useForm({ resolver: zodResolver(validationSchema) });
    const { mutate, isPending, data, isSuccess } = useMutationQuery({ mutationKey: [endpoints.ChangePassword, "PUT"]}, false, setError)
    const triggerSubmit = (data: any) => mutate({
        ...data,
        ...location.state.data,
        old_password: ""
    });


    if (isSuccess && data?.success) return (
        <section className="flex-grow responsiveContainer flex items-center justify-center flex-col">
            <Typography variant="title" size="large" className="text-center tablet:text-[1.75rem] tablet:leading-[2.25rem] laptop:text-[2rem] laptop:leading-[2.5rem]">Password reset successful. Sign in back again.</Typography>
            <Button variant="primary" onClick={navigatePage(paths.SingIn)} className="mt-[1.5rem]">Sign in</Button>
        </section>
    )

    return (
        <OnboardingTemplate>
            <div className="mt-[4rem] tablet:mt-[3rem]">
                <Typography variant="display" size="small" className="text-surface-10 text-center">Reset Password</Typography>
            </div>
            <form className="mt-[2rem]">
                <TextField
                    control={control}
                    name="password"
                    type="password"
                    disabled={isPending}
                    placeHolder="Password"
                    showPasswordButton={true}
                    inputProps={{ autoComplete: "off" }}
                    classNameContainer="mb-[1rem]"
                />
                <TextField
                    control={control}
                    name="password_confirmation"
                    type="password"
                    placeHolder="Repeat password"
                    showPasswordButton={true}
                    disabled={isPending}
                    inputProps={{ autoComplete: "off" }}
                    classNameContainer="mb-[1rem]"
                />
                <TextField
                    control={control}
                    name="otp"
                    type="number"
                    placeHolder="OTP"
                    disabled={isPending}
                    inputProps={{ autoComplete: "off" }}
                    classNameContainer="mb-[1rem]"
                />
                <Button disabled={isPending} isLoading={isPending} className="w-full !leading-[1.5rem] mt-[1rem] laptop:mt-[2rem]" onClick={handleSubmit(triggerSubmit)} type="submit">Reset password</Button>
                <Button className="w-full !leading-[1.5rem] mb-[1rem] mt-2 laptop:mb-[1rem]" variant="outline" onClick={navigatePage(paths.SingIn)} type={"button"}>Cancel</Button>
            </form>
        </OnboardingTemplate>
    )
}

export default ResetPasswordPage