import { CreateRoleRequest } from "@/types/Role/CreateRoleRequest";
import { UpdateRoleRequest } from "@/types/Role/UpdateRoleRequest";
import { AssignFunctionsToRoleRequest } from "@/types/Role/AssignFunctionsToRoleRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getRoles = async () => {
    return await fetch(`${HOST}/api/roles`, { cache: 'no-store' })
}

export const getRole = async (id: number) => {
    return await fetch(`${HOST}/api/roles/${id}`, { cache: 'no-store' });
}

export const deleteRole = async (id: number) => {
    return await fetch(`${HOST}/api/roles/${id}`, { method: 'DELETE' });
}

export const createRole = async (role: CreateRoleRequest) => {
    return await fetch(`${HOST}/api/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role)
    });
}

export const updateRole = async (id: number, role: UpdateRoleRequest) => {
    return await fetch(`${HOST}/api/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role)
    });
}

export const getFunctionsOfRole = async (id: number) => {
    return await fetch(`${HOST}/api/roles/${id}/functions`, { method: 'GET' });
}

export const assignFunctions = async (id: number, functions: AssignFunctionsToRoleRequest) => {
    return await fetch(`${HOST}/api/roles/${id}/functions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(functions)
    });
}