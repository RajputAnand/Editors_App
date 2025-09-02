import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Typography from "../Typography/Typography";
import ReactFlagsSelect from "react-flags-select";
import { countryData } from "../../Utils/CountryData";
interface INetworkCountryField {
  control: Control<any>;
  name: string;
  helpText?: string;
  isPending?: boolean;
  setSelected?: (country: any) => void;
  selected?: any;
  placeHolder?: string;
  setSelectedCountry?: any;
}

const NetworkCountryField: FC<INetworkCountryField> = (props) => {
  const {
    control,
    name,
    helpText,
    isPending,
    setSelected,
    placeHolder,
    selected,
    setSelectedCountry,
  } = props;
  const handleSelect = (event: any, onChange: (e: any) => void) => {
    const countryCode = event.match(/\(([^)]+)\)/)?.[1];
    console.log(event);
    
    const selectedCountry = countryData.find(
      (country) => country.code === event
    );
    setSelectedCountry(selectedCountry);
    onChange(selectedCountry?.code);
  };
  const getCountryCodeFromValue = (value: string) => {
    const match = value?.match(/\(([^)]+)\)/);
    return match ? match[1] : value;
  };
  return (
    <Controller
      control={control}
      render={({ field, fieldState }) => {        
        return (
          <div className="">
            <ReactFlagsSelect
              selectedSize={15}
              selected={getCountryCodeFromValue(field.value)}
              onSelect={(event) => handleSelect(event, field.onChange)}
              placeholder={placeHolder}
              searchable
              searchPlaceholder="Search countries"
              className="placeholder:text-[#92929D]"
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

export default NetworkCountryField;
