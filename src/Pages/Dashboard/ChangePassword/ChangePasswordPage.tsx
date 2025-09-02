import { FC } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import Card from "../../../Components/Cards/Card.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import { useForm } from "react-hook-form";
import Button from "../../../Components/Buttons/Button.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import { z } from "zod";
import { ZOD_PASSWORD } from "../../../Utils/CommonValidation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import Loading from "../../../Components/Common/Loading.tsx";
import toast from "react-hot-toast";

const validationSchema = z
  .object({
    old_password: z.string({ required_error: "Old password is required" }),
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
const ChangePasswordPage: FC<IWithRouter> = (props) => {
  const { endpoints, paths } = props;
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const handleOnSuccess = (data: any) => {
    toast.success(data?.message);
    window.location.pathname = paths.Home;
    return reset();
  };
  const { mutate, isPending } = useMutationQuery({
    mutationKey: [endpoints.ChangePassword, "PUT"],
    onSuccess: handleOnSuccess,
  });
  const { data: profileData, isLoading } = useGetQuery({
    queryKey: [endpoints.Me, "GET"],
  });

  const onSubmit = (data: any) =>
    mutate({
      ...data,
      id: profileData?.data?.id,
    });

  const renderFrom = () => {
    if (isLoading)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      );
    return (
      <form className="tablet:w-[80%] laptop:w-[60%] flex flex-col gap-4 mx-auto my-[4rem]">
        <TextField
          control={control}
          name={"old_password"}
          placeHolder="Current password"
          showPasswordButton
          type="password"
        />
        <TextField
          control={control}
          name={"password"}
          placeHolder="New password"
          showPasswordButton
          type="password"
        />
        <TextField
          control={control}
          name={"password_confirmation"}
          placeHolder="Repeat password"
          showPasswordButton
          type="password"
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          isLoading={isPending}
          disabled={isPending}
          className="titleMedium py-[0.62rem] mb-[2rem] my-[4.5rem]"
          type="submit"
        >
          Save
        </Button>
      </form>
    );
  };

  return (
    <DashboardInnerPageTemplate
      navBarProps={{ title: "Change password" }}
      isMobFullScreen
    >
      <Card className="h-[80%]">{renderFrom()}</Card>
    </DashboardInnerPageTemplate>
  );
};

export default ChangePasswordPage;
