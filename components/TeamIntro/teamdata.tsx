import { Teammember } from "@/types/teammember";
import AanshImg from "@/public/images/members/aansh.png";
import AryanImg from "@/public/images/members/aryan.png";
import BhaktiImg from "@/public/images/members/bhakti.png";
import AdvaitImg from "@/public/images/members/advait.png";
import MehakImg from "@/public/images/members/mehak.png";

const teamdata: Teammember[] = [
  {
    id: 1,
    name: "Aansh Samyani",
    imagePath: AanshImg,
    designation: "Manager, Analytics Club",
    mail: "manageranalytics@iitb.ac.in",
    phone: "7021068263",
  },
  {
    id: 2,
    name: "Aryan Kashyap",
    imagePath: AryanImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",
    phone: "6206443754",

  },
  {
    id: 3,
    name: "Bhakti Bansal",
    imagePath: BhaktiImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",
    phone: "9717782855",

  },
  {
    id: 4,
    name: "Advait Bhedasgaonkar",
    imagePath: AdvaitImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",
    phone: "9970426665",
  },
  {
    id: 5,
    name: "Mehak",
    imagePath: MehakImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",
    phone: "7988346345",
  },
];

export default teamdata;
