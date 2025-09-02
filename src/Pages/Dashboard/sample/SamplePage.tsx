import React, { FC, useEffect } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import { useForm } from "react-hook-form";
import TextField from "../../../Components/Inputs/TextField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import { z } from "zod";
import { DeleteData } from "../../../Constants/Common.ts";
import { ZOD_EMAIL } from "../../../Utils/CommonValidation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import Dropdown from "../../../Components/Inputs/Dropdown/Dropdown.tsx";
import TextAreaField from "../../../Components/Inputs/TextAreaField.tsx";
import Card from "../../../Components/Cards/Card.tsx";
import { Endpoints } from "../../../Api/Endpoints.ts";
import toast from "react-hot-toast";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import { useSelector } from "react-redux";
import useLogin from "../../../Hooks/useLogin.tsx";
import { PathConstants } from "../../../Router/PathConstants.ts";
const validationSchema = z.object({
  email: ZOD_EMAIL,
  //  text: z.string({ required_error: "Message is required" }),
});

const SamplePage: FC<IWithRouter> = (props) => {
  const selector = useSelector((state: any) => state.AuthData)
  const { Logout } = useLogin()
  const {
    control,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const handlePostOnSuccess = (data: any) => {
     toast.success(data?.message);
     Logout(PathConstants.SingIn)
  };
  const { mutate, isPending } = useMutationQuery({mutationKey: [Endpoints.DeleteAccount, "POST"],onSuccess: handlePostOnSuccess,},
    true,
    setError
  );
  useEffect(() => {
    console.log("reason", watch("reason"));
  }, [watch("reason")]);
  const onSubmit = (data: any) => {
  
    if(selector.isLoginEmail != watch("email") ) return toast.error("Unauthorised email")
    else if(watch("reason.value") === 5)
      {
        if (watch("text") === undefined) 
          return setError("text", { type: "custom", message: "Message is required" });
        else
        mutate({
          email:watch("email"),
          reason:watch("reason.label"),
          other_reason:watch("text")
        })
      }
    else
    mutate({
      email:watch("email"),
      reason:watch("reason.label"),
      other_reason:watch("text")
    })
  };
 

  const renderFrom = () => {
    return (
      <React.Fragment>
        <form>
          <div className="my-[2%] flex flex-col gap-4 w-[80%] laptop:w-[60%] mx-auto">
            <TextField
              control={control}
              label="Email"
              name="email"
              type="email"
              placeHolder="Confirm your email address"
              //  disabled={isPending}
              classNameContainer="mb-[1rem]"
            />
            <Dropdown
              label={"Reason"}
              control={control}
              name="reason"
              list={DeleteData}
              watch={watch}
            />
            {watch("reason.value") == 5 ? (
              <TextAreaField
                label={
                  "Please describe why you would like to delete this account *"
                }
                classNameContainer="my-[1rem]"
                classNameOutline="border-none"
                className="bg-[#77768029] placeholder:!text-surface-20 h-[10rem]"
                control={control}
                placeHolder="Add your message here ..."
                name={"text"}
              />
            ) : (
              <></>
            )}
            <Button
              isLoading={isPending}
              disabled={isPending}
              className="titleMedium py-[0.62rem] mb-[2rem] my-[1.5rem]"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </div>
        </form>
      </React.Fragment>
    );
  };

  return (
    <DashboardInnerPageTemplate
      navBarProps={{ title: "Account Deletion Request Form" }}
      isMobFullScreen={true}
    >
      <Card className="!p-0 overflow-hidden h-[87%] ">{renderFrom()}</Card>
    </DashboardInnerPageTemplate>
  );
};
export default SamplePage;
