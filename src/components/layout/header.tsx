import Link from "next/link";
import AuthMenu from "~/features/auth-menu";

export const Header = (): JSX.Element => {
  return (
    <header className="bg-sky-700 px-6 py-4 text-white md:px-16">
      <div className="flex items-center">
        <Link href="/">
          <div>Snipit</div>
        </Link>
        <div className="ml-auto">
          <AuthMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
