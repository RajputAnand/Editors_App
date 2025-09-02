import { ButtonHTMLAttributes, FC } from "react";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "menu";
  isLoading?: boolean;
  inProgress?: number;
}

const Button: FC<IButton> = (props) => {
  const {
    className,
    children,
    variant = "Primary",
    isLoading,
    inProgress,
    ...rest
  } = props;

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
  const handleInnerText = () => {
    if (isLoading)
      return (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading ...&nbsp;
          {(inProgress > 0) &&
            `${inProgress}%`}
        </div>
      );
    return children;
  };

  return (
    <button
      {...rest}
      className={`${className} button${capitalize(variant)} titleMedium text-white px-[1.5rem] py-[0.625rem] text-center`}
    >
      {handleInnerText()}
    </button>
  );
};

export default Button;
