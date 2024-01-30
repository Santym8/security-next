import { Report } from '@/types/Reports/shared/Report';
import basicRoles from "@/types/Reports/roles/allRoles"
import { Role } from "@/types/Role/columns"

export const roleReports = (): Report<Role>[] => {
    return [
        {
            title: 'Basic Roles',
            type: basicRoles
        }
    ]
}