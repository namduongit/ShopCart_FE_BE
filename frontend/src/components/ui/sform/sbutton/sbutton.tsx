type SButtonProps = {
    id?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;

    loading?: {
        isLoading: boolean;
        loadingChildren: React.ReactNode; 
    };

    className?: string;
    style?: React.CSSProperties;

    color?: {
        default: string;
        hover?: string;
        disabled?: string;
    };

    children: React.ReactNode;

    onClick?: () => void;
};

const SButton = ({
    id,
    type = "button",
    disabled = false,
    loading,
    className,
    style,
    color,
    children,
    onClick,
}: SButtonProps) => {
    const isLoading = loading?.isLoading ?? false;
    const isDisabled = disabled || isLoading;

    const bgColor = isDisabled
        ? (color?.disabled ?? "#93c5fd")
        : (color?.default ?? "#2563eb");

    const baseStyle: React.CSSProperties = {
        padding: "11px",
        borderRadius: "8px",
        border: "none",
        background: bgColor,
        color: "white",
        fontWeight: 700,
        fontSize: "14px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background 0.15s",
        width: "100%",
        ...style,
    };

    return (
        <button
            id={id}
            type={type}
            disabled={isDisabled}
            className={className}
            style={baseStyle}
            onClick={onClick}
            onMouseEnter={e => {
                if (!isDisabled && color?.hover) {
                    e.currentTarget.style.background = color.hover;
                }
            }}
            onMouseLeave={e => {
                if (!isDisabled && color?.default) {
                    e.currentTarget.style.background = color.default;
                }
            }}
        >
            {isLoading ? loading!.loadingChildren : children}
        </button>
    );
};

export default SButton;