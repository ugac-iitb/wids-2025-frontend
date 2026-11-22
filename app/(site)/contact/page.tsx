import React from "react";
import { Metadata } from "next";
import TeamIntro from "@/components/TeamIntro";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Contact Page",
  description: "Contact page for Analytics Club and Web Team",
};

const ContactPage = () => {
  return (
    <div className="pb-10 pt-20 sm:pt-24">
      <TeamIntro />
      {/* <FeedbackForm /> */}
    </div>
  );
};

export default ContactPage;
