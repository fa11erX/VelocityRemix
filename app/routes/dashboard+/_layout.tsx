import { Outlet } from "@remix-run/react";

export default function Index() {
    return (
      <div className="font-sans p-4">
        Nav
        <Outlet />
      </div>
    );
  }