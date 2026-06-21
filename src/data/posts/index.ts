import { BlogPost } from "../../types";
import { stillness } from "./stillness";
import { paperNotebook } from "./paper-notebook";
import { weekendWithoutPlans } from "./weekend-without-plans";
import { needRest } from "./need-rest";

export const blogPosts: BlogPost[] = [
  needRest,
  stillness,
  paperNotebook,
  weekendWithoutPlans,
];
