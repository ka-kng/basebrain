export default function Button({ children, type, className, onClick }) {
  const BUTTON_CLASS = {
    base: "text-white text-lg p-2 px-5 rounded-lg mt-2",
  }

  return (
    <button type={type} className={`${BUTTON_CLASS.base} ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
