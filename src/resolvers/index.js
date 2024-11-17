import { userResolvers } from './user.js';
import { postResolvers } from './post.js';
import { gifResolvers } from './gif.js';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...gifResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...gifResolvers.Mutation
  },
  User: userResolvers.User,
  Post: postResolvers.Post,
  Gif: gifResolvers.Gif
};