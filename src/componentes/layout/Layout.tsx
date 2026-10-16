import { Outlet } from "react-router-dom";
import MenuLateral from "./MenuLateral";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <MenuLateral />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
