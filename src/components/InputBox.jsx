import React, { forwardRef } from "react";

const InputBox = forwardRef(({ value, onChange, onKeyDown }, ref) => (
  <input
    ref={ref}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    rows={1}
    className="w-full max-w-xl leading-none font-sans  px-2 py-1 text-base text-white border-0 border-b border-white bg-transparent focus:outline-none focus:border-blue-500 focus:border-b-2"
  />
));

export default InputBox;
