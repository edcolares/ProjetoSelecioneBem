import { Request, Response } from "express";
import { interviewRepository } from "../repositories/interviewRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { userRepository } from "../repositories/userRepository";
import { jobopportunityRepository } from "../repositories/jobopportunityRepository";
import { Between } from "typeorm";

export class InterviewController {

    /**
     * Responsável por realizar a criação de novo registro para a entidade INTERVIEW
     * @param req.body startDate, finishDate, delay, duration, totalScore, note, FK_candidateId, FK_userId, FK_jobopportunityId
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async create(req: Request, res: Response) {
        const { startDate, finishDate, delay, duration, totalScore, note, FK_candidateId, FK_userId, FK_jobopportunityId } = req.body

        if (!startDate || !finishDate || !duration || !totalScore || !FK_candidateId || !FK_userId || !FK_jobopportunityId) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }
        if (!Number.isInteger(Number(FK_candidateId)) || !Number.isInteger(Number(FK_userId)) || !Number.isInteger(Number(FK_jobopportunityId))) {
            return res.status(404).json({ message: 'Um dos campos de chave estrangeira não contem um número' })
        }

        const candidate = await candidateRepository.findOneBy({ id: Number(FK_candidateId) })
        const user = await userRepository.findOneBy({ id: Number(FK_userId) })
        const jobopportunity = await jobopportunityRepository.findOneBy({ id: Number(FK_jobopportunityId) })
        if (!candidate || !user || !jobopportunity) {
            return res.status(404).json({ message: 'Uma das chaves estrangeiras não foi localizada.' })
        }

        try {
            const newInterview = interviewRepository.create({ startDate, finishDate, delay, duration, totalScore, note, candidate, user, jobopportunity })
            await interviewRepository.save(newInterview)
            return res.status(201).json(newInterview)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Essa função permite que obtenha uma visão geral das entrevistas
     * criadas por um usuário específico. 
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async listByUser(req: Request, res: Response) {
        const { idUser } = req.params
        // const interviewAll = await interviewRepository
        //     .createQueryBuilder('interview')
        //     .leftJoinAndSelect('interview.user', 'user')
        //     .leftJoinAndSelect('interview.candidate', 'candidate')
        //     .leftJoinAndSelect('interview.jobopportunity', 'jobopportunity')
        //     .where('user.id = :id', { id: num })
        //     .getMany();
        try {

            const interviewAll = await interviewRepository.find({
                relations: {
                    jobopportunity: {
                        department: true,
                    },
                    candidate: true,
                    ratings: {
                        skill: true,
                    },
                },
                where: {
                    id: Number(idUser)
                },
            })
            return res.status(200).json(interviewAll)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Function que irá retornar todas as entrevistas de um determinado User que iniciaram 
     * em um período entre duas datas e todas as tabelas de relacionamento
     * @param req request
     * @param res response
     * @returns JSON
     */
    async getInterviewsBetweenDates(req: Request, res: Response) {
        const { initialDate, finalDate } = req.body
        const { idUser } = req.params

        try {

            const interviewBetweenDates = await interviewRepository.find({
                relations: {
                    jobopportunity: {
                        department: true,
                    },
                    candidate: true,
                    ratings: {
                        skill: true,
                    },
                    user: true,
                },
                where: {
                    user: {
                        id: Number(idUser),
                    },
                    startDate: Between(new Date(initialDate), new Date(finalDate)),
                },
            })

            if (!interviewBetweenDates) {
                return res.status(404).json({ message: 'Não existe entrevistas cadastradas para esse período' })
            }
            return res.status(200).json(interviewBetweenDates)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Busca todas as entrevistas realizadas e suas relações de outras tabelas
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async find(req: Request, res: Response) {
        try {
            const interview = await interviewRepository.find({
                relations: {
                    jobopportunity: {
                        department: true,
                    },
                    candidate: true,
                    ratings: {
                        skill: true,
                    },
                },
            })
            if (!interview) {
                return res.status(404).json({ message: 'Não existe entrevistas cadastradas' })
            }
            return res.status(200).json(interview)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Achamos que não será utilizado
     * Usuário não terá a opção de ATUALIZAR UMA INTREVISTA
     */
    // async update(req: Request, res: Response) {
    //     const { id } = req.body

    //     try {
    //         const interview = await interviewRepository.findOneBy({ id: Number(id) })
    //         if (!interview) {
    //             return res.status(404).json({ message: 'Não existe entrevistas cadastradas' })
    //         }
    //         interviewRepository.merge(interview, req.body)
    //         const results = await interviewRepository.save(interview)
    //         return res.send(results)
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ message: 'Internal Sever Error' })

    //     }
    // }

    /** Entrevista não poderá ser excluida, pois uma vez realizada não haverá
         * atualização, nem exclusão da mesma.
         */
    // async delete(req: Request, res: Response) {
    //     const { idInterview } = req.params

    //     try {
    //         const interview = await interviewRepository.findOneBy({
    //             id: Number(idInterview),
    //         })

    //         if (!interview) {
    //             return res.status(404).json({ message: 'Entrevista não foi encontrado.' })
    //         }

    //         const results = await interviewRepository.remove(interview)
    //         return res.send(results)
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ message: 'Internal Sever Error' })
    //     }
    // }
}