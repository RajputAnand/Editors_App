import {FC, Fragment} from "react";
import {Control, Controller, FieldPathValue,FieldValues, UseFormWatch,UseFormSetValue} from "react-hook-form";
import {Listbox} from "@headlessui/react";
import Typography from "../../Typography/Typography.tsx";
import {MaterialSymbol} from "react-material-symbols";

interface IDropdown {
    control: Control<any>,
    name: string,
    defaultValue?: FieldPathValue<any, any>,
    label?: string,
    list: Array<{ label: string, value: any }>
      watch?: UseFormWatch<FieldValues>,
}

const  Dropdown:FC<IDropdown> = (props) => {

    const { name, defaultValue, control, label, list,watch} = props

    return (
        <Controller
            defaultValue={defaultValue ?? list[0]}
            control={control}
            render={({ field }) => {
                return (
                    <Listbox value={field.value} onChange={field.onChange}>
                        <div className="relative">
                            <Listbox.Button as={Fragment}>
                                {({ open, value }) => {
                                    return (
                                        <div className="cursor-pointer">
                                            {label && <Typography variant="body" size="large" className="text-black">{label}</Typography>}
                                            <div className="p-4 flex items-center justify-between border rounded-[0.25rem] border-outline-light mt-2">
                                                <Typography variant="body" size="large" className="text-surface-20">{value.label}</Typography>
                                                <MaterialSymbol icon={open ? "arrow_upward" : "arrow_downward"} as={"div"} className="!text-[1.5rem] text-surface-20"/>
                                            </div>
                                        </div>
                                    )
                                }}
                            </Listbox.Button>
                            <Listbox.Options className="absolute bg-surface-1 w-full mt-1 rounded-[0.375rem] px-4 outline-none shadow-[0px_1px_12px_0px_rgba(0,0,0,0.15)] z-10">
                                {list.map((item, key) => {
                                    return (
                                        <Listbox.Option className="py-4" value={item} key={key}>
                                            <Typography variant="body" size="large" className="text-surface-20 cursor-pointer">{item.label}</Typography>
                                        </Listbox.Option>
                                    )
                                })}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                )
            }}
            name={name}
        />
    )
}

export default Dropdown