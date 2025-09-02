import React, { FC } from "react";
import {
  Control,
  Controller,
  UseFormWatch,
  UseFormResetField,
  UseFormSetValue,
} from "react-hook-form";
import IconButton from "../../Buttons/IconButton/IconButton.tsx";
import Typography from "../../Typography/Typography.tsx";
import toast from "react-hot-toast";

interface IDocumentField {
  control: Control<any>;
  watch: UseFormWatch<any>;
  resetField: UseFormResetField<any>;
  setValue: UseFormSetValue<any>;
  showOnlyPhoto?: boolean;
  isSinglePhotoSelect?: boolean;
  className?: string;
  errorMessage?: string;
  name?: string
}
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
];
const DocumentField: FC<IDocumentField> = (props) => {
  const {
    control,
    resetField,
    watch,
    setValue,
    showOnlyPhoto = true,
    isSinglePhotoSelect = false,
    className,
    errorMessage,
    name
  } = props;

  const IconClassNames = {
    className: "bg-[#00006E29] !w-[2.5rem] !h-[2.5rem]",
    iconClassName: "text-white !text-[1.6rem]",
    iconFill: false,
  };

  const handleClickInput = (id: string) => () => {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.click();
    }
  }
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (e: any) => void,
    reset: "Video" | "Image"
  ) => {
    //    onChange(event.target.files)
    //     setValue("choice", reset)
    const files = event.target.files;
    if (!files) return;

    const filteredFiles = Array.from(files).filter((file) => {
      return ACCEPTED_TYPES.includes(file?.type);

      // Check if the file type is acceptable
    });
    if (filteredFiles.length != 0) {
      onChange(filteredFiles);
      setValue("choice", reset);
      // setValue("verification_document",filteredFiles)
      return resetField(reset == "Image" ? "video" : "image");
    } else {
      toast.error("Oops!The file format you're trying to use isn't supported.");
    }
  };

  const renderFiles = () => {
    if (watch("choice") == "Video") {
      return (
        <video controls className="w-full h-[18rem] rounded mb-4">
          <source
            src={URL.createObjectURL(watch("video")?.[0])}
            type={watch("video")?.[0]?.type}
          />
          Your browser does not support the video tag.
        </video>
      );

    } else if (watch("choice") == "Image") {
      return (
        <div
          className={`grid grid-cols-2 ${isSinglePhotoSelect ? "!grid-cols-1" : ""
            } gap-1 w-full mb-4`}
        >
          {Array.from(watch("image"))?.map?.((item: any, index: number) => {

            if (item.type == "application/pdf")
              return (
                <iframe src={URL.createObjectURL(item)}
                  className={`rounded border w-full ${isSinglePhotoSelect ? "!h-[15rem]" : ""
                    } h-[10rem] tablet:h-[12rem] laptop:h-[17rem] object-cover`}></iframe>
              );
            else return (
              <img
                alt="upload image"
                className={`rounded border w-full ${isSinglePhotoSelect ? "!h-[15rem]" : ""
                  } h-[10rem] tablet:h-[12rem] laptop:h-[17rem] object-cover`}
                src={URL.createObjectURL(item)}
                key={index}
              />
            );
          })}
        </div>
      );
    }

  };

  return (
    <React.Fragment>
      <div className={`mb-8 ${className}`}>
        {renderFiles()}
        <div className="min-h-[13rem] w-full bg-surface-light rounded-[0.75rem] flex items-center justify-center gap-2">
          {showOnlyPhoto && (<Controller
            control={control}
            render={({ field }) => {
              return (
                <React.Fragment>
                  <label htmlFor={"imageFor"}>
                    <IconButton
                      onClick={handleClickInput("imageMultipleInput")}
                      {...IconClassNames}
                      Icon={"collections"}
                    />
                  </label>
                  <input
                    hidden
                    multiple={!isSinglePhotoSelect}
                    onChange={(event) =>
                      handleInputChange(event, field.onChange, "Image")
                    }
                    id="imageMultipleInput"
                    accept="image/*"
                    type="file"
                  />
                </React.Fragment>
              );
            }}
            name={"image"}
          />
          )}
          {showOnlyPhoto && (<Controller
            control={control}
            render={({ field }) => {
              return (
                <React.Fragment>
                  <label htmlFor={"imageFor"}>
                    {/* <img  src="/assets/Images/pdf.png" alt="pinpost"  
                  className="bg-[#00006E29] !w-[2rem] !h-[2rem] rounded text-white !text-[2rem]"/> */}

                    <IconButton
                      onClick={handleClickInput("pdfMultipleInput")}
                      {...IconClassNames}
                      Icon={"picture_as_pdf"}
                    />
                  </label>
                  <input
                    hidden
                    // multiple={!isSinglePhotoSelect}
                    onChange={(event) =>
                      handleInputChange(event, field.onChange, "Image")
                    }
                    id="pdfMultipleInput"
                    accept="application/pdf"
                    type="file"
                  />
                </React.Fragment>
              );
            }}
            name={"image"}
          />
          )}
        </div>
        {errorMessage && (
          <Typography variant="body" size="large" className="text-red-1 py-2">
            {errorMessage}
          </Typography>
        )}
      </div>
      <Controller
        render={() => <></>}
        control={control}
        name={"choice"}
        defaultValue="Text"
      />
    </React.Fragment>
  );
};

export default DocumentField;
