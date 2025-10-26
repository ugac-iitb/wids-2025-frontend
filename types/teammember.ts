import { StaticImageData } from "next/image";

export interface Teammember {
  id: number;
  name: string;
  imagePath: StaticImageData;
  designation: string;
  mail: string;
}
