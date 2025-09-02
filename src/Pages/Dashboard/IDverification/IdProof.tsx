import React, { FC } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import { useForm } from "react-hook-form";
import Card from "../../../Components/Cards/Card.tsx";
import toast from "react-hot-toast";
import DocumentField from "../../../Components/Inputs/ImageSelect/DocumentField.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import { Endpoints } from "../../../Api/Endpoints.ts";
import { useNavigate } from "react-router-dom";
import { PathConstants } from "../../../Router/PathConstants.ts";
import { useGetQuery } from "../../../Api/QueryHooks/useGetQuery.tsx";
import { useSelector } from "react-redux";

const IdProof: FC<IWithRouter> = (props) => {
  const { control, handleSubmit, watch, resetField, setValue, formState } =
    useForm();
  const { endpoints } = props;
  const navigate = useNavigate();
  const selector = useSelector((state: any) => state.AuthData)
const { data} = useGetQuery({ queryKey: [endpoints.Me, "GET"], staleTime: Infinity});

  const handlePostOnSuccess = (data: any) => {
    toast.success(data?.message);
    window.location.reload();
    return navigate(PathConstants.Home);
  };
  const { mutate, isPending } = useMutationQuery(
    {
      mutationKey: [Endpoints.UpdateProfile, "POST"],
      onSuccess: handlePostOnSuccess,
    },
    true
  );

  const onSubmit = (data: any) => {
    mutate({ verification_document: data?.image[0] });
  };

  const renderFrom = () => {
    return (
      <React.Fragment>
        { selector?.isLoginAdminverifiedId === 1 || data?.data?.is_admin_verified === 1? <div className="my-[2%] flex flex-col gap-4 w-[80%] mx-auto h-[80%]">
                <iframe src={data?.data?.verification_document}
                        className={`rounded border w-full h-full  object-cover text-center flex justify-center`}></iframe>
        </div> : 
        <form>
          <div className="my-[2%] flex flex-col gap-4 w-[80%] laptop:w-[60%] mx-auto">
            <label>Upload ID proof</label>
            <DocumentField
              control={control}
              watch={watch}
              resetField={resetField}
              setValue={setValue}
              name={"verification_document"}
            />
            <Button
              isLoading={isPending}
              disabled={isPending}
              className="titleMedium py-[0.62rem] mb-[2rem] my-[1.5rem]"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Verification
            </Button>
          </div>
        </form>
  }
      </React.Fragment>
    );
  };

  return (
    <DashboardInnerPageTemplate
      navBarProps={{ title: "ID verification" }}
      isMobFullScreen={true}
    >
      <Card className="!p-0 overflow-hidden h-[87%] ">{renderFrom()}</Card>
    </DashboardInnerPageTemplate>
  );
};

export default IdProof;
