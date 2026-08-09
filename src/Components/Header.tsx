import { MegaMenu } from "./Ui";

const menuGroups = [
  {
    label: "Services",
    id: "services",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Create Venue", href: "/dashboard/create-venue" },
      { label: "Create Event", href: "/dashboard/create-event" },
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
    <header
      className={`bg-blue-600 text-white py-3 px-6 flex justify-between items-center ${className}`}
    >
      <h1 className="text-2xl font-bold">News Application</h1>
      <div>
        <MegaMenu id="event" menuGroups={menuGroups} />
      </div>
    </header>
  );
};

export default Header;
