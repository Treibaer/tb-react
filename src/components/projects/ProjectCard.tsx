import React from 'react';
import { NavLink } from 'react-router-dom';
import { Project } from '../../models/project';

const ProjectCard: React.FC<{project: Project}> = ({ project }) => {
  return (
    <NavLink
      to={`/projects/${project.slug}`}
      key={project.slug}
      className="tb-card"
    >
      <div className="icon">📒</div>
      <div className="title">{project.title}</div>
    </NavLink>
  );
};

export default ProjectCard;
