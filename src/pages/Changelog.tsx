import { useState } from "react";
import Client from "../services/Client";
import { useLoaderData } from "react-router-dom";
import CommitLineChart from "./ChangelogChart";

type Commit = {
  commitId: string;
  author: string;
  date: string;
  content: string;
};

const Changelog: React.FC = () => {
  const { commits } = useLoaderData() as { commits: Commit[] };
  return (
    <div className="m-4">
      <div className="text-6xl text-center mt-8">Changelog</div>
      <CommitLineChart commits={commits} />
      {commits.map((commit) => (
        <div key={commit.commitId} className="m-4 flex gap-2">
          <div className="flex-1">{commit.date}</div>
          <div className="flex-1">{commit.author}</div>
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
