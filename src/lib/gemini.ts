import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const summariseCommit = async (diff: string) => {
  //https://github.com/Owner/RepositoryName/commit/commitHash.diff
  const response = await model.generateContent([
    `You are an expert programmer, and you are trying to summarise a git diff.
        Reminders about the git diff format:
        For every file, there are  a few metadata lines, like (for example):
        \`\`\`
        diff --git a/lib/index.js b/lib/index.js
        index 7e0a4c1..b1e5ebe 100644
        --- a/lib/index.js
        +++ b/lib/index.js
        \`\`\`
        This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
        Then there is a specificer of the lines that were modified.
        A line starting with \`+\` is an addition, a line starting with \`-\` is a deletion.
        A line that starts with neither \`+\` or \`-\` is code given for context and better understanding.
        It is not part of the diff.
        [...]
        EXAMPLE SUMMARY COMMENTS:
        \`\`\`
        *Raised the amount of recording time from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
        *Fixed a typo in the github action name [.github/workflows/commit-summary.yml]
        *Moved the \`octokit\` initialisation to the sperate file [src/octokit.ts], [src/index.ts]
        *Added an OpenAi for completions [packages/utls/apis/openai.ts]
        *Lowered numeric tolerance for test files
        \`\`\`
        Most commits will have less comments than this examples list.
        The last comment does not include file names
        because there were more than two relevant files in this hypothetical commit.
        Do not include parts of the examples in your summary.
        It is given only as an example of appropriate comments.`,
    `Please summarise the changes in this commit: \n\n${diff}`,
  ]);

  return response.response.text();
};

console.log(await summariseCommit(``));