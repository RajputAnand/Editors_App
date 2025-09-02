import {ChangeEvent, FC, useRef} from "react";
import {Control, Controller} from "react-hook-form";
import {MaterialSymbol} from "react-material-symbols";
import Typography from "../../Typography/Typography.tsx";

interface IImageSelectField {
    control: Control<any>,
    name: string,
    helpText?: string,
    classNameContainer?: string,
    isLoading?: boolean
}

const ImageSelectField:FC<IImageSelectField> = (props) => {

    const { control, name, helpText, classNameContainer, isLoading } = props

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => fileInputRef.current?.click();

    return (
        <Controller
            disabled={isLoading}
            render={({ field, fieldState }) => {
                return(
                    <div className={`${classNameContainer}`}>
                        {
                            field.value ? (
                                    <div className="w-[6rem] h-[6rem] cursor-pointer m-auto relative"  onClick={handleButtonClick}>
                                        <img className="profilenotification w-full h-full  rounded-full shadow-[0px_1px_3px_1px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.30)]" alt="user profile" src={URL.createObjectURL(field.value)}/>
                                        <div className="absolute bottom-0 right-0">
                                            <MaterialSymbol className="text-primary text-center bg-white rounded-full !text-[1.8rem]" icon={"add_circle"} fill/>
                                        </div>
                                    </div>
                            ) : (
                                <div className="w-[6rem] h-[6rem] bg-[#0000001F] m-auto flex items-center justify-center cursor-pointer rounded-full relative" onClick={handleButtonClick}>
                                    <MaterialSymbol className="text-white text-center !text-[3.625rem]" icon={"person_2"} fill/>
                                    <div className="absolute bottom-0 right-0">
                                        <MaterialSymbol className="text-primary text-center !text-[1.8rem]" icon={"add_circle"} fill/>
                                    </div>
                                </div>
                            )
                        }
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            {...field}
                            value={field.value?.fileName}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                if (event.target.files?.[0]) return field.onChange(event.target.files[0]);
                            }}
                            ref={fileInputRef}
                        />
                        {(Boolean(fieldState.error)) && <Typography isError={Boolean(fieldState.error)} variant="body" size="medium" className="mt-1 text-center">{fieldState.error?.message}</Typography>}
                        {(helpText) && <Typography variant="body" size="medium" className="pl-4 mt-1">{helpText}</Typography>}
                    </div>
                )
            }}
            control={control}
            name={name}
        />
    )
}

export default ImageSelectField