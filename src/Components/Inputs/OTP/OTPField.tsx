import {FC} from "react";
import {Control, Controller} from "react-hook-form";
import OTPInput, {InputProps} from "./OtpInput.tsx";
import Typography from "../../Typography/Typography.tsx";

interface IOTPField {
    control: Control<any>,
    name: string,
    numInputs: number,
    helpText?: string,
    isPending?: boolean
}

const OTPField: FC<IOTPField> = (props) => {

    const { control, name, numInputs , helpText, isPending} = props

    const renderInput = (inputProps: InputProps, key: number) => {
        return (
            <input autoFocus={key === 0} key={key} {...inputProps}
             disabled={isPending} className="outline-0 border-b border-surface-20 !w-[2rem] text-surface-10 text-base py-2 focus:border-primary"/>
        )
    }

    return (
        <Controller
            control={control}
            render={(({field, fieldState}) => {
                return (
                    <>
                        <OTPInput
                            numInputs={numInputs}
                            containerStyle={"gap-2"}
                            inputType={"number"}
                            value={field.value}
                            onChange={field.onChange}
                            renderInput={renderInput}
                        />
                        {(Boolean(fieldState.error)) && <Typography isError={Boolean(fieldState.error)} variant="body" size="medium" className="mt-2">{fieldState.error?.message}</Typography>}
                        {(helpText) && <Typography variant="body" size="medium" className="pl-4 mt-1">{helpText}</Typography>}
                    </>

                )
            })}
            name={name}
        />
    )
}

export default OTPField