import { Link } from "@remix-run/react";
import { type FC } from "react";

import { type NavItem } from "~/types";

export const ErrorPage: FC<Props> = ({ message, link }) => {
  return (
    <div className="flex flex-col m-2 h-screen text-center items-center">
      <h2>{message}</h2>
      <Link
        to={link.to}
        className="mt-2 p-3 flex items-center rounded-md border-2 border-gray-300 hover:bg-gray-50"
      >
        <span className="mx-4 text-base font-medium">{link.name}</span>
      </Link>
    </div>
  );
};

interface Props {
  message: string;
  link: NavItem;
}

export default ErrorPage;
