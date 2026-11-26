import projectsJson from "@/public/data/projects.json";
import type { CatalogProject } from "@/types/catalogProject";

export const catalogProjects: CatalogProject[] = projectsJson as CatalogProject[];

export const getCatalogProject = (id: number): CatalogProject | undefined =>
  catalogProjects.find((project) => project.id === id);
