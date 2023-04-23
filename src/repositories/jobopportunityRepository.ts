import { AppDataSource } from "../data-source";
import { JobOpportunity } from "../entities/JobOpportunity";

export const jobopportunityRepository = AppDataSource.getRepository(JobOpportunity);