import { userResolvers } from './user.js';
import { postResolvers } from './post.js';
import { gifResolvers } from './gif.js';
import { categoryResolver } from './categories.js';
import { fontResolver } from './fonts.js';
import { colorResolver } from './colors.js';

export const resolvers = {
  Query: {
    ...categoryResolver.Query,
    ...fontResolver.Query,
    ...colorResolver.Query,
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