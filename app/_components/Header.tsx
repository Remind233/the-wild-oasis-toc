import Navigation from "@/app/_components/Navigation";
import Logo from "@/app/_components/Logo";
import MobileMenu from "./MobileMenu";
import { auth } from "../_lib/auth";

export default async function Header() {
  const session = await auth();
  return (
    <header className="border-b border-primary-900 px-4 md:px-8 py-4 md:py-5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        <Navigation />
        <MobileMenu session={session} />
      </div>
    </header>
  );
}
