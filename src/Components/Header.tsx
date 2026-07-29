import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">News Application</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/news" className="text-white hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/news/archive" className="text-white hover:underline">
              Archive
            </Link>
          </li>
          <li className="pointer-events-none opacity-50">
            <Link href="/contact" className="text-white hover:underline">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/register" className="text-white hover:underline">
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
