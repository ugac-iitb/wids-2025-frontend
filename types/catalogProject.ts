export interface CatalogProject {
  id: number;
  project_name: string;
  mentor_name: string;
  mentor_ldap_mail: string;
  project_description: string;
  project_domains: string[];
  project_category: string;
  project_duration_weeks: string;
  number_of_mentees: number | null;
  prerequisites: string;
  project_image_drive_link: string;
}
