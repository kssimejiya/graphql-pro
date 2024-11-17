export const fontResolver = {
  Query: {
     fonts: async (_parent, _args, context) => {
      return await context.prisma.font.findMany({
        orderBy: {
          name: 'asc'
        }
      });
    },
  }
};