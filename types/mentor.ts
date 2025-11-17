/**
 * TypeScript types for Mentor API responses
 */

export type MentorProject = {
  id: string;
  project_title: string;
  role: "Owner" | "Co-Mentor";
  preferences_count: number;
  wishlist_count: number;
};

export type MentorProjectsResponse = {
  items: MentorProject[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type Applicant = {
  id: string;
  name: string;
  email: string;
  roll_no: string;
};

export type Preference = {
  id: string;
  applicant: Applicant;
  sop: string;
  rank: number | null;
};

export type ProjectPreferencesResponse = {
  project: {
    project_title: string;
  };
  items: Preference[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type RankingRequest = {
  ranked_ids: string[];
};

