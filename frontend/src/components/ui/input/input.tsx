interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    iconStart?: React.ReactNode;
    iconStartOnClick?: () => void;

    iconEnd?: React.ReactNode;
    iconEndOnClick?: () => void;

    lable?: string;
    lableRequired?: boolean;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
    return (
        <div>
            {props.lable && (
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    {props.lable}
                    {props.lableRequired && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex ring focus-within:ring-2 ring-blue-600 rounded-md border border-gray-300 overflow-hidden">
                {props.iconStart && (
                    <button
                        type="button"
                        className="text-gray-600 px-3 bg-gray-100"
                        onClick={props.iconStartOnClick}>
                        {props.iconStart}
                    </button>
                )}
                <div className="w-full">
                    <input
                        type={`${props.type || 'text'}`}
                        className={`
                        w-full py-2
                        ${props.iconStart && 'ps-2'}
                        `}
                    />
                </div>
                {props.iconEnd && (
                    <button
                        type="button"
                        className="px-3 text-gray-600">
                        {props.iconEnd}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input;