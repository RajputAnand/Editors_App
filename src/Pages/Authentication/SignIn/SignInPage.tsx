import { FC, useState } from "react";
import Typography from "../../../Components/Typography/Typography.tsx";
import { useForm } from "react-hook-form";
import TextField from "../../../Components/Inputs/TextField.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ZOD_EMAIL,
  ZOD_SIGN_IN_PASSWORD,
  ZOD_COUNTRY
} from "../../../Utils/CommonValidation.ts";
import Button from "../../../Components/Buttons/Button.tsx";
import OR from "../../../Components/Common/OR.tsx";
import AuthenticationTemplate from "../../../Templates/Authentication/AuthenticationTemplate.tsx";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import useLogin from "../../../Hooks/useLogin.tsx";
import CountryField from "../../../Components/Inputs/CountryField.tsx";

const validationSchema = z.object({
  email: ZOD_EMAIL,
  country: ZOD_COUNTRY,
  password: ZOD_SIGN_IN_PASSWORD,
});

const SignInPage: FC<IWithRouter> = (props) => {
  if (typeof document !== 'undefined') {
    document.title = "See Updates from around the world | EditorsApp";
  }
  const { navigatePage, paths, endpoints } = props;
  const { UpdateLoginDetails,UpdateLoginSuccess} = useLogin();
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const { control, handleSubmit, setError } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const { mutate, isPending } = useMutationQuery(
    { mutationKey: [endpoints.SignIn, "POST"], 
      // onSuccess: UpdateLoginDetails
      onSuccess:UpdateLoginSuccess },
    false,
    setError
  );

  const triggerSubmit = (data: any) => {
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
        password: data?.password,
      });
    }
    else{
      mutate({
        phone: Phonedata,
        phone_code:selectedCountry?.dial_code,
        password: data?.password,
      });
    }
 
  };
  //  mutate(data)

  return (
    <AuthenticationTemplate>
      <form className="m-auto tablet:w-4/5 laptop:w-1/2">
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
          classNameContainer="mb-[1.5rem]"
        />
        <TextField
          control={control}
          name="password"
          type="password"
          placeHolder="Password"
          disabled={isPending}
          showPasswordButton={true}
          inputProps={{ autoComplete: "off" }}
          classNameContainer="mb-[1rem]"
        />
        <Typography
          size="medium"
          variant="body"
          className="text-end cursor-pointer text-surface-10"
          nodeProps={{ onClick: navigatePage(paths.ForgotPassword) }}
        >
          Forgot password?
        </Typography>
        <Button
          isLoading={isPending}
          disabled={isPending}
          className="w-full !leading-[1.5rem] my-[1rem]"
          onClick={handleSubmit(triggerSubmit)}
          type="submit"
        >
          Sign in
        </Button>
        <OR />
        <div className={"mt-[0.5rem] mx-[1.81rem]"}>
          <Button
            className="w-full !leading-[1.5rem] !font-medium !text-secondary-900"
            onClick={navigatePage(paths.SingUp)}
            type="button"
            variant="secondary"
          >
            Create account
          </Button>
        </div>
      </form>
    </AuthenticationTemplate>
  );
};

export default SignInPage;
