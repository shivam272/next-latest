import Link from "next/link";

interface IMenuItem {
  label: string;
  href: string;
}

interface IMenuGroup {
  id: string;
  label: string;
  items: IMenuItem[];
}

interface IMegaMenu {
  id: string;
  menuGroups: IMenuGroup[];
}

const MenuItem = (props: IMenuItem) => {
  const { label, href } = props;
  return (
    <li>
      <Link href={href}>{label}</Link>
    </li>
  );
};

const MenuGroup = (props: IMenuGroup) => {
  const { id, label, items } = props;
  return (
    <>
      <button popoverTarget={id} className="text-white p-1 hover:underline">
        {label}
      </button>
      <div id={id} popover="">
        <ul className="menu">
          {items.map((item) => (
            <MenuItem key={item.href} {...item} />
          ))}
        </ul>
      </div>
    </>
  );
};

export const MegaMenu = (props: IMegaMenu) => {
  const { id, menuGroups } = props;
  return (
    <>
      <div
        className="megamenu max-sm:megamenu-vertical flex gap-2"
        id={id}
        popover=""
      >
        <span className="megamenu-active"></span>
        {menuGroups.map((group) => (
          <MenuGroup key={group.id} {...group} />
        ))}
      </div>
    </>
  );
};
