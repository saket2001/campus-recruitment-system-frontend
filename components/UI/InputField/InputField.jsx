import React, { useState } from "react";

export const InputField = React.forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState('password');

  return (
    <div className="my-2 w-full">
      <div className="mb-1">
        <label
          htmlFor={props?.id}
          className="text-neutral-700 lg:text-lg text-base font-medium"
        >
          {props?.label}
        </label>
      </div>
      <input
        id={props?.id}
        type={props?.type === "password" ? showPassword : props?.type}
        name={props?.name}
        placeholder={props?.placeholder}
        required={props?.required}
        className={`border border-neutral-300 rounded-md focus:shadow-md transition-all ease-in w-full ${props?.bgColor} lg:text-lg text-base py-1 px-2`}
        onChange={props?.onChange}
        onBlur={props?.onBlur}
        defaultValue={props?.value}
        accept={props.accept}
        ref={ref}
        autoComplete={"true"}
      />
      {props?.type === "password" && (
        <div className="py-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="toggle-password"
            className="rounded"
            onClick={() =>
              setShowPassword((prev) => {
                return prev === "password" ? "text" : "password";
              })
            }
          />
          <p className="text-base">Show Password</p>
        </div>
      )}
      {/* error shower */}
      {props?.didTouched && props?.error ? (
        <span className="text-red-600 text-bold py-1">{props?.error}</span>
      ) : null}
    </div>
  );
});

InputField.displayName="InputField"