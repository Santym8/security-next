import { Home, Settings, User, UserCheck, BarChart2, FunctionSquare, BookText } from 'lucide-react';
import { SideNavItems } from './types';


export const SIDEVAR_ITEMS: SideNavItems[] = [
    {
        title: "Home",
        path: "/",
        icon: <Home size={20} name='home' color="#c59a1a" />
    },
    {
        title: "Dashboard",
        path: "/dashboard/",
        icon: <Settings size={20} color="#c59a1a" />,
        submenu: true,
        subMenuItems: [
            {
                title: "Users",
                path: "/dashboard/user",
                icon: <User size={20} />
            },
            {
                title: "Roles",
                path: "/dashboard/role",
                icon: <UserCheck size={20} />
            },
            {
                title: "Modules",
                path: "/dashboard/module",
                icon: <BarChart2 size={20} />

            },
            {
                title: "Functions",
                path: "/dashboard/function",
                icon: <FunctionSquare size={20} />
            }
        ]
    },
    {
        title: "Assing",
        path: "/",
        icon: <Settings size={20} color="#c59a1a" />,
        submenu: true,
        subMenuItems: [
            {
                title: "Fuctions to Roles",
                path: "/",
            },
            {
                title: "Roles to Users",
                path: "/",
            },
        ]
    },
    {
        title: "Reports",
        path: "/",
        icon: <BookText size={20} color="#c59a1a" />,
        submenu: true,
        subMenuItems: [
            {
                title: "Users",
                path: "/",
            },
            {
                title: "Roles",
                path: "/",
            },
            {
                title: "Modules",
                path: "/",
            },
            {
                title: "Functions",
                path: "/",
            }
        ]
    }
]