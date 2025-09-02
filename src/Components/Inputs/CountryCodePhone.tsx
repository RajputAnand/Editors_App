import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Typography from "../Typography/Typography";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

interface ICountryCodePhone {
  control: Control<any>;
  name: string;
  helpText?: string;
  isPending?: boolean;
  placeHolder?: string;
  defaultCountry?: string;
  defaultValue?:string;
}

const CountryCodePhone: FC<ICountryCodePhone> = (props) => {
  const {
    control,
    name,
    helpText,
    isPending,
    placeHolder,
    defaultCountry, // Default country code for PhoneInput
    defaultValue
  } = props;

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        return (
          <div className="min-w-[w-full]">
            <PhoneInput
              country={defaultCountry} // Set default country
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={placeHolder}
              enableSearch
              countryCodeEditable={false}
              containerClass="w-full"
              inputClass="!w-full !text-base text-surface-10 font-normal !leading-[1rem] placeholder:text-[#92929D] min-h-[3rem]"
              inputProps={{
                disabled: isPending,
              }}
              buttonClass={isPending ? "disabled-button-class" : ""}
              specialLabel=""
              {...field}
            />
            {Boolean(fieldState.error) && (
              <Typography
                isError={Boolean(fieldState.error)}
                variant="body"
                size="medium"
                className="ml-[10px]"
              >
                {fieldState.error?.message}
              </Typography>
            )}
            {helpText && (
              <Typography variant="body" size="medium" className="pl-4 mt-1">
                {helpText}
              </Typography>
            )}
          </div>
        );
      }}
      name={name}
    />
  );
};

export default CountryCodePhone;