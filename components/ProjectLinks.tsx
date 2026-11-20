import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './ProjectLinks.css';

interface ProjectLinksProps {
  website: string;
  repository?: string;
}

export default function ProjectLinks({ website, repository }: ProjectLinksProps) {
  return (
    <nav className="project-links" aria-label="Explore this project">
      <a href={website} target="_blank" rel="noopener noreferrer">
        Explore product <ArrowUpRight size={18} aria-hidden="true" />
      </a>
      {repository && <a href={repository} target="_blank" rel="noopener noreferrer">
        View GitHub repository <ArrowUpRight size={18} aria-hidden="true" />
      </a>}
    </nav>
  );
}
