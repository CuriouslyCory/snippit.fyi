// server/api/snipitRouter.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  authAwareProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getLogarithmicRandomNumber, getRandomInt } from "~/utils/random";
import { type Tag } from "@prisma/client";

/**
 * Snipit query option helpers
 */
type UserNope = {
  nopes?: {
    some: {
      userId: string;
    };
  };
};

type SnipitId = {
  id: number;
};

type RandomSnippitWhereNot = UserNope | SnipitId;

type RandomSnippitWhereClause = {
  NOT?: RandomSnippitWhereNot | { OR: RandomSnippitWhereNot[] };
};

/**
 * Snipit router
 */
export const snipitRouter = createTRPCRouter({
  /**
   * Get a random snipit
   * @param public - if true, include public snippits, if false only return user's snipits
   * @param not - if set, exclude this snipit
   */
  getAnonList: authAwareProcedure
    .input(z.object({ feedType: z.string(), not: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx?.session?.user?.id;

      const whereClause: RandomSnippitWhereClause = {};

      const whereNot: RandomSnippitWhereNot[] = [];

      // if the user is logged in, filterout their nopes
      if (userId) {
        whereNot.push({
          nopes: {
            some: {
              userId: userId,
            },
          },
        });
      }

      // if "not" is set, filter this record out
      if (input.not) {
        whereNot.push({ id: input.not });
      }

      if (whereNot.length) {
        whereClause.NOT =
          whereNot.length === 1 ? whereNot[0] : { OR: whereNot };
      }

      const snipitWhere = {
        where: whereClause,
      };

      // get the total possible count of snipits
      const snipitCount = await ctx.prisma.snipit.count(snipitWhere);
      const skip = getRandomInt(0, snipitCount - 1);

      const snipit = await ctx.prisma.snipit.findFirst({
        skip,
        where: whereClause,
        include: {
          tags: { include: { tag: true } },
          interactions: { where: { userId }, take: 1 },
          creator: true,
        },
      });
      return snipit;
    }),
  getNext: protectedProcedure
    .input(z.object({ feedType: z.string(), not: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx?.session?.user?.id;

      const whereClause: RandomSnippitWhereClause = {};

      const whereNot: RandomSnippitWhereNot[] = [];

      // if the user is logged in, filterout their nopes

      whereNot.push({
        nopes: {
          some: {
            userId: userId,
          },
        },
      });

      // if "not" is set, filter this record out
      if (input.not) {
        whereNot.push({ id: input.not });
      }

      if (whereNot.length) {
        whereClause.NOT =
          whereNot.length === 1 ? whereNot[0] : { OR: whereNot };
      }

      const snipitWhere = {
        where: whereClause,
      };

      // get the total possible count of snipits
      const snipitCount = await ctx.prisma.snipit.count(snipitWhere);
      const skip = getLogarithmicRandomNumber(1, snipitCount) - 1;

      // the more a user has checked a snipit the less often it will show up
      // but we don't want to wait until the newest is fully caught up so we need to weight it somehow
      //snipit 1, checked 100, last 1 hr
      //snipit 2, checked 25, last 1 hr
      //snipit 3, checked 5, last 1 hr  <== in this example this should be first

      const snipit = await ctx.prisma.snipit.findMany({
        where: whereClause,
        skip,
        take: 1,
        include: {
          tags: { include: { tag: true } },
          interactions: {
            where: { userId },
            take: 1,
            orderBy: [{ numChecked: "asc" }, { lastChecked: "asc" }],
          },
          creator: true,
        },
      });
      return snipit[0];
    }),
  getSnipitById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const snipit = await ctx.prisma.snipit.findUnique({
        where: { id: input.id },
      });
      return snipit;
    }),

  createSnipit: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        isPublic: z.boolean(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // First, upsert the tags (if there are any)
      let tags: Tag[] = [];
      if (input.tags?.length) {
        tags = await Promise.all(
          input.tags?.map((tagName: string) =>
            ctx.prisma.tag.upsert({
              where: { name: tagName.trim().toLowerCase() },
              create: { name: tagName.trim().toLowerCase() },
              update: {},
            })
          )
        );
      }

      // form the tagdata object
      const tagData =
        input.tags && input.tags.length
          ? {
              tags: {
                create: tags.map((tag) => ({
                  tagId: tag.id,
                })),
              },
            }
          : undefined;

      // create new snipit, interaction, and tags
      const newSnipit = await ctx.prisma.snipit.create({
        data: {
          prompt: input.prompt.trim(),
          isPublic: input.isPublic,
          numFollows: 1,
          createdBy: ctx.session.user.id,
          ...tagData,
          interactions: {
            create: {
              userId: ctx.session.user.id,
              numChecked: 1,
            },
          },
        },
      });

      return newSnipit;
    }),

  deleteSnipit: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const snipitToDelete = await ctx.prisma.snipit.findUnique({
        where: { id: input.id },
      });

      if (!snipitToDelete)
        throw new TRPCError({
          message: "Snipit does not exist.",
          code: "NOT_FOUND",
        });

      if (snipitToDelete.createdBy !== ctx.session.user.id) {
        throw new Error("You can only delete snipits you created.");
      }

      const deletedSnipit = await ctx.prisma.snipit.delete({
        where: { id: input.id },
      });

      return deletedSnipit;
    }),

  check: protectedProcedure
    .input(
      z.object({
        snipitId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { snipitId } = input;

      // TODO: Handle this in middleware
      if (!ctx?.session.user)
        throw new TRPCError({
          message: "You must be logged in to perform this action.",
          code: "UNAUTHORIZED",
        });

      // Start a Prisma transaction
      await ctx.prisma.$transaction(async (prisma) => {
        // Retrieve the snipit by id
        const snipit = await prisma.snipit.findUnique({
          where: { id: snipitId },
          include: {
            interactions: { where: { userId: ctx.session.user.id }, take: 1 },
          },
        });

        if (!snipit) {
          throw new TRPCError({
            message: "Snipit does not exist.",
            code: "NOT_FOUND",
          });
        }

        if (!snipit.interactions.length) {
          // Create a SnipitInteraction record
          await prisma.snipitInteractions.create({
            data: {
              snipitId: snipitId,
              userId: ctx.session.user.id, // assuming ctx.user contains the logged-in user
              numChecked: 1,
            },
          });

          // Update numFollows value
          await prisma.snipit.update({
            where: { id: snipitId },
            data: {
              numFollows: snipit.numFollows + 1,
            },
          });
        } else {
          // Update numChecked value
          if (!snipit?.interactions?.[0]?.id)
            throw new TRPCError({
              message: "Something went wrong.",
              code: "INTERNAL_SERVER_ERROR",
            });
          await prisma.snipitInteractions.update({
            where: { id: snipit.interactions[0].id },
            data: {
              numChecked: snipit.interactions[0].numChecked + 1,
            },
          });
        }
      });

      return { success: true };
    }),
  skip: protectedProcedure
    .input(
      z.object({
        snipitId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { snipitId } = input;

      if (!ctx?.session.user)
        throw new TRPCError({
          message: "You must be logged in to perform this action.",
          code: "UNAUTHORIZED",
        });

      // Start a Prisma transaction
      await ctx.prisma.$transaction(async (prisma) => {
        // Retrieve the snipit by id
        const snipit = await prisma.snipit.findUnique({
          where: { id: snipitId },
          include: {
            interactions: { where: { userId: ctx.session.user.id }, take: 1 },
          },
        });

        if (!snipit) {
          throw new TRPCError({
            message: "Snipit does not exist.",
            code: "NOT_FOUND",
          });
        }

        if (snipit.interactions.length) {
          // Remove the SnipitInteraction record
          await prisma.snipitInteractions.delete({
            where: {
              userId_snipitId: {
                snipitId: snipitId,
                userId: ctx.session.user.id,
              },
            },
          });

          // Update numFollows value
          await prisma.snipit.update({
            where: { id: snipitId },
            data: {
              numFollows: snipit.numFollows - 1,
            },
          });
        }

        await prisma.nope.create({
          data: { userId: ctx.session.user.id, snipitId: snipitId },
        });
      });

      return { success: true };
    }),
});
