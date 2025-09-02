import {FC} from "react";
import {Control, Controller, FieldPathValue} from "react-hook-form";
import XDate from 'xdate';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IDateSelector {
    control: Control<any>,
    name: string,
    defaultValue?: FieldPathValue<any, any>
}

const DateSelector:FC<IDateSelector> = (props) => {

    const {name, control, defaultValue} = props
    return (
        <Controller
            control={control}
            defaultValue={defaultValue}
            render={({field}) => {

                const getValue = () => {
                    return field.value
                }

                const handleOnChange = (date: Date | null) => {
                    if (date) {
                        field.onChange(new XDate(date).toString("yyyy-MM-dd"))
                    }
                }

                return (
                    <DatePicker
                        selected={field.value}
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        popperClassName="!z-20"
                        onChange={(date) => handleOnChange(date)}
                        customInput={
                            <div
                                className="w-full rounded border-solid border-[0.063rem] min-h-[3.5rem] border-outline-light flex focus-within:border-primary overflow-auto">
                                <input
                                    type="text"
                                    className="text-base px-4 text-surface-10 font-normal leading-[1.5rem] placeholder:text-surface-20 focus:outline-none w-full"
                                    placeholder="Date of birth"
                                    value={getValue()}
                                    readOnly
                                />
                            </div>
                        }
                    />
                )
            }}
            name={name}
        />
    )
}

export default DateSelector