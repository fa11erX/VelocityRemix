import Navigation from "@/components/navigation";
import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="">
      <Navigation />
      <div className="flex flex-1">
        <div className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r">
          <div className="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
            <Outlet />
          </div>
        </div>
        <div className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 xl:flex">
          Lorem ipsum
        </div>
      </div>
    </div>
  );
}