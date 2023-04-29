import React from "react";

export const TextArea = React.forwardRef(({ label, name, placeholder = "", required, id, error = false, onChange, value, onBlur, didTouched, bgColor='bg-transparent',rows=5,cols },ref) => {
    return (
      <div className="my-2">
        <div className="mb-1">
          <label
            htmlFor={id}
            className="text-gray-600 lg:text-lg text-base font-medium"
          >
            {label}
          </label>
        </div>
        <textarea
          id={id}
          name={name}
          ref={ref}
          placeholder={placeholder}
          required={required}
          className={`border border-gray-300 rounded-md shadow focus:shadow-md transition-all ease-in w-full ${bgColor} lg:text-lg text-base py-1 px-2  focus:border-0`}
          onChange={onChange}
          onBlur={onBlur}
          defaultValue={value}
          // value={value}
          rows={rows}
          cols={cols}
        />
        {/* error shower */}
        {didTouched && error ? (
          <span className="text-red-600 text-bold py-1">{error}</span>
        ) : null}
      </div>
    );
});

TextArea.displayName = "TextArea";
