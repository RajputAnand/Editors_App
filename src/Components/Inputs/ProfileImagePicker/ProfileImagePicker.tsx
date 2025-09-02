import React, { CSSProperties, FC } from "react";
import { Control, Controller, FieldValues, UseFormWatch } from "react-hook-form";
import { MaterialSymbol } from "react-material-symbols";

interface IProfileImagePicker {
    control: Control<any>,
    watch: UseFormWatch<FieldValues>,
    profile_image: string | null,
    banner_image: string | null
}

const ProfileImagePicker: FC<IProfileImagePicker> = (props) => {

    const { control, watch, banner_image, profile_image } = props

    const handleClickInput = (name: string) => () => {
        if (typeof document !== 'undefined') {
            document.getElementById(name)?.click()
            return {
                banner_image, profile_image
            }
        }
    }


    const handleOnChangeInput = (e: any, onChange: (...e: any[]) => void) => {
        if (e.target.files?.[0]) return onChange(e.target.files?.[0])
    }

    // const renderCssImage: (name: string) => CSSProperties = (name) => {
    //     if (watch(name)) return {
    //         background: `url(${URL.createObjectURL(watch(name))})`
    //     }
    //     if (typeof eval(name) == "string") return {
    //         background: `url(${eval(name)})`
    //     }
    //     return {

    //     }
    // }
    const renderCssImage = (name: 'profile_image' | 'banner_image'): CSSProperties => {
        const imageValue = watch(name);

        if (imageValue) {
            return {
                background: `url(${URL.createObjectURL(imageValue)})`
            };
        }

        const propValue = props[name];  // Use direct indexing with specific keys
        if (typeof propValue === 'string') {
            return {
                background: `url(${propValue})`
            };
        }

        return {};
    };

    const renderProfile = () => {

        if (watch("profile_image")) {
            return (
                <div style={renderCssImage("profile_image")} className="w-[5rem] h-[5rem] rounded-full !bg-no-repeat !bg-cover !bg-center flex items-center justify-center cursor-pointer -z-10" onClick={handleClickInput("profile_image_input")}>
                    <MaterialSymbol icon={"add_a_photo"} as="div" className="!text-[1.8rem] text-white" />
                </div>
            )
        }

        return (
            <div style={renderCssImage("profile_image")} className="w-[5rem] h-[5rem]  !bg-no-repeat !bg-cover !bg-center  rounded-full flex items-center justify-center bg-[#c8c8cc] cursor-pointer -z-10" onClick={handleClickInput("profile_image_input")}>
                <MaterialSymbol icon={"add_a_photo"} as="div" className="!text-[1.8rem] text-white" />
            </div>
        )
    }

    const renderCover = () => {
        return (
            <div onClick={handleClickInput("banner_image_input")} style={renderCssImage("banner_image")} className="relative !bg-center w-full h-[10rem] !bg-cover !bg-no-repeat bg-surface-light cursor-pointer z-0">
                <MaterialSymbol icon={"add_a_photo"} as={"div"} className="!text-[2.5rem] text-white absolute right-0 pt-2 pr-2" />
            </div>
        )
    }

    return (
        <React.Fragment>
            <Controller
                render={({ field }) => {
                    return (
                        <input
                            hidden
                            type="file"
                            id="banner_image_input"
                            accept="image/*"
                            {...field}
                            value={field.value?.fileName}
                            onChange={(e) => handleOnChangeInput(e, field.onChange)}
                        />
                    )
                }}
                control={control}
                name={"banner_image"}
            />
            <Controller
                render={({ field }) => {
                    return (
                        <input
                            hidden
                            type="file"
                            id="profile_image_input"
                            accept="image/*"
                            {...field}
                            value={field.value?.fileName}
                            onChange={(e) => handleOnChangeInput(e, field.onChange)}
                        />
                    )
                }}
                control={control}
                name={"profile_image"}
            />
            {renderCover()}
            <div className="flex items-center justify-center mt-[-2.5rem]">
                {renderProfile()}
            </div>
        </React.Fragment>
    )
}

export default ProfileImagePicker