import {DetailedHTMLProps, FC, HTMLInputTypeAttribute, InputHTMLAttributes, useState} from "react";
import {Control, Controller, FieldPathValue} from "react-hook-form";
import Typography from "../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";

interface ITextField {
    control: Control<any>,
    label?: string,
    placeHolder?: string,
    name: string,
    helpText?: string,
    type?: HTMLInputTypeAttribute | undefined,
    inputProps?: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    className?: string,
    classNameContainer?: string,
    classNameOutline?: string,
    showPasswordButton?: boolean,
    disabled?: boolean,
    defaultValue?: FieldPathValue<any, any>
}

const TextField:FC<ITextField> = (props) => {

    const {
        name,
        label,
        control,
        placeHolder,
        helpText,
        type= "text",
        inputProps,
        className,
        classNameContainer,
        classNameOutline,
        showPasswordButton,
        disabled,
        defaultValue
    } = props

    const [ showPassword, setShowPassword ] = useState<boolean>(false);

    const toggleShowPassword = () => setShowPassword(_ => !_)

    const isPassword = type == "password"

    return (
        <Controller
            control={control}
            defaultValue={defaultValue}
            render={({ field, fieldState}) => {
                return (
                    <div className={`${classNameContainer}`}>
                        {label && <Typography>{label}</Typography>}
                        <div className={`${classNameOutline} w-full rounded border-solid border-[0.063rem] min-h-[3.5rem] border-outline-light flex focus-within:border-primary overflow-auto
                            
                            ${isPassword ? " flex-row items-center justify-center overflow-hidden" : ""} 
                            ${Boolean(fieldState.error) ? "!border-red-600 focus:!border-red-600" : ""}`}>
                            <input
                                className={`${className} text-base px-4 text-surface-10 font-normal leading-[1.5rem] placeholder:text-surface-20 focus:outline-none w-full`}
                                placeholder={placeHolder}
                                {...field}
                                disabled={disabled}
                                value={field.value || ""}
                                {...isPassword ? { type: showPassword ? "text" : "password" } : { type: type }}
                                {...inputProps}
                            />
                            {
                                isPassword && showPasswordButton && (
                                    <div>
                                        <div className="w-10 h-10 mr-4 rounded-full cursor-pointer hover:bg-zinc-700/30 flex items-center justify-center" onClick={toggleShowPassword}>
                                            {
                                                showPassword ? (
                                                    <MaterialSymbol className={"z-100 !text-[1.8rem] text-surface-20"} fill icon={"visibility_off"}/>
                                                ) : (
                                                    <MaterialSymbol className={"z-100 !text-[1.8rem] text-surface-20"} fill icon={"visibility"}/>
                                                )
                                            }

                                        </div>
                                    </div>
                                )
                            }
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

export default TextField;