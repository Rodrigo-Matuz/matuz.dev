import type { HTMLAttributes } from 'react';

export function Container({
    children,
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`
        mx-auto w-full
        max-w-7xl
        px-5 sm:px-8 lg:px-10
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

export default Container;
