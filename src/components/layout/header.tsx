import Image from "next/image";
import Link from "next/link";
import AuthMenu from "~/features/auth-menu";

export const Header = (): JSX.Element => {
  return (
    <header className="bg-sky-700 px-6 py-4 text-white md:px-16">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/images/logo.svg"
              height={75}
              width={75}
              alt="snipit logo, an illustration of yellow scissors"
            />
            <span className="text-3xl">Snipit</span>
          </div>
        </Link>
        <div className="ml-auto">
          <AuthMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
