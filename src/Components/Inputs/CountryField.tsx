import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import Typography from "../Typography/Typography";
import ReactFlagsSelect from "react-flags-select";
import { countryData } from "../../Utils/CountryData";
interface ICountryField {
  control: Control<any>;
  name: string;
  helpText?: string;
  isPending?: boolean;
  setSelected?: (country: any) => void;
  selected?: any;
  placeHolder?: string;
  setSelectedCountry?: any;
}

const CountryField: FC<ICountryField> = (props) => {
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
    const selectedCountry = countryData.find(
      (country) => country.code === event
    );
    setSelectedCountry(selectedCountry);
    onChange(selectedCountry?.code);
  };
  return (
    <Controller
      control={control}
      render={({ field, fieldState }) => {
        return (
          <div className="mb-[1.5rem]">
            <ReactFlagsSelect
              selectedSize={15}
              selected={field.value}
              onSelect={(event) => handleSelect(event, field.onChange)}
              placeholder={placeHolder}
              searchable
              searchPlaceholder="Search countries"
              className="menu-flags cursor-pointer"
             
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

export default CountryField;
