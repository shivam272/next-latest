import { MegaMenu } from "./Ui";

const menuGroups = [
  {
    label: "Services",
    id: "services",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Create Venue", href: "/dashboard/create-venue" },
    ],
  },
  {
    label: "Account",
    id: "account",
    items: [
      { label: "Home", href: "/" },
      { label: "Archive", href: "/news/archive" },
      { label: "Sign In", href: "/signIn" },
      { label: "Register", href: "/register" },
    ],
  },
];

interface IHeaderProps {
  className?: string;
}

const Header: React.FC<IHeaderProps> = ({ className = "" }) => {
  return (
    <header className={`bg-blue-600 ${className}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between text-white py-3 px-4">
        <div className="text-2xl font-bold">Application</div>
        <div>
          <MegaMenu id="event" menuGroups={menuGroups} />
        </div>
      </div>
    </header>
  );
};

export default Header;
