import { FC, useState } from "react";
import { Control, Controller } from "react-hook-form";
import Typography from "../Typography/Typography.tsx";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

interface IPhoneField {
  control: Control<any>;
  name: string;
  helpText?: string;
  isPending?: boolean;
  label?: string,
  classNameContainer?: string,
}

const PhoneField: FC<IPhoneField> = (props) => {
  const { control, name, helpText, isPending,label,classNameContainer } = props;
  const [value, setValue] = useState<any>();

  return (
    <Controller
      control={control}
      render={({ field, fieldState }) => {
        return (
            <div className={`${classNameContainer}`}>
            {label && <Typography>{label}</Typography>}
            <PhoneInput
              placeholder="Enter phone number"
              value={field.value}
              onChange={field.onChange}
            //   value={value}
            //   onChange={setValue}
              
            />
            {Boolean(fieldState.error) && (
              <Typography
                isError={Boolean(fieldState.error)}
                variant="body"
                size="medium"
                className="mt-2"
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

export default PhoneField;
