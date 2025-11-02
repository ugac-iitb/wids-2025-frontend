import { Metadata } from "next";
import ProjectDetails from "@/components/ProjectDetails";

export const metadata: Metadata = {
  title: "WiDS Project Details",
  description:
    "Detailed information about a specific WiDS project, including mentors, domains, and requirements.",
};

// ✅ Dynamic route component
const ProjectPage = async ({ params }: { params: Promise<{ id?: string | null }> }) => {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id ?? null;
  const id = rawId === null || rawId === undefined ? "" : String(rawId);

  return (
    <section className="overflow-hidden pb-25 pt-25 lg:pb-32.5 lg:pt-30 xl:pb-37.5 xl:pt-35">
      <div className="animate_top mx-auto max-w-5xl text-center">
        {id ? (
          <>
            <ProjectDetails projectId={id} />
          </>
        ) : (
          <div className="text-red-300">
            <p>Project id is missing from the route.</p>
            <p>If you followed an in-app link, check that it was built with a valid id (not null/undefined).</p>
            <p>Current raw param value: {String(rawId)}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectPage;
