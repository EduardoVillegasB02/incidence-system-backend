export function generalHelper(groupIncidence: any, groupUser: any) {
  const total = groupIncidence.reduce(
    (sum: any, g: { _count: { _all: any } }) => sum + g._count._all,
    0,
  );
  const process =
    groupIncidence.find((g) => g.status === 'process')?._count._all ?? 0;
  const completed =
    groupIncidence.find((g) => g.status === 'completed')?._count._all ?? 0;
  const finished =
    groupIncidence.find((g) => g.status === 'finished')?._count._all ?? 0;
  const hunters = groupUser.find((g) => g.role === 'hunter')?._count._all ?? 0;
  const operators =
    groupUser.find((g) => g.role === 'operator')?._count._all ?? 0;
  return {
    total,
    process,
    completed,
    finished,
    hunters,
    operators,
  };
}
