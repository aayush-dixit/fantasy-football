import React from "react";

interface FetchButtonProps {
    className?: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
}

const Button: React.FC<FetchButtonProps> = ({className, onClick, children}) => {
    return (
        <button onClick={onClick} className={className}>{children}</button>
    )
}

export default Button;