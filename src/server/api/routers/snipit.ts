// server/api/snipitRouter.ts
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const snipitRouter = createTRPCRouter({
  getRandomSnipit: protectedProcedure
    .input(z.object({ public: z.boolean() }))
    .query(async ({ input, ctx }) => {
      const { public: isPublic } = input;
      const { id: userId } = ctx.session.user;

      const snipitCount = await ctx.prisma.snipit.count();
      const skip = Math.floor(Math.random() * snipitCount);

      const whereClause = isPublic ? { isPublic: true } : { createdBy: userId };

      const snipit = await ctx.prisma.snipit.findFirst({
        take: 1,
        skip,
        where: whereClause,
        include: {
          tags: { include: { tag: true } },
          interactions: { where: { userId: ctx.session.user.id }, take: 1 },
          creator: true,
        },
      });

      return snipit;
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      // create new snipit
      const newSnipit = await ctx.prisma.snipit.create({
        data: {
          prompt: input.prompt,
          isPublic: input.isPublic,
          numFollows: 1,
          createdBy: ctx.session.user.id,
        },
      });

      // add owner's interaction record
      await ctx.prisma.snipitInteractions.create({
        data: {
          snipitId: newSnipit.id,
          userId: ctx.session.user.id,
          numChecked: 1,
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

  updateNumFollows: protectedProcedure
    .input(
      z.object({
        snipitId: z.number(),
        increment: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { snipitId, increment } = input;

      if (!ctx?.session.user)
        throw new TRPCError({
          message: "You must be logged in to follow a snipit.",
          code: "UNAUTHORIZED",
        });

      // Start a Prisma transaction
      await ctx.prisma.$transaction(async (prisma) => {
        // Retrieve the snipit by id
        const snipit = await prisma.snipit.findUnique({
          where: { id: snipitId },
        });

        if (!snipit) {
          throw new TRPCError({
            message: "Snipit does not exist.",
            code: "NOT_FOUND",
          });
        }

        // Update numFollows value
        await prisma.snipit.update({
          where: { id: snipitId },
          data: {
            numFollows: increment
              ? snipit.numFollows + 1
              : Math.max(0, snipit.numFollows - 1),
          },
        });

        if (increment) {
          // Create a SnipitInteraction record
          await prisma.snipitInteractions.create({
            data: {
              snipitId: snipitId,
              userId: ctx.session.user.id, // assuming ctx.user contains the logged-in user
              numChecked: 1,
            },
          });
        } else {
          // Remove the SnipitInteraction record
          await prisma.snipitInteractions.delete({
            where: {
              userId_snipitId: {
                snipitId: snipitId,
                userId: ctx.session.user.id,
              },
            },
          });
        }
      });

      return { success: true };
    }),

  updateNumChecked: protectedProcedure
    .input(z.object({ snipitId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { snipitId } = input;
      const userId = ctx.session.user.id;

      const snipitInteraction = await ctx.prisma.snipitInteractions.findUnique({
        where: { userId_snipitId: { snipitId, userId } },
      });

      if (!snipitInteraction) {
        throw new Error("User is not following this snipit");
      }
      await ctx.prisma.snipitInteractions.update({
        where: { userId_snipitId: { snipitId, userId } },
        data: {
          numChecked: {
            increment: 1,
          },
        },
      });

      return { success: true };
    }),
  getSnipits: protectedProcedure.query(async ({ ctx }) => {
    const snipits = await ctx.prisma.snipit.findMany();
    return snipits;
  }),
});
