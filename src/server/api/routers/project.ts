import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubURL: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //Create Project and add it to usertoProject
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubURL,
          name: input.name,
          userToProject: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      await pullCommits(project.id);
      return project;
    }),
  //Get Projects by user
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProject: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
  }),
  //Get Commits by project
  getCommits: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      pullCommits(input.projectId).then().catch(console.error);
      return await ctx.db.commit.findMany({
        where: {
          projectId: input.projectId,
        },
      });
    }),
});
