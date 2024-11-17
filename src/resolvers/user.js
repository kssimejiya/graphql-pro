import { GraphQLError } from 'graphql'
import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import path from 'path'
import { processUpload } from '../utils/upload.js'

export const userResolvers = {
  Query: {
    users: async (_parent, _args, ctx) => {
      return ctx.prisma.user.findMany()
    },
    user: async (_parent, { id }, ctx) => {
      return ctx.prisma.user.findUnique({
        where: { id }
      })
    }
  },
  Mutation: {
    createUser: async (_parent, { email, name, image }, ctx) => {
      try {
        let imagePath = null

        if (image) {
          console.log('Starting file upload process...')
          imagePath = await processUpload(image)
          console.log('File uploaded successfully:', imagePath)
        }

        const user = await ctx.prisma.user.create({
          data: {
            email,
            name: name || null,
            image: imagePath
          }
        })

        return user
      } catch (error) {
        console.error('Error in createUser:', error)
        throw error instanceof GraphQLError
          ? error
          : new GraphQLError('Failed to create user')
      }
    }
  },
  User: {
    posts: async (parent, _args, ctx) => {
      return ctx.prisma.post.findMany({
        where: { authorId: parent.id }
      })
    }
  }
}
