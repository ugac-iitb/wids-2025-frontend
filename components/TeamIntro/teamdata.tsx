import { Teammember } from "@/types/teammember";
import AnshumanImg from "@/public/images/members/Anshuman Gupta.png";
import AnvishkaImg from "@/public/images/members/Anviksha Vipasanna.png";
import AryanImg from "@/public/images/members/Aryan Kashyap.png";
import PranavImg from "@/public/images/members/Pranav Mylarassu.png";
import TanyaImg from "@/public/images/members/Tanya Menghani.png";

const teamdata: Teammember[] = [
  {
    id: 1,
    name: "Aryan Kashyap",
    imagePath: AryanImg,
    designation: "Manager, Analytics Club",
    mail: "manager.analytics.iitb@gmail.com",
  },
  {
    id: 2,
    name: "Anshuman Gupta",
    imagePath: AnshumanImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",

  },
  {
    id: 3,
    name: "Anvishka Vipasanna",
    imagePath: AnvishkaImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",

  },
  {
    id: 4,
    name: "Pranav Mylarassu",
    imagePath: PranavImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com",
  },
  {
    id: 5,
    name: "Tanya Meghnani",
    imagePath: TanyaImg,
    designation: "Convener, Analytics Club",
    mail: "analytics.convener@gmail.com"
   },
];

export default teamdata;
