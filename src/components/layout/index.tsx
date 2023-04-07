import Footer from "./footer";
import Header from "./header";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <section className="grid-rows-a1a grid min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </section>
  );
};

export { Header, Footer };
export default Layout;
