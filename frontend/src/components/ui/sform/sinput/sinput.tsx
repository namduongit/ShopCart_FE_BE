import React from "react";

type SInputProps = {
    name: string;
    errors?: Record<string, any> | string | undefined;   // errors["password"], errors["email"], ...

    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    disabled?: boolean;

    options?: {
        label?: React.ReactNode;
        // Start
        prefix?: React.ReactNode;   
        // End with option action  
        suffix?: {                   
            element: React.ReactNode;
            action?: () => void;     
        };
    };

    className?: string;
};

const SInput = ({
    name,
    errors,
    value,
    onChange,
    type = "text",
    placeholder,
    disabled,
    options,
    className,
}: SInputProps) => {
    var errorMsg = "";
    if (typeof(errors) === "object") {
        errorMsg = errors?.[name];
    }
    const hasError = !!errorMsg;

    return (
        <div className={className}>
            {options?.label && (
                <label
                    htmlFor={name}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "6px",
                    }}
                >
                    {options.label}
                </label>
            )}

            <div style={{ position: "relative" }}>
                {options?.prefix && (
                    <div style={{
                        position: "absolute", left: "12px", top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af", fontSize: "13px", pointerEvents: "none",
                        display: "flex", alignItems: "center",
                    }}>
                        {options.prefix}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    style={{
                        width: "100%",
                        padding: "10px 14px",
                        paddingLeft: options?.prefix ? "36px" : "14px",
                        paddingRight: options?.suffix ? "36px" : "14px",
                        fontSize: "14px",
                        border: `1.5px solid ${hasError ? "#f87171" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        outline: "none",
                        boxSizing: "border-box",
                        color: "#111827",
                        background: disabled ? "#f9fafb" : "#fff",
                        transition: "border-color 0.15s",
                    }}
                    onFocus={e => {
                        e.currentTarget.style.borderColor = hasError ? "#f87171" : "#2563eb";
                    }}
                    onBlur={e => {
                        e.currentTarget.style.borderColor = hasError ? "#f87171" : "#e5e7eb";
                    }}
                />

                {options?.suffix && (
                    options.suffix.action ? (
                        <button
                            type="button"
                            onClick={options.suffix.action}
                            style={{
                                position: "absolute", right: "12px", top: "50%",
                                transform: "translateY(-50%)",
                                background: "none", border: "none",
                                cursor: "pointer", color: "#9ca3af", padding: 0,
                                display: "flex", alignItems: "center",
                            }}
                        >
                            {options.suffix.element}
                        </button>
                    ) : (
                        <span style={{
                            position: "absolute", right: "12px", top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9ca3af", fontSize: "13px",
                            display: "flex", alignItems: "center",
                        }}>
                            {options.suffix.element}
                        </span>
                    )
                )}
            </div>

            {hasError && (
                <p style={{
                    fontSize: "12px", color: "#dc2626",
                    margin: "4px 0 0",
                    display: "flex", alignItems: "center", gap: "4px",
                }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "11px" }} />
                    {errorMsg}
                </p>
            )}
        </div>
    );
};

export default SInput;