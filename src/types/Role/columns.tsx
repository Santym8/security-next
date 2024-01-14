import { ColumnDef } from "@tanstack/react-table";
import Role from "../../app/dashboard/role/page";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserFunctions } from "@/contexts/UserFunctionProvider";
import { Checkbox } from "@/components/registry/new-york/ui/checkbox"
import { DataTableColumnHeader } from "@/components/Table/data-table-column-header";
import { statuses } from "@/components/Table/data/data";

export type Role = {
    id: number;
    name: string;
    status: boolean;
}

export const useColumns = (handleUpdate: (id: number) => void, handleDelete: (id: number) => void): ColumnDef<Role>[] => {
    const userFunctions = useUserFunctions();
    const isFunctionDelete = userFunctions?.includes('SEC-ROLES-DELETE') || false;
    const isFunctionUpdate = userFunctions?.includes('SEC-ROLES-UPDATE') || false;

    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            header: 'Actions',
            cell: ({ row }) => {
                const role = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(role.id.toString())}
                            >
                                Copy Role ID
                            </DropdownMenuItem>
                            {isFunctionUpdate || isFunctionDelete ? (
                                <DropdownMenuSeparator />
                            ) : null
                            }
                            {isFunctionUpdate ? (
                                <DropdownMenuItem onClick={() => handleUpdate(role.id)}>
                                    Edit Role
                                </DropdownMenuItem>
                            ) : null}

                            {isFunctionDelete ? (
                                <DropdownMenuItem onClick={() => handleDelete(role.id)}>
                                    Delete Role
                                </DropdownMenuItem>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" />
            ),
            cell: ({ row }) => {
                const id = row.original
                return (
                    <span className="max-w-[500px] truncate font-normal">
                        {String(row.getValue("id"))}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        }, {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const name = row.original
                return (
                    <span className="max-w-[500px] truncate font-normal">
                        {row.getValue("name")}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = statuses.find(
                    (status) => status.value === row.getValue("status")
                )

                if (!status) {
                    return null
                }

                return (
                    <div className="flex justify-center items-center">
                        {status.icon && (
                            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{status.label}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
    ]
}