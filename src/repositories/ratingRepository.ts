import { AppDataSource } from "../data-source";
import { Rating } from "../entities/Rating";

export const ratingRepository = AppDataSource.getRepository(Rating);