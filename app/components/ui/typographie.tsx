import { ReactNode } from "react";

interface H2Props {
    children: ReactNode;
}

export function H1({ children }: H2Props) {
    return (
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h2>
    )
}

export function H2({ children }: H2Props) {
    return (
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
        </h2>
    )
}