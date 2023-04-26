import { Request, Response } from "express";
import { ratingRepository } from "../repositories/ratingRepository";
import { jobopportunity_skillRepository } from "../repositories/jobopportunity_skillRepository";
import { Interview } from "../entities/Interview";
import { interviewRepository } from "../repositories/interviewRepository";
import { Skill } from "../entities/Skill";
import { skillRepository } from "../repositories/skillRepository";
import { jobopportunityRepository } from "../repositories/jobopportunityRepository";

export class RatingController {

    /**
     * Function responsavel pela inserção de um novo RATING, desde que ele tenha sido mapeado
     * na JobOpportunty_Skill
     * @param req Request
     * @param res Response
     * @returns 
     */
    async create(req: Request, res: Response) {
        const { score, FK_skillId, FK_interviewId } = req.body

        try {
            if (!FK_interviewId || !FK_skillId || !score) {
                return res.status(400).json({ message: 'Id da entrevista não foi passada por parametro' })
            }

            if (!Number.isInteger(Number(score))) {
                return res.status(400).json({ message: 'Preencha o campo score com um número inteiro.' })
            }

            const objInterview = await interviewRepository.findOneBy({ id: Number(FK_interviewId) })
            if (!objInterview) {
                return res.status(400).json({ message: 'Não foi localizado nenhuma entrevista' })
            }

            const objSkill = await skillRepository.findOneBy({ id: Number(FK_skillId) })
            if (!objSkill) {
                return res.status(400).json({ message: 'Não foi localizado nenhuma skill' })
            }

            // const queryBuilder = await jobopportunity_skillRepository
            //     .createQueryBuilder('jos')
            //     .innerJoinAndSelect(Interview, 'i', 'jos.FK_jobopportunityId = i.id')
            //     .innerJoinAndSelect(Skill, 's', 's.id = jos.FK_skillId')
            //     .where('i.id = :InterviewId', { InterviewId: Number(FK_interviewId) })
            //     .andWhere('s.id = :SkillId', { SkillId: Number(FK_skillId) })
            //     .getMany();
            //return res.json(queryBuilder);

            /**
             * Essa consulta aqui está funcionando porém não aparece a SKILL avaliada
             */
            const seraquetem = await jobopportunityRepository.find({
                select: {

                    id: true,
                    title: true,

                    jobopportunitySkills: {
                        id: true,
                        weightingFactor: true,
                        skill: {
                            id: true,
                            name: true,
                        },
                    },
                    interviews: {
                        id: true,
                        candidate: {
                            name: true,
                        },
                    },
                },
                relations: {
                    jobopportunitySkills: {
                        skill: {
                            ratings: true,
                        },
                    },
                    interviews: {
                        ratings: true,
                        candidate: true,
                    },

                },
                where: {
                    interviews: {
                        id: Number(FK_interviewId),
                    },
                    jobopportunitySkills: {
                        skill: {
                            id: Number(FK_skillId),
                        },
                    },
                },
            })
            return res.json(seraquetem)
            // if (queryBuilder.length != 0) {
            //     const newRating = new Rating()
            //     newRating.score = score
            //     newRating.interview = objInterview
            //     newRating.skill = objSkill

            //     const seraquetem = await ratingRepository.find({
            //         relations: {
            //             skill: true,
            //             interview: true,
            //         },
            //         where: {
            //             interview: {
            //                 id: Number(objInterview.id)
            //             },
            //             skill: {
            //                 id: Number(objSkill.id)
            //             },
            //         },
            //     })
            //     return res.json(seraquetem)

            //     const rating = await ratingRepository.create(newRating)
            //     await ratingRepository.save(rating)
            //     return res.status(201).json(rating)
            // } else {
            //     return res.status(200).json({ message: 'Essa skill não foi mapeada para a oportunidade' })
            // }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Essa function tem por objetivo listar todos os RATING de uma INTERVIEW
     * @param idInterview Espara-se receber um ID de INTERVIEW
     * @param req Request
     * @param res Response
     * @returns Retorna um JSON com ratings
     */
    async findByInterview(req: Request, res: Response) {
        const { idInterview } = req.params

        const ratings = await ratingRepository
            .createQueryBuilder('rating')
            .leftJoinAndSelect('rating.skill', 'skill')
            .where('rating.idInterview = :id', { id: idInterview })
            .getMany();
        return res.json(ratings)
    }
}