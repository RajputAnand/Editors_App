import {ChangeEvent, FC} from "react";
import Typography from "../../Typography/Typography.tsx";
import {Control, Controller} from "react-hook-form";

interface ISelectBoxField {
    control: Control<any>,
    label?: string,
    name: string,
    className?: string,
    id: string,
    value: string
}

const SelectBoxField: FC<ISelectBoxField> = (props) => {

    const { control, name, className, label, id, value } = props

    const { _formValues } = control
    return (
        <Controller
            control={control}
            render={(({ field }) => {
                const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
                    const currentValues = _formValues?.[name];
                    const updatedValues = currentValues?.includes(event.target.value)
                        ? currentValues.filter((value: any)=> value !== event.target.value)
                        : [...currentValues, event.target.value];
                    return field.onChange(updatedValues)
                }

                return (
                    <div className="inline-flex items-center justify-center">
                        <input className="hidden peer" id={id} type="checkbox" {...field} onChange={handleOnChange} value={value}/>
                        <label htmlFor={id} className={`max-w-[9.5rem] tablet:max-w-none w-full after:pt-[100%] bg-secondary-100 rounded-[1.1875rem] p-4 inline-flex items-center justify-center peer-checked:bg-secondary-200 ${className}`}>
                            <Typography variant="title" size="large" className="text-secondary-900 text-center select-none break-all">{label}</Typography>
                        </label>
                    </div>
                )
            })}
            name={name}
        />
    )
}
export default SelectBoxField