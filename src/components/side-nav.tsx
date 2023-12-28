'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDEVAR_ITEMS } from '@/config-Side-Nav/constants';
import { SideNavItems } from '@/config-Side-Nav/types';
import Icon from '../components/Incon';

const SideNav = () => {
    return (
        <div className="md:w-60 bg-[#1E1E1E] h-screen flex-1 text-white fixed border-r border-zinc-200 hidden md:flex">
            <div className="flex flex-col space-y-6 w-full">
                <Link
                    href="/"
                    className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
                >
                    <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
                    <span className="font-bold text-lg hidden md:flex">SECURITY UTN</span>
                </Link>

                <div className="flex flex-col space-y-2 md:px-6 ">
                    {SIDEVAR_ITEMS.map((item, idx) => {
                        return <MenuItem key={idx} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItems }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-yellow-600 w-full justify-between hover:bg-yellow-600 ${pathname.includes(item.path) ? 'bg-yellow-600' : ''
                            }`}
                    >
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className="font-semibold text-xl  flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <Icon name="chevron-down" color="#FFD700" size={25} />
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`${subItem.path === pathname ? 'font-bold' : ''
                                            }`}
                                    >
                                        <span>{subItem.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${item.path === pathname ? 'bg-zinc-100' : ''
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-xl flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};