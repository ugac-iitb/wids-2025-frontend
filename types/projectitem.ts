export interface Mentor {
  id: number;
  name: string;
  email: string;
  roll_no: string | null;
  is_mentor: boolean;
}

export interface ProjectItem {
  id: number;
  project_domain_1: string;
  project_domain_2: string;
  project_title: string;
  project_description: string;
  difficulty: string;
  project_type: string;
  duration_weeks: number;
  weekly_hours: number;
  number_of_mentees: number;
  pre_requisites: string;
  project_image: string;
  resources_link: string;
  previously_completed: boolean;
  project_experience: string;
  comments: string;
  mentor: Mentor;
  co_mentor: Mentor | null;
  is_wishlisted?: boolean;
  sop: string;
  updated_at: string; // or Date, depending on how you parse it
}

export interface ProjectResponse {
  ok: boolean;
  project: ProjectItem;
}
