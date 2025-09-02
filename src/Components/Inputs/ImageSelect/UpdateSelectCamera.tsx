import React, { FC, useState, useRef } from "react";
import {
  Control,
  Controller,
  UseFormWatch,
  UseFormResetField,
  UseFormSetValue,
} from "react-hook-form";
import IconButton from "../../Buttons/IconButton/IconButton.tsx";
import toast from "react-hot-toast";
import Button from "../../Buttons/Button.tsx";
import Typography from "../../Typography/Typography.tsx";
import Loading from "../../Common/Loading.tsx";
// import RecordRTC from 'recordrtc';
interface IMultiSelectImage {
  control: Control<any>;
  watch: UseFormWatch<any>;
  resetField: UseFormResetField<any>;
  setValue: UseFormSetValue<any>;
  showOnlyPhoto?: boolean;
  isSinglePhotoSelect?: boolean;
  className?: string;
  errorMessage?: string;
}
const ACCEPTED_TYPES = [
  "video/mp4",
  "video/mov",
  "video/wmv",
  "video/avi",
  "video/flv",
  "video/mkv",
  "video/mpeg",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
];
const UpdateSelectCamera: FC<IMultiSelectImage> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordingCamera, setRecordingCamera] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const [recordMode, setRecordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordUrl, setRecordUrl] = useState<any>("");
  const [isRecording, setIsRecording] = useState(false);
  const recordedChunks = useRef<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [camera, setCamera] = useState(false);
  const {
    control,
    resetField,
    watch,
    setValue,
    showOnlyPhoto = true,
    isSinglePhotoSelect = false,
    className,
    errorMessage,
  } = props;

  const IconClassNames = {
    className: "bg-[#00006E29] !w-[2.5rem] !h-[2.5rem]",
    iconClassName: "text-white !text-[1.6rem]",
    iconFill: false,
  };

  const handleClickInput = (id: string) => () =>{
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
    setRecordMode(false);
    setVideoUrl("");
    const files = event.target.files;
    if (!files) return;

    const filteredFiles = Array.from(files).filter((file) => {
      return ACCEPTED_TYPES.includes(file?.type);

      // Check if the file type is acceptable
    });
    if (filteredFiles.length != 0) {
      onChange(filteredFiles);
      setValue("is_update_page_video", 1);
      setValue("choice", reset);

      return resetField(reset == "Image" ? "video" : "image");
    } else {
      toast.error("Oops!The file format you're trying to use isn't supported.");
    }
  };
  const loadingWithText = (
    <div className="flex items-center gap-1 w-full justify-center my-8">
      <Loading iconClassName="!w-[2rem] !h-[2rem]" />
      <Typography variant="title" size="large">
        Loading
      </Typography>
    </div>
  );
  const renderFilesRecord = () => {
    if (loading) return loadingWithText;
    return (
      <div className="ml-2 mr-2 rounded-md justify-center text-center">
        {videoUrl ? (
          <div>
            <video
              controls={true}
              id="video1"
              className="w-full rounded mb-4"
              //  playsInline
              width="100%"
              height="100%"
              autoPlay
            >
              <source src={videoUrl} type={watch("video")?.[0]?.type} />
              Your browser does not support the video tag.
            </video>
            {/* <video
              src={videoUrl}
              controls
              className="w-full h-[18rem] rounded mb-4"
              // style={{ width: '100%', maxHeight: '400px' }}
            /> */}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            className="w-full rounded mb-4"
            //  style={{ width: '100%', maxHeight: '400px' }}
            width="640"
            height="480"
            playsInline
            // muted
          />
        )}
        <div>
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="!leading-none !font-medium min-w-[9.38rem] bg-primary mb-2"
            >
              Start
            </Button>
          ) : (
            <div>
              <Button
                onClick={stopRecording}
                className="!leading-none !font-medium min-w-[9.38rem] bg-gray-400 mb-2"
              >
                Stop
              </Button>
            </div>
          )}
        </div>
      </div>
    );
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
          className={`grid grid-cols-2 ${
            isSinglePhotoSelect ? "!grid-cols-1" : ""
          } gap-1 w-full mb-4`}
        >
          {Array.from(watch("image"))?.map?.((item: any, index: number) => {
            return (
              <img
                alt="upload image"
                className={`rounded border w-full ${
                  isSinglePhotoSelect ? "!h-[15rem]" : ""
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
  const startRecording = async () => {
    setRecordMode(true);
    // setLoading(true)
    setRecordingCamera(false);
    setVideoUrl("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // setLoading(false);
      }
    } catch (err) {
      setCamera(true);
      toast.error("Error accessing the camera");
    }

    recordedChunks.current = [];
    var mediaRecorder = new MediaRecorder(
      videoRef.current?.srcObject as MediaStream,
      {
        mimeType: "video/webm; codecs=vp9",
      }
    );
    // setLoading(true)
    // const options = { mimeType: 'video/webm; codecs=vp9' };
    // const mediaRecorder = new MediaRecorder(videoRef.current?.srcObject as MediaStream, options);
    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };
    // setLoading(false)
    mediaRecorder.onstop = () => {
      const blob1 = new Blob(recordedChunks.current, { type: "video/webm" });
      var blob = new Blob(recordedChunks.current, { type: "video/mp4" });
      const files = new File([blob], "video.mp4", { type: "video/mp4" });
      setValue("video", [files]);
      setValue("is_update_page_video", 1);
      setValue("choice", "Video");
      const url = URL.createObjectURL(blob1);
      setVideoUrl(url);
    };

    mediaRecorder.start();

    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    // Stop the camera stream
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    stream.getTracks().forEach((track) => {
      if (track.readyState == "live" && track.kind === "video") {
        track.stop();
      }
    });
  };

  React.useEffect(() => {}, []);
  // camera permissinon is not
  const renderCamera = () => {
    if (camera) return <></>;
    if (recordingCamera)
      return (
        <div className="text-center">
          <Button
            onClick={startRecording}
            className="!leading-none !font-medium min-w-[9.38rem] bg-primary mb-2"
          >
            Start
          </Button>
        </div>
      );
    if (recordMode) return renderFilesRecord();
    if (!recordMode) return renderFiles();
  };

  return (
    <React.Fragment>
      <div className={`mb-8 ${className} mt-2`}>
        {renderCamera()}
        {/* {recordMode  ? renderFilesRecord() : renderFiles()} */}
        <div className="min-h-[13rem] w-full bg-surface-light rounded-[0.75rem] flex items-center justify-center gap-2">
          <div></div>

          {showOnlyPhoto && (
            <Controller
              control={control}
              render={({ field }) => {
                return (
                  <React.Fragment>
                    <label htmlFor={"imageFor"}>
                      <IconButton
                        onClick={() => setRecordingCamera(true)}
                        // onClick={startRecording}
                        {...IconClassNames}
                        Icon={"photo_camera"}
                      />
                    </label>
                  </React.Fragment>
                );
              }}
              name={"video"}
            />
          )}
          {showOnlyPhoto && (
            <Controller
              control={control}
              render={({ field }) => {
                return (
                  <React.Fragment>
                    <label htmlFor={"imageFor"}>
                      <IconButton
                        onClick={handleClickInput("videoInput")}
                        {...IconClassNames}
                        Icon={"videocam"}
                      />
                    </label>
                    <input
                      hidden
                      onChange={(event) =>
                        handleInputChange(event, field.onChange, "Video")
                      }
                      id="videoInput"
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                    />
                  </React.Fragment>
                );
              }}
              name={"video"}
            />
          )}
        </div>
      </div>
      {/* <Controller
        render={() => <></>}
        control={control}
        name={"choice"}
        defaultValue="Text"
      /> */}
    </React.Fragment>
  );
};

export default UpdateSelectCamera;
