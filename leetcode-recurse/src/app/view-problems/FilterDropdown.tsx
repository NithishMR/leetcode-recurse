"use client";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Subtle, modern label */}
      <label className="text-xs font-semibold text-gray-500 tracking-wide">
        {label}
      </label>

      <select
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-[120px] py-2 
          bg-white
          border border-gray-200 
          rounded-lg
          text-sm text-gray-800 
          shadow-sm
          text-center
          hover:border-gray-300 
          cursor-pointer
          transition-all
          focus:outline-none 
          focus:ring-2 focus:ring-blue-400
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
