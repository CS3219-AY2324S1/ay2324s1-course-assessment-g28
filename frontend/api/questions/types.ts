/**
 * Definition of type to be received from questions API
 */

import { z } from "zod";

const QuestionCategory = 

const Question = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: 
})

// all properties are required by default
const Dog = z.object({
  name: z.string(),
  age: z.number(),
});

// extract the inferred type like this
type Dog = z.infer<typeof Dog>;