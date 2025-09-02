import { FC, useState } from "react";
import { IWithRouter } from "../../../Hoc/WithRouter.tsx";
import DashboardInnerPageTemplate from "../../../Templates/Dashboard/DashboardInnerPageTemplate.tsx";
import Card from "../../../Components/Cards/Card.tsx";
import { useForm } from "react-hook-form";
import MultiSelectImage from "../../../Components/Inputs/ImageSelect/MultiSelectImage.tsx";
import Button from "../../../Components/Buttons/Button.tsx";
import TextField from "../../../Components/Inputs/TextField.tsx";
import TextAreaField from "../../../Components/Inputs/TextAreaField.tsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery.tsx";
import toast from "react-hot-toast";
import MensionPost from "../../../Components/Inputs/PostMension/MensionPost.tsx";
export const validationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Minimum 1 characters")
    .max(50, "Maximum 50 characters"),
  location: z.string({ required_error: "Location is required" }).optional(),
  choice: z.any(),
  video: z.any(),
  image: z
    .any()
    .refine((val: FileList) => val.length <= 4, "Maximum 4 images")
    .optional(),
  text: z.string({ required_error: "Message is required" }),
});
const AddPostPage: FC<IWithRouter> = (props) => {
  const [selectedUserIds, setSelectedUserIds] = useState<any[]>([]);
  const [values, setValues] = useState<string>("");

  const { endpoints, paths } = props;
  const {
    control,
    handleSubmit,
    watch,
    resetField,
    setValue,
    setError,
    formState,
  } = useForm({
    resolver: zodResolver(validationSchema),
    reValidateMode: "onChange",
  });
  const handlePostOnSuccess = (data: any) => {
    toast.success(data?.message);
    return (window.location.pathname = paths.Home);
  };
  const { mutate, isPending, progress } = useMutationQuery(
    {
      mutationKey: [endpoints.AddPost, "POST"],
      onSuccess: handlePostOnSuccess,
    },
    true,
    setError
  );

  const onSubmit = (data: any) => {
    //  mutate(data);
    if(selectedUserIds){
      const dataIds = JSON.stringify(selectedUserIds);

      mutate({
        choice: data?.choice,
        image: data?.image,
        location: data?.location,
        text: data?.text,
        title: data?.title,
        video: data?.video,
        tagged_message: values,
        tagging_user_ids: dataIds,
      });
    }
    
  };

  return (
    <DashboardInnerPageTemplate navBarProps={{ title: "Add post" }}>
      <Card className="tablet:px-[10%] tablet:py-[5%] mb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <MultiSelectImage
            control={control}
            watch={watch}
            resetField={resetField}
            setValue={setValue}
            errorMessage={formState?.errors.image?.message as string}
          />
          <TextField
            classNameContainer="mb-4"
            classNameOutline="border-none"
            className="bg-[#77768029] placeholder:!text-surface-20"
            control={control}
            placeHolder="Add title"
            name={"title"}
          />
          <TextField
            classNameContainer="mb-4"
            classNameOutline="border-none"
            className="bg-[#77768029] placeholder:!text-surface-20"
            control={control}
            placeHolder="Add location"
            name={"location"}
          />
          <TextAreaField
            classNameContainer="mb-4"
            classNameOutline="border-none"
            className="bg-[#77768029] placeholder:!text-surface-20 h-[10rem]"
            control={control}
            placeHolder="Add your message here ..."
            name={"text"}
          />
          <MensionPost
            classNameContainer="mb-4"
            classNameOutline="border-none"
            className="bg-[#77768029] placeholder:!text-surface-20 h-[10rem]"
            value={values}
            setValue={setValues}
            placeHolder="Tag"
            name={"tags"}
            selectedUserIds={selectedUserIds}
            setSelectedUserIds={setSelectedUserIds}
            control={control}
          />
          <Button
          inProgress={progress}
            isLoading={isPending}
            variant="primary"
            className="w-full h-[3.5rem]"
            type="submit"
          >
            POST
          </Button>
        </form>
      </Card>
    </DashboardInnerPageTemplate>
  );
};

export default AddPostPage;
