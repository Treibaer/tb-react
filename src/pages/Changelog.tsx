import { useLoaderData } from "react-router-dom";
import Client from "../services/Client";
import CommitLineChart from "./ChangelogChart";

type Commit = {
  commitId: string;
  author: string;
  date: string;
  content: string;
  formattedDate: string;
};

const Changelog: React.FC = () => {
  const { commits } = useLoaderData() as { commits: Commit[] };
  commits.forEach((commit) => {
    const date = new Date(commit.date);
    commit.formattedDate = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}`;
  });
  return (
    <div className="m-4 select-none">
      <div className="text-6xl text-center mt-8">Changelog</div>
      <CommitLineChart commits={commits} />
      {commits.map((commit) => (
        <div key={commit.commitId} className="m-4 flex gap-4">
          <div className="w-20">{commit.formattedDate}</div>
          <div className="">{commit.author}</div>
          <div className="flex-1">{commit.content}</div>
        </div>
      ))}
    </div>
  );
};

export default Changelog;

export const loader = async () => {
  const commits = await Client.shared.get<Commit[]>("/changelog");
  return { commits };
};
