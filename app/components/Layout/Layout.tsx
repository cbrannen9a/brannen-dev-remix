import { type FC, type ReactNode } from "react";

const Layout: FC<Props> = ({
  navigation = [
    { name: "Home", href: "/" },
    { name: "Test", href: "/test" },
  ],
  children,
}) => {
  return (
    <div className="">
      <nav className="min-h-full bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />
              </div>

              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

interface Props {
  children: ReactNode;
  navigation?: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
}

export default Layout;
