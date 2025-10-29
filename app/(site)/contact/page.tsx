import React from "react";
import { Metadata } from "next";
import TeamIntro from "@/components/TeamIntro";
import FeedbackForm from "@/components/FeedbackForm";


export const metadata: Metadata = {
  title: "Contact Page",

  // other metadata
  description: "This is Contact page for Analytics Club"
};

const ContactPage = () => {
  return (
    <div className="pb-10 pt-30">
      <TeamIntro />
      {/* <FeedbackForm /> */}
    </div>
  );
};

export default ContactPage;
