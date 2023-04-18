import { AppDataSource } from "../data-source";
import { Candidate } from "../entities/Candidate";

export const candidateRepository = AppDataSource.getRepository(Candidate);