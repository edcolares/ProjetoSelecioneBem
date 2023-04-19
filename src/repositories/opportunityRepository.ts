import { AppDataSource } from "../data-source";
import { Opportunity } from "../entities/Opportunity";

export const opportunityRepository = AppDataSource.getRepository(Opportunity);