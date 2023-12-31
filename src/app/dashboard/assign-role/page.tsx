'use client';

import { getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { RoleResponse } from "@/types/Role/RoleResponse";
import { useRouter } from 'next/navigation';
import { assignRoles } from "@/services/User/UserService";
import { getRolesOfUser } from "@/services/User/UserService";
import { getRoles } from "@/services/Role/RoleService";
import { useEffect, useState } from "react";
import { UsersRound } from 'lucide-react';
import Header from "@/components/Header";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ScrollableCheckboxList from "@/components/ui/scroll-area";
import CustomSelect from "@/components/ui/select-filter";
import { Role } from "@/types/Role/columns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AssignRole() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [availableRoles, setAvailableRoles] = useState<RoleResponse[]>([]);
    const [userRoles, setUserRoles] = useState<RoleResponse[]>([]);

    const router = useRouter();

    const getUsersHandler = async () => {
        const res = await getUsers();
        if (res.status === 200) {
            const data = await res.json();
            const filteredUsers: UserResponse[] = data.filter((user: UserResponse) => user.status === true);
            setUsers(filteredUsers);
        } else {
            toast.error('An error has occurred');
        }
    }

    const getRolesOfUserHandler = async (userId: number) => {
        const res = await getRolesOfUser(userId);
        if (res.status === 200) {
            const data = await res.json();
            const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
            setUserRoles(filteredRoles);
        } else {
            toast.error('An error has occurred');
        }
    }

    const getRolesHandler = async () => {
        const res = await getRoles();
        if (res.status === 200) {
            const data = await res.json();
            const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
            setAvailableRoles(filteredRoles);
        } else {
            toast.error('An error has occurred');
        }
    }

    const handleUserChange = (userId: number) => {
        setSelectedUser(userId);
        getRolesOfUserHandler(userId);
        getRolesHandler();
    };

    const handleRoleAssignment = (role: RoleResponse) => {
        const newUserRoles = userRoles.some(r => r.id === role.id)
            ? userRoles.filter(r => r.id !== role.id)
            : [...userRoles, role];

        let newAvailableRoles = [...availableRoles];

        if (!userRoles.some(r => r.id === role.id)) {
            // Verifica si el rol ya está en la lista de roles disponibles antes de agregarlo
            if (!newAvailableRoles.some(r => r.id === role.id)) {
                newAvailableRoles = [...newAvailableRoles, role];
            }
        }

        setAvailableRoles(newAvailableRoles);
        setUserRoles(newUserRoles);
    };



    const handleAssignRoles = async () => {
        if (selectedUser) {
            const roleIds = userRoles.map(r => r.id);
            try {
                const res = await assignRoles(selectedUser, { userId: selectedUser, roleIds });
                if (res.status === 201) {
                    toast.success('Roles assgined successfully');
                } else {
                    const errorData = await res.json();
                    toast.error('Error assigning roles');
                }
            } catch (err) {
                toast.error('An error has occurred');
            }
        }
    };

    useEffect(() => {
        getUsersHandler();
    }, []);

    return (
        <>
            <Header title="Assign Roles"/>
            <MaxWidthWrapper className="mt-8">
                <CustomSelect
                    options={[
                        { label: 'Select a user...', value: 0 },
                        ...users.map((user) => ({ label: user.username, value: user.id })),
                    ]}
                    onSelect={(selectedValue) => handleUserChange(selectedValue)}
                    placeholder="Select a user..."
                />

                {selectedUser && (
                    <div className="flex space-x-4 mt-4"> {/* Agregamos mt-4 para agregar un margen en la parte superior */}
                        <div className="flex-1 p-4 border rounded"> {/* Utilizamos flex-1 para que ocupe el espacio restante y agregamos padding y bordes */}
                            <label>Available Roles</label>
                            <ScrollableCheckboxList<Role>
                                items={availableRoles.filter(role => !userRoles.some(userRole => userRole.id === role.id))}
                                checkedItems={userRoles}
                                onChange={handleRoleAssignment}
                                getKey={(role) => role.id.toString()}
                                renderItem={(role) => (
                                    <>
                                        <span>{role.id}</span>
                                        <span className="ml-2">{role.name}</span>
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex-1 p-4 border rounded"> {/* Utilizamos flex-1 para que ocupe el espacio restante y agregamos padding y bordes */}
                            <label>User Roles</label>
                            <ScrollableCheckboxList<Role>
                                items={userRoles}
                                checkedItems={userRoles}
                                onChange={handleRoleAssignment}
                                getKey={(role) => role.id.toString()}
                                renderItem={(role) => (
                                    <>
                                        <span>{role.id}</span>
                                        <span className="ml-2">{role.name}</span>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}
                <div className="flex justify-center">
                    <Button onClick={handleAssignRoles} className="mt-8 w-1/3">
                        Assign
                    </Button>
                </div>
            </MaxWidthWrapper>
        </>
    );
};
