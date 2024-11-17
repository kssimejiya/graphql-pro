export const colorResolver = {
  Query: {
     colors: async (_parent, _args, context) => {
      return await context.prisma.color.findMany({
        orderBy: {
          name: 'asc'
        }
      });
    },
  }
};