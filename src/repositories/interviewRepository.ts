import { AppDataSource } from "../data-source";
import { Interview } from "../entities/Interview";

export const interviewRepository = AppDataSource.getRepository(Interview);