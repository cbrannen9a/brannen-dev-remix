import { Link } from "@remix-run/react";
import { type FC } from "react";
import { type NavItem } from "~/types";

const Nav: FC<Props> = ({ navigation = [], logo }) => {
  return (
    <nav className="min-h-full bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link prefetch="intent" to="/">
                <img
                  className="h-8 w-8"
                  src={`${logo?.asset?.url}`}
                  alt={`${logo.alt}`}
                />
              </Link>
            </div>

            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  prefetch="intent"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface Props {
  navigation?: NavItem[];
  logo: { alt?: string; asset?: { url?: string } };
}

export default Nav;
