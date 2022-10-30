import cx from "classnames"
import PropTypes from "prop-types"

const Button = ({ variant = "standard", color = "inherit", children, ...props }) => {
  return (
    <button
      {...props}
      className={cx(
        // common classes
        "text-button rounded-[56px] px-8 py-4 font-bold",
        // variant classes
        variant === "standard" && "duration-300 ease-out",
        variant === "outlined" && "border-[3px] py-[13px] duration-75",
        // variant/color classes
        variant == "standard" && color === "primary" && "bg-indigo-600 text-white",
        variant == "outlined" &&
          color === "primary" &&
          "border-indigo-700 text-indigo-700 dark:border-indigo-200 dark:text-indigo-200",
        // hover classes
        "hover:border-indigo-800 hover:bg-indigo-800 hover:text-white",
        // inherited classes
        props?.className
      )}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(["standard", "outlined"]),
  color: PropTypes.oneOf(["inherit", "primary"]),
  children: PropTypes.elementType,
}

export default Button
