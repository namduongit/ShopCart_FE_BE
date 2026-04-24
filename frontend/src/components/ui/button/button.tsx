interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button
            {...props}
            className={`
                ${props.className}
            `}
        >
            {props.children}
        </button>
    )
}

export default Button;