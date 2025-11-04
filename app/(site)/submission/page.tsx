import { Metadata } from "next";
import Image from "next/image";
import Submission from "@/components/Submission";

export const metadata: Metadata = {
  title: "WiDS-Submission",

  // other metadata
  description: "This page helps you to submit your preferences"
};

const SubmissionPage = () => {
  return (
    <div>
      <Submission />
    </div>
  );
};


export default SubmissionPage;
