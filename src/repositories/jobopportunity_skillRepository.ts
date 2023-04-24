import { AppDataSource } from "../data-source";
import { JobOpportunity_Skill } from "../entities/JobOpportunity_Skill";

export const jobopportunity_skillRepository = AppDataSource.getRepository(JobOpportunity_Skill);