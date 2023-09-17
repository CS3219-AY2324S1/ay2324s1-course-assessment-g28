import useUserInfo from "@/hooks/useUserInfo";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

export default function UserMenu() {
  const user = useUserInfo();
  return (
    <Menu as="div" className="text-left">
      <div>
        <Menu.Button
          className="flex gap-x-2 w-full justify-center items-center
            rounded-md bg-opacity-20 px-4 py-2 text-md font-medium
            text-white hover:bg-opacity-30 focus:outline-none
            focus-visible:ring-2 focus-visible:ring-white
            focus-visible:ring-opacity-75">
          <Image
            src={user?.image ? user?.image : "/user-profile.png"}
            width={48}
            height={48}
            alt="Profile Picture"
            className="rounded-full"
          />
          <p className="text-md">{user?.name}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
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
        <Menu.Items
          className="absolute right-0 mt-2 w-56 origin-top-right
          divide-y divide-gray-100 rounded-md bg-white shadow-lg
          ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 "></div>
          <Menu.Item>
            <button className="text-black p-2">
              Logout
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
