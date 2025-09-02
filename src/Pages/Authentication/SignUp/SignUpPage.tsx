import { FC, useState } from "react";
import AuthenticationTemplate from "../../../Templates/Authentication/AuthenticationTemplate.tsx";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ZOD_EMAIL,
  ZOD_NAME,
  ZOD_PASSWORD,
  ZOD_COUNTRY,
} from "../../../Utils/CommonValidation.ts";
import Typography from "../../../Components/Typography/Typography.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import CountryField from "../../../Components/Inputs/CountryField.tsx";
const validationSchema = z
  .object({
    name: ZOD_NAME,
    email: ZOD_EMAIL,
    country: ZOD_COUNTRY,
    password: ZOD_PASSWORD("Password"),
    password_confirmation: ZOD_PASSWORD("Repeat password"),
  })
  .refine(
    ({ password, password_confirmation }) => {
      return password === password_confirmation;
    },
    {
      message: "Passwords don't match",
      path: ["password_confirmation"], // path of error
    }
  );

const SignUpPage: FC<IWithRouter> = (props) => {
  if (typeof document !== 'undefined') {
    document.title = "SignUp | EditorsApp";
  }
  const { navigatePage, paths, endpoints, navigate } = props;
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const { control, handleSubmit, setError } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const handleVerifyOtp = (data: any) =>
    navigate(paths.VerifyOtp, { state: { ...data } });

  const { mutate, isPending } = useMutationQuery(
    { mutationKey: [endpoints.SignUp, "POST"], onSuccess: handleVerifyOtp },
    true,
    setError
  );

  const triggerSubmit = (data: any) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/; // E.164 international phone number format
    let emaildata = ""
    let Phonedata = ""
    if (emailPattern.test(data.email)) {
      emaildata = data.email;
    }
    if (phonePattern.test(data.email)) {
      Phonedata = data.email;
    }
    mutate({
      name: data?.name,
      email: emaildata,
      phone: Phonedata,
      phone_code: selectedCountry?.dial_code,
      country: selectedCountry?.name,
      password: data?.password,
      password_confirmation: data?.password_confirmation,
    });
  };


  return (
    <AuthenticationTemplate className={""} sectionClassName="!py-0">
      <form className="m-auto tablet:w-4/5 laptop:w-1/2">
        <TextField
          control={control}
          name="name"
          type="text"
          disabled={isPending}
          placeHolder="Full name"
          classNameContainer="mb-[1.5rem]"
        />
        <CountryField
          control={control}
          placeHolder="Select Country"
          name="country"
          isPending={isPending}
          setSelectedCountry={setSelectedCountry}
        />
        {/* <ReactFlagsSelect
          selected={selected}
        //   onSelect={(country) => setSelected(country)}
        onSelect={handleSelect}
          placeholder="Select Country"
          searchable
          searchPlaceholder="Search countries"
          className="menu-flags mb-[1.5rem]"
        />  */}

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
        <Button
          disabled={isPending}
          isLoading={isPending}
          className="w-full !leading-[1.5rem] my-[1rem] laptop:my-[2rem]"
          onClick={handleSubmit(triggerSubmit)}
          type="submit"
        >
          Sign up
        </Button>
        <Typography variant={"body"} size={"large"} className="text-center">
          Already have an account?{" "}
          <span
            onClick={navigatePage(paths.SingIn)}
            className="text-primary cursor-pointer"
          >
            Sign in
          </span>
        </Typography>
      </form>
    </AuthenticationTemplate>
  );
};

export default SignUpPage;
