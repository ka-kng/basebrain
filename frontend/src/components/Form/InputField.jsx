const InputField = ({ label, inputName, type='text', value, onChange, error, placeholder, disabled }) => (
  <div className='flex flex-col'>
    <label htmlFor={inputName} className='mb-1 text-sm font-medium text-gray-700'>{label}</label>
    <input
      id={inputName}
      name={inputName}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 opacity-50 cursor-not-allowed' : ''}`}
    />
    {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
  </div>
);

export default InputField;
