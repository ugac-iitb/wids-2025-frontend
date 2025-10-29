import { Metadata } from "next";
import ProjectDetails from "@/components/ProjectDetails";

export const metadata: Metadata = {
  title: "WiDS Project Details",
  description:
    "Detailed information about a specific WiDS project, including mentors, domains, and requirements.",
};

// ✅ Dynamic route component
const ProjectPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <section className="overflow-hidden pb-25 pt-45 lg:pb-32.5 lg:pt-50 xl:pb-37.5 xl:pt-55">
      <div className="animate_top mx-auto max-w-5xl text-center">
        {/* Pass project ID to the ProjectDetails component */}
        <ProjectDetails projectId={id} />
      </div>
    </section>
  );
};

export default ProjectPage;
