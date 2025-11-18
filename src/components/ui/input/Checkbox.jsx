import React from "react";

const Checkbox = () => {
  return (
    <>
      <div class="flex">
        <input
          type="checkbox"
          class="shrink-0 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          id="hs-default-checkbox"
        />
        <label for="hs-default-checkbox" class="text-sm text-black ms-3">
          Default checkbox
        </label>
      </div>
    </>
  );
};

export default Checkbox;
