import { Metadata } from "next";
import MentorProject from "@/components/MentorProject";

export const metadata: Metadata = {
  title: "WiDS Mentor Project Details",
  description:
    "Detailed information about a specific project ur taking.",
};

// ✅ Dynamic route component
const MentorProjectPage = async ({ params }: { params: Promise<{ id?: string | null }> }) => {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id ?? null;
  const id = rawId === null || rawId === undefined ? "" : String(rawId);

  return (
    <section className="overflow-hidden pb-5 pt-25 lg:pb-10 lg:pt-30 xl:pb-15 xl:pt-45">
      <div className="animate_top mx-auto max-w-5xl text-center">
        {id ? (
          <>
            <MentorProject projectId={id} />
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

export default MentorProjectPage;
