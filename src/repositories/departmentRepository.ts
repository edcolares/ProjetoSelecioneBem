import { AppDataSource } from "../data-source";
import { Department } from "../entities/Department";

export const departmentRepository = AppDataSource.getRepository(Department);