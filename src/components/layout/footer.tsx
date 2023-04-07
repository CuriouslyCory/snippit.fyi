import Link from "next/link";

export const Footer = (): JSX.Element => {
  return (
    <footer className="flex gap-x-5 bg-sky-700 px-6 py-4 text-white md:px-16">
      <span>Copyright CuriouslyCory {new Date().getFullYear()}</span>
      <Link href="/privacy">Privacy Policy</Link>
    </footer>
  );
};

export default Footer;
