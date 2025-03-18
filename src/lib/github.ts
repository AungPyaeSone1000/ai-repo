import { Octokit } from "octokit";
export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const githuburl = "https://github.com/AungPyaeSone1000/Music-Player";

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
  const { data } = await octokit.rest.repos.listCommits({
    owner: "AungPyaeSone1000",
    repo: "Music-Player",
  });

  // Sort the commits by date
  const sortedCommits = data.sort((a: any, b: any) => {
    return (
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
    );
  });

  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthor: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit.commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
  }));
};

console.log(await getCommitHashes(githuburl));

