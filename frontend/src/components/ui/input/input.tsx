interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    iconStart?: React.ReactNode;
    iconStartOnClick?: () => void;

    iconEnd?: React.ReactNode;
    iconEndOnClick?: () => void;

    lable?: string;
    lableRequired?: boolean;
}

const Input: React.FC<InputProps> = ({
    iconStart,
    iconStartOnClick,
    iconEnd,
    iconEndOnClick,
    lable,
    lableRequired,
    className = "",
    type = "text",
    ...inputProps
}: InputProps) => {
    return (
        <div>
            {lable && (
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    {lable}
                    {lableRequired && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex ring focus-within:ring-2 ring-blue-600 rounded-md border border-gray-300 overflow-hidden">
                {iconStart && (
                    <button
                        type="button"
                        className="text-gray-600 px-3 bg-gray-100"
                        onClick={iconStartOnClick}>
                        {iconStart}
                    </button>
                )}
                <div className="w-full">
                    <input
                        {...inputProps}
                        type={type}
                        className={`
                        w-full py-2
                        ${iconStart && 'ps-2'}
                        ${className}
                        `}
                    />
                </div>
                {iconEnd && (
                    <button
                        type="button"
                        className="px-3 text-gray-600"
                        onClick={iconEndOnClick}>
                        {iconEnd}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input;
