/* eslint-disable @next/next/no-img-element */
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import React, { Fragment } from "react";

import AvatarImage from "./AvatarImage";

const links = [{ label: "Sign out", onClick: () => signOut({}) }];

const AvatarMenu = () => {
  return (
    <>
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <AvatarImage />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {links.map((link) => (
              <Menu.Item key={link.label}>
                {({ active }) => (
                  <button
                    onClick={link.onClick}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block w-full px-4 py-2 text-left text-sm text-gray-700"
                    )}
                  >
                    {link.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default AvatarMenu;
