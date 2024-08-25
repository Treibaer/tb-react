import React from "react";
import { NavLink } from "react-router-dom";
import { Project } from "../../models/project";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <NavLink
      to={`/projects/${project.slug}`}
      key={project.slug}
      className="w-[45%] md:w-[240px] h-[300px] gap-4 flex flex-col items-center justify-between p-8 m-2 border hover:bg-slate-800 rounded-md text-white"
    >
      <div className="text-8xl">{project.icon}</div>
      <div className="text-lg font-semibold text-center">{project.title}</div>
      <div className="text-md text-center">{project.description}</div>
    </NavLink>
  );
};

export default ProjectCard;
