export const assignmentInclude = {
  user: {
    select: {
      id: true,
      name: true,
      lastname: true,
      dni: true,
      phone: true,
      username: true,
      role: true,
    },
  },
  assigner: {
    select: {
      id: true,
      name: true,
      lastname: true,
      dni: true,
      phone: true,
      username: true,
      role: true,
    },
  },
};
