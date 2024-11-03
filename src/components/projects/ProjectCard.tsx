import React from "react";
import { NavLink } from "react-router-dom";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <NavLink
      to={ROUTES.PROJECT_DETAILS(project.slug)}
      className="w-[45%] md:w-[240px] h-[250px] gap-4 flex flex-col items-center justify-between p-8 border bg-row border-border hover:bg-hover rounded-md text-white"
    >
      <div className="text-6xl">{project.icon}</div>
      <div className="text-lg font-semibold text-center">{project.title}</div>
      <div className="text-md text-center">{project.description}</div>
    </NavLink>
  );
};

export default ProjectCard;
