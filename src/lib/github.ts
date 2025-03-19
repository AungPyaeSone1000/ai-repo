import { db } from "@/server/db";
import { Octokit } from "octokit";
export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


type Response = {
  commitMessage: String;
  commitHash: String;
  commitAuthor: String;
  commitAuthorAvatar: String;
  commitDate: String;
};

export const getCommitHashes = async (
  githuburl: string,
): Promise<Response[]> => {
  //https://github.com/Owner/RepositoryName
  const [ owner, repo ] = githuburl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  // Sort the commits by date
  const sortedCommits = data.sort((a: any, b: any) => {
    return (
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
    );
  });

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthor: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit.commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

export const pullCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  return unprocessedCommits;
};

// Fetch project github url
async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });

  if (!project?.githubUrl) {
    throw new Error("Project not found");
  }
  return { project, githubUrl: project?.githubUrl };
}

// Filter commits that have already been processed
async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: {
      projectId,
    },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
  return unprocessedCommits;
}

pullCommits("cm8fuvqk70000zbbgkjc5r7gu").then(console.log);


