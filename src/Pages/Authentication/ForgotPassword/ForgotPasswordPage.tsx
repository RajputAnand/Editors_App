import { FC, Fragment, useState } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import Typography from "../../../Components/Typography/Typography.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ZOD_EMAIL ,ZOD_COUNTRY} from "../../../Utils/CommonValidation.ts";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import OnboardingTemplate from "../../../Templates/Authentication/OnboardingTemplate.tsx";
import toast from "react-hot-toast";
import { COMMON_MESSAGE } from "../../../Constants/Common.ts";
import { MaterialSymbol } from "react-material-symbols";
import CountryField from "../../../Components/Inputs/CountryField.tsx";

const validationSchema = z.object({
  email: ZOD_EMAIL,
  country: ZOD_COUNTRY,
});

const ForgotPasswordPage: FC<IWithRouter> = (props) => {
  const { endpoints, navigatePage, navigate, paths } = props;
  const { control, handleSubmit, setError } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const handleOnSuccess = (data: any) => {
    if (data.success) {
      toast.success(data?.message);
      return setTimeout(
        () => navigate(paths.ResetPassword, { state: { ...data } }),
        2000
      );
    }
    return toast.error(COMMON_MESSAGE);
  };
  const { mutate, isPending } = useMutationQuery(
    {
      mutationKey: [endpoints.ForgotPassword, "PUT"],
      onSuccess: handleOnSuccess,
    },
    false,
    setError
  );
  const triggerSubmit = (data: any) =>{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/; // E.164 international phone number format
    let emaildata = "";
    let Phonedata = "";
    if (emailPattern.test(data.email)) {
      emaildata = data.email;
    }
    if (phonePattern.test(data.email)) {
      Phonedata = data.email;
    }
    if(emaildata){
      mutate({
        email: emaildata,
        phone_code:selectedCountry?.dial_code,
        
      });
    }
    else{
      mutate({
        phone: Phonedata,
        phone_code:selectedCountry?.dial_code,
      
      });
    }
 
  
  }
    //  mutate(data);

  return (
    <OnboardingTemplate>
      <Fragment>
        <div className="flex justify-end">
          <MaterialSymbol
            icon={"close"}
            fill
            className="!text-[1.5rem] cursor-pointer"
            onClick={navigatePage(-1)}
          />
        </div>
        <div className="flex items-center flex-col mt-[1.5rem]">
          <Typography
            variant="display"
            size="small"
            className="text-surface-10 text-center"
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body"
            size="large"
            className="text-center text-surface-20 mt-2 !tracking-normal mb-4"
          >
            Enter the registered email/Phone to get an OTP to reset password.
          </Typography>
        </div>
        <form className="">
          <CountryField
            control={control}
            placeHolder="Select Country"
            name="country"
            isPending={isPending}
            setSelectedCountry={setSelectedCountry}
          />
          <TextField
            control={control}
            name="email"
            type="email"
            placeHolder="Email/Phone"
            disabled={isPending}
            classNameContainer="my-[2rem]"
          />
          <Button
            isLoading={isPending}
            disabled={isPending}
            className="w-full !leading-[1.5rem]"
            onClick={handleSubmit(triggerSubmit)}
            type="submit"
          >
            Reset password
          </Button>
        </form>
      </Fragment>
    </OnboardingTemplate>
  );
};

export default ForgotPasswordPage;
