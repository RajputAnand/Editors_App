import React, { FC, useState } from "react";
import {
  Control,
  Controller,
  UseFormWatch,
  UseFormResetField,
  UseFormSetValue,
} from "react-hook-form";
import { MaterialSymbol } from "react-material-symbols";
import { FileUploader } from "react-drag-drop-files";
import Typography from "../Typography/Typography";
interface INetworkImageField {
  className?: string;
  coverPhototext?: string;
  draganddroptext?: string;
  control: Control<any>;
  watch: UseFormWatch<any>;
  resetField: UseFormResetField<any>;
  setValue: UseFormSetValue<any>;
  showOnlyPhoto?: boolean;
  isSinglePhotoSelect?: boolean;
  errorMessage?: string;
  name?: any;
  helpText?: string;
  placeHolder?: string;
}
// const ACCEPTED_TYPES = ["image/jpg", "image/png"];
const fileTypes = ["JPG", "PNG"];
const NetworkImageField: FC<INetworkImageField> = (props) => {
  const {
    className,
    coverPhototext,
    draganddroptext,
    control,
    name,

    showOnlyPhoto = true,
  } = props;
  // const handleClickInput = (id: string) => () =>{
  //   if (typeof document !== 'undefined') {
  //  document.getElementById(id)?.click();
  // }
  // }
  // const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  // const renderFiles = () => {
  //   if (watch("choice") == "Image") {
  //     return (
  //       <div
  //         className={`grid grid-cols-2 ${
  //           isSinglePhotoSelect ? "!grid-cols-1" : ""
  //         } gap-1 w-full mb-4`}
  //       >
  //         {Array.from(watch("image"))?.map?.((item: any, index: number) => {
  //           return (
  //             <img
  //               alt="upload image"
  //               className={`rounded border w-full ${
  //                 isSinglePhotoSelect ? "!h-[15rem]" : ""
  //               } h-[10rem] tablet:h-[12rem] laptop:h-[17rem] object-cover`}
  //               src={URL.createObjectURL(item)}
  //               key={index}
  //             />
  //           );
  //         })}
  //       </div>
  //     );
  //   }
  // };
  const handleFileChange = (fileList: File[]) => {
    const filteredFiles = Array.from(fileList);
    setUploadedFiles(filteredFiles);
  };
  // const handleInputChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   onChange: (e: any) => void,
  //   reset: "Video" | "Image"
  // ) => {
  //   const files = event.target.files;
  //   if (!files) return;

  //   const filteredFiles = Array.from(files).filter((file) => {
  //     return ACCEPTED_TYPES.includes(file?.type);

  //     // Check if the file type is acceptable
  //   });
  //   if (filteredFiles.length != 0) {
  //     onChange(filteredFiles);
  //     setValue("choice", reset);
  //     return resetField(reset == "Image" ? "video" : "image");
  //   } else {
  //     toast.error("Oops!The file format you're trying to use isn't supported.");
  //   }
  // };
  return (
    <div
      className={`${className} flex flex-col items-center justify-center w-full gap-[0.31rem] p-[1.06rem]
    border-gray-800 border border-dashed rounded-lg`}
    >
      {showOnlyPhoto && (
        <Controller
          //   name="files"
          name={name}
          control={control}
          defaultValue={[]}
          // rules={{ required: "File upload is required" }}
          render={({ field, fieldState }) => {
            return (
              <React.Fragment>
                <FileUploader
                  {...field}
                  hidden
                  id="cameraInput"
                  handleChange={(fileList: File[]) => {
                    field.onChange(fileList);
                    handleFileChange(fileList);
                  }}
                  name="file"
                  types={fileTypes}
                  hoverTitle="Drop here"
                  multiple="true"
                  classes="custom-file-uploader border-[#46464F]"
                >
                  <div className="custom-file-uploader">
                    {uploadedFiles.length > 0 ? (
                      <div className="uploaded-files-preview">
                        {uploadedFiles.map((file: any, index: any) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={"photo"}
                              className="max-w-[100px] max-h-[100px] object-cover rounded-md"
                            />
                            <span className="mt-2 text-[#0E0E0E] text-base">
                              {file?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-[0.19rem]">
                        <MaterialSymbol
                          icon={"upload"}
                          className="!text-[1.5rem] cursor-pointer b500:!inline-block w-[1.50rem] h-[1.50rem] text-[#92929D]"
                          fill
                          as={"div"}
                        />
                        <span className="tracking-[0.00rem] !text-[#92929D]">
                          {coverPhototext}
                        </span>
                        <span className="text-[12px] text-[#535360]">
                          {draganddroptext}
                        </span>
                      </div>
                    )}
                  </div>
                </FileUploader>
                {Boolean(fieldState.error) && (
                  <Typography
                    isError={Boolean(fieldState.error)}
                    variant="body"
                    size="medium"
                    className="mt-2"
                  >
                    {fieldState.error?.message}
                  </Typography>
                )}
                {/* {errors.files && <p className="error">{errors.files.message}</p>} */}
              </React.Fragment>
            );
          }}
        //   name={"image"}
        />
      )}
    </div>
  );
};
export default NetworkImageField;
