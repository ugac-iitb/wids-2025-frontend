import React from "react";
import ResourceHeader from "./resourceheader";
import ResourceItem from "./resourceitem";
import ResourceData from "./resourcesdata";

const Resource = async () => {
  return (
    <section className="py-20 lg:py-25 xl:py-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <div className="animate_top mx-auto text-center">
          <ResourceHeader />
        </div>
      </div>

      <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
        <div className="grid grid-cols-1 gap-y-20 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {ResourceData.map((resource) => (
                <ResourceItem key={resource._id} resource={resource} />
            ))}
        </div>

      </div>
    </section>
  );
};

export default Resource;
