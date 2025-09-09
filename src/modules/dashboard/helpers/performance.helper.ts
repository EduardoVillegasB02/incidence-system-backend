import { FilterDashboardDto } from '../dto';

export function perfomanceUser(filters: FilterDashboardDto, users: any[]) {
  const { start, end } = filters;
  return users.map((user) => {
    const validAssignments = user.assignments
      .filter((a: any) => a.deletedAt === null)
      .filter((a: any) => {
        const date = a.incidence?.date;
        if (!date) return false;
        const d = new Date(date);
        const afterStart = start ? d >= new Date(`${start}T00:00:00`) : true;
        const beforeEnd = end ? d <= new Date(`${end}T23:59:59`) : true;
        return afterStart && beforeEnd;
      });
    const finished = validAssignments.filter(
      (a: any) =>
        a.incidence?.status === 'finished' ||
        a.incidence?.status === 'completed',
    ).length;
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      dni: user.dni,
      phone: user.phone,
      rol: user.role,
      asigned: validAssignments.length,
      finished,
    };
  });
}

export const selectDashboardUser = {
  id: true,
  name: true,
  lastname: true,
  dni: true,
  phone: true,
  role: true,
  assignments: {
    select: {
      deletedAt: true,
      incidence: {
        select: {
          status: true,
          date: true,
        },
      },
    },
  },
};
