import React, { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { Project } from '../../types';
import './kinetic-team-hybrid.css';

interface Props {
  projects: Project[];
  onProjectClick: (project: Project, cardEl?: HTMLElement) => void;
}

function ProjectArtwork({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  return project.image && !failed ? (
    <img src={project.image} alt={`${project.title} project artwork`} width={640} height={400}
      loading="lazy" decoding="async" onError={() => setFailed(true)} />
  ) : <span className="kinetic-art-fallback">{project.title}</span>;
}

export default function KineticProjectList({ projects, onProjectClick }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const id = useId();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 25, stiffness: 220, mass: 0.5 });
  const springY = useSpring(y, { damping: 25, stiffness: 220, mass: 0.5 });

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const update = () => { setCanHover(query.matches); setHovered(null); setExpanded(null); };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const dismiss = () => setHovered(null);
    window.addEventListener('scroll', dismiss, { passive: true });
    window.addEventListener('blur', dismiss);
    return () => { window.removeEventListener('scroll', dismiss); window.removeEventListener('blur', dismiss); };
  }, []);

  const movePreview = (event: React.PointerEvent) => {
    const width = Math.min(360, window.innerWidth - 32);
    const left = event.clientX + 24 + width > window.innerWidth - 16
      ? event.clientX - width - 24 : event.clientX + 24;
    const top = Math.min(event.clientY + 24, window.innerHeight - 256 - 16);
    x.set(Math.max(16, left));
    y.set(Math.max(16, top));
  };
  const activeProject = hovered === null ? null : projects[hovered];

  return (
    <section id="work" aria-labelledby={`${id}-title`} className="kinetic-work" onPointerLeave={() => setHovered(null)}>
      <div className="kinetic-inner">
        <header className="kinetic-header">
          <h2 id={`${id}-title`}>Selected <span>Works</span></h2>
          <div className="kinetic-header-rule" />
          <p>{String(projects.length).padStart(2, '0')} projects / Design & technology</p>
        </header>
        {projects.length === 0 ? <p className="kinetic-empty">New work is on the way. Get in touch to learn more.</p> : (
          <ol className="kinetic-list">
            {projects.map((project, index) => {
              const isOpen = expanded === index;
              const isActive = hovered === index || isOpen;
              return (
                <li key={project.title} className={`kinetic-row${isActive ? ' is-active' : ''}${hovered !== null && !isActive ? ' is-muted' : ''}`}
                  onPointerEnter={(event) => {
                    if (canHover && event.pointerType === 'mouse') { movePreview(event); setHovered(index); }
                  }}
                  onPointerMove={(event) => { if (canHover && event.pointerType === 'mouse') movePreview(event); }}
                  onPointerLeave={() => setHovered(null)}>
                  <h3>
                    <button type="button" className="kinetic-trigger" aria-expanded={canHover ? undefined : isOpen}
                      aria-controls={canHover ? undefined : `${id}-panel-${index}`}
                      aria-label={canHover ? `View ${project.title} case study` : `${isOpen ? 'Collapse' : 'Preview'} ${project.title}`}
                      onKeyDown={(event) => { if (event.key === 'Escape') { setHovered(null); setExpanded(null); } }}
                      onClick={() => { setHovered(null); if (canHover) onProjectClick(project); else setExpanded(isOpen ? null : index); }}>
                      <span className="kinetic-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <span className="kinetic-name">{project.title}</span>
                      <span className="kinetic-category">{project.category}</span>
                      <span className="kinetic-icon" aria-hidden="true">
                        {canHover ? <ArrowUpRight size={28} strokeWidth={1.5} /> : isOpen ? <Minus size={20} /> : <Plus size={20} />}
                      </span>
                    </button>
                  </h3>
                  {!canHover && <div id={`${id}-panel-${index}`} hidden={!isOpen} className="kinetic-panel">
                    {isOpen && <>
                      <div className="kinetic-inline-art"><ProjectArtwork project={project} /></div>
                      <button className="kinetic-case-link" type="button" onClick={() => onProjectClick(project)}>
                        View case study <ArrowUpRight size={20} aria-hidden="true" />
                      </button>
                    </>}
                  </div>}
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {canHover && !reducedMotion && createPortal(
        <motion.div aria-hidden="true" className="kinetic-floating" style={{ x: springX, y: springY }}>
          <AnimatePresence mode="wait">
            {activeProject && <motion.div key={activeProject.title} className="kinetic-preview"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.18 }}>
              <div className="kinetic-preview-art"><ProjectArtwork project={activeProject} /></div>
              <div className="kinetic-preview-caption">View case study <ArrowUpRight size={16} /></div>
            </motion.div>}
          </AnimatePresence>
        </motion.div>, document.body
      )}
    </section>
  );
}
