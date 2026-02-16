import Image from "next/image";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";

export function Header() {
  return (
    <header className="px-6 h-26 flex items-center justify-between bg-primary">
      <div>
        <Image
          src="/Images/logo/png/logo-bg-t2.png"
          alt="Aura Activewear Logo"
          width={100}
          height={100}
          className="m-0 p-0"
        />
      </div>
      <div className="flex items-center space-x-6">
        <nav className="space-x-8 flex items-center justify-around">
          <Link href="/" className="text-white hover:text-primary-soft w-20">
            Home
          </Link>
          <Link
            href="/products"
            className="text-white hover:text-primary-soft w-20"
          >
            Produtos
          </Link>
          <Link
            href="/collections"
            className="text-white hover:text-primary-soft w-20"
          >
            Coleções
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-primary-soft w-20"
          >
            Sobre
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-primary-soft w-20"
          >
            Contact
          </Link>
        </nav>
        <div className="px-12">
          <Link
            href="/login"
            className="text-white hover:text-primary-soft flex items-center space-x-1"
          >
            <LoginIcon />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
