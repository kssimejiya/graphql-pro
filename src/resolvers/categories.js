export const categoryResolver = {
  Query: {
     categories: async (_parent, _args, context) => {
      return await context.prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      });
    },
  }
};