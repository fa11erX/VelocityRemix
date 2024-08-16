import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "@remix-run/react";
import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";

export default function Navigation() {
    return (
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link to="/" className="mr-6 hidden lg:flex">
                        <MountainIcon className="h-6 w-6" />
                        <span className="sr-only">Velocity</span>
                    </Link>
                    <div className="grid gap-2 py-6">
                        <Link className={buttonVariants({ variant: "link" })} to="/">
                            Home
                        </Link>
                        <Link className={buttonVariants({ variant: "link" })} to="/dashboard">
                            Dashboard
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
            <div className="mr-6 hidden lg:flex">
                <MountainIcon className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
            </div>
            <nav className="ml-auto hidden lg:flex gap-6">
                <Link
                    className={buttonVariants({ variant: "link" })} to="/"

                >
                    Home
                </Link>
                <Link className={buttonVariants({ variant: "default" })} to="/auth" >
                    Sign in
                </Link>
                {/* <Link
                    className={buttonVariants({ variant: "link" })} to="/dashboard"
                >
                    Dashboard
                </Link> */}
            </nav>
        </header>
    )
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}


function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}