import React, { useCallback, useEffect } from 'react';
import { RoleResponse } from '@/types/Role/RoleResponse';
import { getFunctionsOfRole, getRole } from '@/services/Role/RoleService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import { ReportHeader } from "@/types/Reports/shared/HeaderReport";
import { FunctionResponse } from '@/types/Function/FunctionResponse';
import { ModuleResponse } from '@/types/Module/ModuleResponse';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { styles } from './stylesReport';

interface RolesModulesFunctionsReport {
    role: RoleResponse,
    dataRoles: {
        module: ModuleResponse,
        functions: Omit<FunctionResponse, 'module'>[],
    }[],
}


export function RolesModulesFunctionsReport<TData>({
    table,
}: ReporType<TData>) {

    const [roles, setRoles] = React.useState<RolesModulesFunctionsReport[]>([]);

    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const groupByModule = (functions: FunctionResponse[]) => {
        let grouped = functions.reduce((acc, function_) => {
            let moduleId = function_.module?.id;
            if (!moduleId) return acc;
            if (!acc[moduleId]) {
                acc[moduleId] = {
                    module: function_.module,
                    functions: [],
                };
            }
            // Desestructura el objeto de la función y omite la propiedad del módulo
            const { module, ...functionWithoutModule } = function_;
            acc[moduleId].functions.push(functionWithoutModule);
            return acc;
        }, {} as Record<number, { module: ModuleResponse, functions: Omit<FunctionResponse, 'module'>[] }>);

        return Object.values(grouped);
    };

    const getFunctionsOfRoleHandler = useCallback(async (roleId: number): Promise<FunctionResponse[]> => {
        const res = await getFunctionsOfRole(roleId, token);
        if (res.status === 200) {
            const data: FunctionResponse[] = await res.json();
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            return filteredFunctions;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getRoleReportHandler = useCallback(async (id: number): Promise<RolesModulesFunctionsReport> => {
        const res = await getRole(id, token);
        if (res.status === 200) {
            const roleData: RoleResponse = await res.json();
            const functions = await getFunctionsOfRoleHandler(roleData.id);
            const groupedFunctions = groupByModule(functions);
            return {
                role: roleData,
                dataRoles: groupedFunctions,
            };
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getRolesHandler = useCallback(async (ids: number[]): Promise<RolesModulesFunctionsReport[]> => {
        const roleReports: RolesModulesFunctionsReport[] = [];

        for (const id of ids) {
            try {
                const role = await getRoleReportHandler(id);
                roleReports.push(role);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return roleReports;
    }, [getRoleReportHandler]);


    const createTable = (dataReports: RolesModulesFunctionsReport[]) => {
        return (
            <View>
                {dataReports.map((report, reportIndex) => (
                    <View key={`report-${reportIndex}`} style={styles.page}>
                        <Text style={styles.roleName}>Role: {report.role.id} - {report.role.name}</Text>
                        <Text>Status: {report.role.status ? 'Active' : 'Inactive'}</Text>
                        <View style={styles.spaceAfterRole} />

                        {report.dataRoles.length == 0 && (
                            <Text style={styles.noFunctionsMessage}>No functions available for this role</Text>
                        )}

                        {report.dataRoles.map((dataRole, dataRoleIndex) => (
                            <View key={`dataRole-${dataRoleIndex}`} style={styles.moduleInfo}>
                                <Text>Module: {dataRole.module.id} - {dataRole.module.name}</Text>
                                <Text>Description: {dataRole.module.description}</Text>
                                <Text>Status: {dataRole.module.status ? 'Active' : 'Inactive'}</Text>
                                <Text style={styles.subtitle}>Functions</Text>
                                <View style={styles.table}>
                                    <View style={styles.tableRowHeader}>
                                        <Text style={styles.tableHeader}>Id</Text>
                                        <Text style={styles.tableHeader}>Name</Text>
                                        <Text style={styles.tableHeader}>Status</Text>
                                    </View>
                                    {dataRole.functions.map((func, funcIndex) => (
                                        <View key={`func-${funcIndex}`} style={styles.tableRow}>
                                            <Text style={styles.tableCell}>{func.id}</Text>
                                            <Text style={styles.tableCell}>{func.name}</Text>
                                            <Text style={styles.tableCell}>{func.status ? 'Active' : 'Inactive'}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    useEffect(() => {
        const ids = getIdSelectedItems();
        getRolesHandler(ids).then((roles) => {
            setRoles(roles);
        });
    }, []);

    return (
        <ReportHeader data={createTable(roles)} dataType={"Roles"} />
    );
};

export default RolesModulesFunctionsReport;
