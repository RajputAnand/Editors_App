import {FC, useCallback, useEffect, useState} from "react";
import {IWithRouter} from "../../../Hoc/WithRouter.tsx";
import OnboardingTemplate from "../../../Templates/Authentication/OnboardingTemplate.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Button from "../../../Components/Buttons/Button.tsx";
import OTPField from "../../../Components/Inputs/OTP/OTPField.tsx";
import {z} from "zod";
import {ZOD_OTP} from "../../../Utils/CommonValidation.ts";
import {useMutationQuery} from "../../../Api/QueryHooks/useMutationQuery.tsx";
import toast from "react-hot-toast";
import {OTP_RESEND_TIME} from "../../../Constants/Common.ts";
import useLogin from "../../../Hooks/useLogin.tsx";
import {MaterialSymbol} from "react-material-symbols";

const validationSchema = z.object({
    otp: ZOD_OTP
})

const VerifyOtpPage:FC<IWithRouter> = (props) => {

    const {location, navigatePage, paths, navigate, endpoints} = props;
    if (!Boolean(typeof location.state.data.id === "number")) navigatePage(paths.ERROR404);
    const { control, handleSubmit, setError } = useForm({ resolver: zodResolver(validationSchema) });

    const { UpdateLoginDetails } = useLogin()
const timoutMinute={min:14,sec:60}
// const timoutMinute={min:1,sec:0}
    const [timer, setTimer] = useState(15);
    const [minutes, setminutes] = useState<number>(timoutMinute.min)
    const [seconds, setseconds] = useState<number>(timoutMinute.sec)
    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setseconds(seconds - 1)
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval)
                }
                else {
                    setseconds(59)
                    setminutes(minutes - 1)
                }
            }
        }, 1000);
        return () => {
            clearInterval(interval)
        }
        
    }, [seconds])
    const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), []);
    useEffect(() => {
        timer > 0 && setTimeout(timeOutCallback, 1000 * 60);
    }, [timer, timeOutCallback]);


    const handleReSendOTPSuccess = (data: any) => {
        toast.remove("resending")
        toast.success(data?.message)
        
        setminutes(timoutMinute.min)
        setseconds(timoutMinute.sec)
        //return setTimer(OTP_RESEND_TIME)
    }

    const handleReSendOTPOnMutate = () => toast.loading("Sending OTP", { id: "resending" })


    const { mutate: resendMutate  } = useMutationQuery({ mutationKey:[endpoints.ResendOtp, "POST"], onSuccess: handleReSendOTPSuccess, onMutate: handleReSendOTPOnMutate }, false)
    const { mutate, isPending } = useMutationQuery({ mutationKey: [endpoints.VerifyOtp, "POST"], onSuccess: UpdateLoginDetails}, false, setError);

    const resetTimer = () => resendMutate({ user_id: location.state.data.id })

    const handleVerifyOtp = (data: any) => mutate({ ...data, user_id: location.state.data.id })

    const handleBackButton = () => navigate(paths.SingIn, { replace: true })


    return (
        <OnboardingTemplate>
            <div className="flex items-center justify-center mt-[3rem] flex-col">
                <MaterialSymbol icon={"lock"} fill className="text-[#9DA3FF] !text-[4rem] mb-[3rem]"/>
                <Typography variant="display" size="small" className="text-surface-10 text-center">Verification</Typography>
                <Typography variant="body" size="large" className="text-center text-black mt-2">Enter the verification code send to your email/Phone</Typography>
                {/* {timer > 0 ?
                    (<Typography variant="body" size="large" className="text-center mt-2 text-primary">Time remaining: {timer} seconds</Typography>)
                    :
                    (<Typography variant="body" size="large" className="text-center mt-2 text-[#BA1A1A]">Timeout. Try again.</Typography>)
                } */}
                   {/* {seconds > 0 && minutes !=0 ? */}
                   { seconds != 0 || minutes != 0 ?
                    (<Typography variant="body" size="large" className="text-center mt-2 text-[#BA1A1A]">Time remaining:  {minutes < 10 ? `0${minutes}` : minutes} min
                    {""} {seconds < 10 ? `0${seconds}` : seconds}{""} sec</Typography>)
                    :
                    (<Typography variant="body" size="large" className="text-center mt-2 text-[#BA1A1A]">Timeout. Try again.</Typography>)
                }
                <div className="my-4">
                    <OTPField
                        control={control}
                        numInputs={6}
                        name={"otp"}
                        isPending={isPending}
                    />
                </div>
                <div className="w-full flex justify-end mb-4">
                    {/* <Typography variant="body" size="large" nodeProps={{ onClick: timer <= 0 ? resetTimer : () => {} }} className={`text-center text-primary mt-2 ${timer <= 0 ? "cursor-pointer" : "text-surface-20"}`}>Resend OTP</Typography> */}
                    <Typography variant="body" size="large" nodeProps={{ onClick: seconds <= 0 && minutes === 0 ? resetTimer : () => {} }} className={`text-center text-primary mt-2 ${seconds <= 0 && minutes === 0 ? "cursor-pointer" : "text-surface-20"}`}>Resend OTP</Typography>
                </div>
                <div className="w-full my-2">
                    <Button isLoading={isPending} onClick={handleSubmit(handleVerifyOtp)} className="w-full">Verify</Button>
                    <Button disabled={isPending} onClick={handleBackButton} variant="outline" className="w-full mt-2">Cancel</Button>
                </div>
            </div>
        </OnboardingTemplate>
    )
}

export default VerifyOtpPage