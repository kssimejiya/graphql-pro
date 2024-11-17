

export const postResolvers = {
  Query: {
    posts: async (_parent, _args, ctx) => {
      return ctx.prisma.post.findMany()
    },
    post: async (_parent, { id }, ctx) => {
      return ctx.prisma.post.findUnique({
        where: { id }
      })
    }
  },
  Mutation: {
    createPost: async (_parent, { title, content, authorId }, ctx) => {
      return ctx.prisma.post.create({
        data: {
          title,
          content: content || null,
          published: false,
          author: {
            connect: { id: authorId }
          }
        }
      })
    },
    updatePost: async (_parent, { id, published }, ctx) => {
      return ctx.prisma.post.update({
        where: { id },
        data: {
          published: published ?? false
        }
      })
    },
    deletePost: async (_parent, { id }, ctx) => {
      try {
        await ctx.prisma.post.delete({
          where: { id }
        })

        return {
          success: true,
          message: 'Post deleted successfully'
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
          return {
            success: false,
            message: `Post with ID ${id} not found`
          }
        }

        console.error('Error deleting post:', error)
        return {
          success: false,
          message: 'An error occurred while deleting the post'
        }
      }
    }
  },
  Post: {
    author: async (parent, _args, ctx) => {
      const author = await ctx.prisma.user.findUnique({
        where: { id: parent.authorId }
      })

      if (!author) {
        throw new Error(`Author with ID ${parent.authorId} not found`)
      }

      return author
    }
  }
}
