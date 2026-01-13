import Navbar from "../Navbar";
import { Toaster } from "sonner";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      <div className="">{children}</div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
