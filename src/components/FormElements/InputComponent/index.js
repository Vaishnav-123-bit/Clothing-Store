export default function ({ label, placeholder, onChange, value, type }) {
  return (
    <div className="relative">
      <p className="pt-0 bg-white pr-2 pb-0 absolute  pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600">
        {label}
      </p>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mr-0 ml-0 mt-0 text-base block bg-white border-gray-300 rounded-md"
      />
    </div>
  );
}
