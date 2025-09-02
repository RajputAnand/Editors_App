import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Typography from "../Typography/Typography.tsx";

interface INetworkCheckBox {
  control: Control<any>;
  label?: string;
  name: string;
  className?: string;
  classNameContainer?: string;
  helpText?: string;
  disabled?: boolean;
  defaultValue?: boolean;
}

const NetworkCheckBox: FC<INetworkCheckBox> = (props) => {
  const {
    name,
    label,
    control,
    className,
    classNameContainer,
    helpText,
    disabled,
    defaultValue,
  } = props;

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        return (
          <div className={`flex`}>
            <div className="flex items-center gap-2">
              <input
                className={`${className}`}
                type="checkbox"
                {...field}
                disabled={disabled}
                checked={field.value || false}
              />
              <Typography className="text-[#92929D]">{label}</Typography>
            </div>
            {fieldState.error && (
              <Typography isError={true} variant="body" size="medium">
                {fieldState.error.message}
              </Typography>
            )}
            {helpText && (
              <Typography variant="body" size="medium">
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

export default NetworkCheckBox;
