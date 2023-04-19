import { AppDataSource } from "../data-source";
import { Skill } from "../entities/Skill";

export const skillRepository = AppDataSource.getRepository(Skill);