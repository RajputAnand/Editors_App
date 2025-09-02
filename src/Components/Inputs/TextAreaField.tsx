import {FC, HTMLInputTypeAttribute} from "react";
import {Control, Controller} from "react-hook-form";
import Typography from "../Typography/Typography.tsx";

interface ITextAreaField {
    control: Control<any>,
    label?: string,
    placeHolder?: string,
    name: string,
    helpText?: string,
    type?: HTMLInputTypeAttribute | undefined,
    inputProps?: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
    className?: string,
    classNameContainer?: string,
    classNameOutline?: string,
    showPasswordButton?: boolean,
    disabled?: boolean,
    // tagifyRef?:any,
    // watch?:any
}

const TextAreaField:FC<ITextAreaField> = (props) => {

    const {
        name,
        label,
        control,
        placeHolder,
        helpText,
        className,
        classNameContainer,
        classNameOutline,
        disabled,
        inputProps,
        
        

    } = props

    return (
        <Controller
            control={control}
            render={({ field, fieldState}) => {
              
                return (
                    <div className={`${classNameContainer}`}>
                        {label && <Typography>{label}</Typography>}
                        <div className={`${classNameOutline} w-full rounded border-solid border-[0.063rem] min-h-[3.5rem] border-outline-light flex focus-within:border-primary overflow-auto
                            ${Boolean(fieldState.error) ? "!border-red-600 focus:!border-red-600" : ""}`}>
                            <textarea
                                className={`${className} text-base p-4 px-6 text-surface-10 font-normal leading-[1.5rem] placeholder:text-surface-20 focus:outline-none w-full`}
                                placeholder={placeHolder}
                                disabled={disabled}
                                {...field}
                                defaultValue={field.value || ""}
                                {...inputProps}
                                // ref={tagifyRef}
                                
                            >
                            </textarea>
                        </div>
                        {(Boolean(fieldState.error)) && <Typography isError={Boolean(fieldState.error)} variant="body" size="medium" className="pl-4 mt-1">{fieldState.error?.message}</Typography>}
                        {(helpText) && <Typography variant="body" size="medium" className="pl-4 mt-1">{helpText}</Typography>}
                    </div>
                )
            }}
            name={name}
        />
    )
}

export default TextAreaField