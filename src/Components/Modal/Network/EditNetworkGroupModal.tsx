import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MaterialSymbol } from "react-material-symbols";
import { useForm } from "react-hook-form";
import Button from "../../Buttons/Button";
import NetworkTextField from "../../Inputs/NetworkTextField";
import NetworkSelectField from "../../Inputs/NetworkSelectField";
import NetworkTextArea from "../../Inputs/NetworkTextArea";
import NetworkImageField from "../../Inputs/NetworkImageField";
import toast from "react-hot-toast";
import NetworkCountryField from "../../Inputs/NetworkCountryField";
import { Endpoints } from "../../../Api/Endpoints";
import { useMutationQuery } from "../../../Api/QueryHooks/useMutationQuery";
import { NetworkGroup } from "../../../Types/networkGroupInfoTypes";
import { queryClient } from "../../../Api/Client";
import Typography from "../../Typography/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ZOD_COUNTRY, ZOD_EMAIL_ONLY, ZOD_PHONE, ZOD_USERNAME } from "../../../Utils/CommonValidation";
interface IAddNetworkModal {
  open: boolean;
  handle: () => void;
  onClose?: () => void;
  networkInfo?: NetworkGroup;
}
const validationSchema = z.object({
  networkname: z
    .string({ required_error: "Network name is required" })
    .min(1, "Minimum 1 characters")
    .max(50, "Maximum 50 characters"),
  username: ZOD_USERNAME,
  country: ZOD_COUNTRY,
  email: ZOD_EMAIL_ONLY.optional().or(z.literal("")),
  phone: ZOD_PHONE.optional(),
  // networkdescription:z.any({ required_error: "Network description is required" }),

  networkdescription: z.string({
    required_error: "Network description is required",
  }),
  purpose_name: z.string({ required_error: "Purpose is required" }),
  network_type: z.string({ required_error: "Network type is required" }),
  coverphoto: z
    .any()
    .refine((val: FileList) => val.length <= 4, "Maximum 4 images"),
  profilephoto: z
    .any()
    .refine((val: FileList) => val.length <= 1, "Maximum 1 images"),
});
const EditNetworkGroupModal: FC<IAddNetworkModal> = (props) => {
  const { open, handle, onClose, networkInfo } = props;
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [isShowEmail, setIsShowEmail] = useState<boolean>(
    networkInfo?.data.is_show_email === 1 ? true : false
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsShowEmail(e.target.checked);
  };

  const handleOnClose = () => {
    handle();
    if (onClose) onClose();
  };
  const { control, handleSubmit, watch, resetField, setValue, setError } =
    useForm({
      defaultValues: {
        networkname: networkInfo?.data.name,
        username: networkInfo?.data.user_name,
        network_type: networkInfo?.data.type,
        purpose_name: networkInfo?.data.purpose,
        networkdescription: networkInfo?.data.description,
        location: networkInfo?.data.location,
        phone: networkInfo?.data.phone_no,
        email: networkInfo?.data.email ?? "",
        website: networkInfo?.data.website,
        country: networkInfo?.data.country,
      },
      reValidateMode: "onChange",
      resolver: zodResolver(validationSchema)
    });
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-[1.25rem]">
        <MaterialSymbol
          icon={"close"}
          fill
          className="!text-[2rem] text-[#80839F] cursor-pointer"
          as={"div"}
          onClick={handleOnClose}
        />
      </div>
    );
  };
  const handlePostOnSuccess = (data: any) => {
    toast.success(data?.message);
    queryClient.invalidateQueries({
      queryKey: ["network-details"],
    });
    handleOnClose();
  };
  const { mutate, isPending } = useMutationQuery(
    {
      mutationKey: [
        Endpoints.UpdateNetwork.replaceWithObject({
          id: networkInfo?.data.id.toString() || "",
        }),
        "POST",
      ],
      onSuccess: (data) => {
        handlePostOnSuccess(data);
        queryClient.invalidateQueries({
          queryKey: ["network-details"],
        });
      },
    },
    true,
    setError
  );

  const onSubmit = (data: any) => {
    const profilePhotoFile =
      data.profilephoto && data.profilephoto.length > 0
        ? data.profilephoto[0]
        : null;
    const coverPhotoFile =
      data.coverphoto && data.coverphoto.length > 0 ? data.coverphoto[0] : null;

    mutate({
      name: data?.networkname,
      user_name: data?.username,
      type: data?.network_type,
      purpose: data?.purpose_name,
      description: data?.networkdescription,
      phone_code: selectedCountry?.dial_code,
      phone_no: data?.phone,
      location: data?.location,
      website: data?.website,
      profile_photo: profilePhotoFile,
      cover_photo: coverPhotoFile,
      country: `${selectedCountry?.name} (${selectedCountry?.code}) [${selectedCountry?.dial_code}]`,
      email: data?.email,
      is_show_email: isShowEmail ? 1 : 0,
    });
  };

  const parseCountryString = (countryString: string) => {
    const countryRegex = /(.+)\s\((\w{2})\)\s\[(\+\d+)\]/;
    const match = countryString.match(countryRegex);

    if (match) {
      const [, name, code, dial_code] = match;
      return { code, dial_code, name };
    }

    return null;
  };

  useEffect(() => {
    if (networkInfo?.data.country) {
      const parsedCountry = parseCountryString(networkInfo.data.country);
      console.log(parsedCountry);

      if (parsedCountry) {
        setSelectedCountry(parsedCountry);
      }
    }
  }, [networkInfo]);
  const renderListing = () => {
    return (
      <div className="w-full min-w-[2.75rem] rounded-lg  bg-white p-[0.06rem] sm:p-[0.06rem]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <h2 className="text-[#0E0E0E] font-bold text-lg">Update Network</h2>
            <p className=" text-[#80839F]">Please fill up the details</p>
          </div>
          <div className="flex items-center justify-between mb-[1.25rem]">
            <MaterialSymbol
              icon={"cancel"}
              className="!text-[2rem] text-[#80839F] cursor-pointer"
              as={"div"}
              onClick={handleOnClose}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[1.00rem] mt-4 mb-4 ">
            <div className="flex !md:flex-col gap-4 sm:flex-col md:p-[5rem] ">
              <NetworkImageField
                coverPhototext="Cover photo"
                draganddroptext="Drag & drop files here [PNG and JPEG supported]"
                control={control}
                watch={watch}
                resetField={resetField}
                setValue={setValue}
                name={"coverphoto"}
                placeHolder={"Cover photo"}
              />
              <NetworkImageField
                coverPhototext="Profile photo"
                draganddroptext="Drag & drop files here [PNG and JPEG supported]"
                control={control}
                watch={watch}
                resetField={resetField}
                setValue={setValue}
                name={"profilephoto"}
                placeHolder={"Profile photo"}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[1.00rem] mt-4 mb-4">
            <div className="flex md:flex-col gap-4">
              <NetworkTextField
                control={control}
                name="networkname"
                placeHolder="Network Name"
                classNameContainer="w-full rounded-lg"
              />
              <NetworkTextField
                control={control}
                name="username"
                placeHolder="UserName"
                classNameContainer="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[1.00rem] mt-4 mb-4">
            <div className="flex md:flex-col gap-4">
              <NetworkSelectField
                control={control}
                name={"network_type"}
                placeHolder="Network Type"
                classNameContainer="w-full"
              />
              <NetworkTextField
                control={control}
                name={"purpose_name"}
                placeHolder="Purpose"
                classNameContainer="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[1.00rem] mt-4 mb-4">
            <NetworkTextArea
              control={control}
              name="networkdescription"
              placeHolder="Network Description"
            />
            <div className="flex flex-col gap-[1.00rem]">
              <NetworkCountryField
                control={control}
                name="country"
                placeHolder="Country"
                setSelectedCountry={setSelectedCountry}
              />
            </div>
            <div className="flex flex-col gap-[1.00rem]">
              <div className="flex md:flex-col gap-4">
                <NetworkTextField
                  control={control}
                  name="phone"
                  placeHolder="Telephone"
                  classNameContainer="w-full rounded-lg"
                />
                <NetworkTextField
                  control={control}
                  name="email"
                  type="email"
                  placeHolder="Email"
                  classNameContainer="w-full rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[1.00rem]">
              <div className="flex md:flex-col gap-4">
                <NetworkTextField
                  control={control}
                  name="location"
                  placeHolder="Location"
                  classNameContainer="w-full rounded-lg"
                />
                <NetworkTextField
                  control={control}
                  name="website"
                  placeHolder="Website"
                  classNameContainer="w-full rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isShowEmail}
                onChange={handleCheckboxChange}
              />
              <Typography className="text-[#92929D]">Show Email</Typography>
            </div>
          </div>
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              className="!leading-none !font-medium w-full text-primary bg-white"
              onClick={handleOnClose}
            >
              Cancel
            </Button>
            <Button
              isLoading={isPending}
              variant="primary"
              className="!leading-none !font-medium w-full"
              type="submit"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    );
  };
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleOnClose}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center tablet:items-center tablet:justify-end tablet:pr-[2.88rem] laptop:justify-center laptop:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="transform overflow-hidden rounded-2xl p-4 text-left align-middle bg-white shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] transition-all w-full tablet:tablet:w-[66%] laptop:w-[43%] tablet:px-[1.88rem] laptop:px-[2rem]">
                {/* {renderHeader()} */}
                {renderListing()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditNetworkGroupModal;
