import Navigation from "@/components/navigation";
import { Outlet } from "@remix-run/react";

export default function Index() {
    return (
      <div>
        <Navigation />
        <Outlet />
      </div>
    );
  }