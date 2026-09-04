import { BlogPost } from "../../types";
import { stillness } from "./stillness";
import { paperNotebook } from "./paper-notebook";
import { weekendWithoutPlans } from "./weekend-without-plans";
import { needRest } from "./need-rest";
import { aiDilemma } from "./ai-dilemma";

export const blogPosts: BlogPost[] = [
  aiDilemma,
  needRest,
  stillness,
  paperNotebook,
  weekendWithoutPlans,
];
