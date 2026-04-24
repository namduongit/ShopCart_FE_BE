interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {

}

const Form: React.FC<FormProps> = ({ children, ...props }: FormProps) => {
    return (
        <form {...props}>
            {children}
        </form>
    )
}

export default Form;