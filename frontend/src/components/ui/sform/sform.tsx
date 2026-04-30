type SFormProps = {
    onSubmit: (e: React.FormEvent<Element>) => void | Promise<void>;
    className?: string;
    style?: React.CSSProperties;

    children: React.ReactNode;
}

const SForm = ({
    onSubmit,
    className,
    style,
    children
}: SFormProps) => {

    const baseStyle: React.CSSProperties = {
         display: "flex", flexDirection: "column", gap: "16px", ...style
    }

    return (
        <form onSubmit={onSubmit} className={className} style={baseStyle}>
            {children}
        </form>
    )
}

export default SForm;