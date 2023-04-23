import { Request, Response } from "express";
import { interviewRepository } from "../repositories/interviewRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { userRepository } from "../repositories/userRepository";
import { jobopportunityRepository } from "../repositories/jobopportunityRepository";

export class InterviewController {

    /** Cria uma nova entrevista */
    async create(req: Request, res: Response) {
        const { startDate, finishDate, delay, duration, totalScore, note, FK_candidateId, FK_userId, FK_jobopportunityId } = req.body

        if (!startDate || !finishDate || !duration || !totalScore || !note || !FK_candidateId || !FK_userId || !FK_jobopportunityId) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }

        const candidate = await candidateRepository.findOneBy({ id: Number(FK_candidateId) })
        const user = await userRepository.findOneBy({ id: Number(FK_userId) })
        const jobopportunity = await jobopportunityRepository.findOneBy({ id: Number(FK_jobopportunityId) })

        if (!candidate || !user || !jobopportunity) {
            return res.status(404).json({ message: 'Alguma chave estrangeira não existe' })
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

    async listByUser(req: Request, res: Response) {
        try {
            const { idUser } = req.params
            const num = Number(idUser)
            const interviewAll = await interviewRepository
                .createQueryBuilder('interview')
                .leftJoinAndSelect('interview.user', 'user')
                .leftJoinAndSelect('interview.candidate', 'candidate')
                .leftJoinAndSelect('interview.jobopportunity', 'jobopportunity')
                .where('user.id = :id', { id: num })
                .getMany();

            res.json(interviewAll)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Function para retornar entrevistas de um período entre duas datas
         * Datainicial até DataFinal
        */
    async getInterviewsBetweenDates(req: Request, res: Response) {
        const { initialDate, finalDate } = req.params

        try {

            const interview = await interviewRepository
                .createQueryBuilder('interview')
                .where('interview.startDate > :initialDate AND interview.finishDate < :finalDate', { initialDate, finalDate })
                .getMany();

            if (!interview) {
                return res.status(404).json({ message: 'Não existe entrevistas cadastradas' })
            }
            res.json(interview)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Busca todas as entrevistas realizadas sem nenhum parametro */
    async find(req: Request, res: Response) {

        try {
            const interview = await interviewRepository.find()
            if (!interview) {
                return res.status(404).json({ message: 'Não existe entrevistas cadastradas' })
            }
            res.json(interview)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Achamos que não será utilizado
     * Usuário não terá a opção de ATUALIZAR UMA INTREVISTA
     */
    async update(req: Request, res: Response) {
        const { id } = req.body

        try {
            const interview = await interviewRepository.findOneBy({ id: Number(id) })
            if (!interview) {
                return res.status(404).json({ message: 'Não existe entrevistas cadastradas' })
            }
            interviewRepository.merge(interview, req.body)
            const results = await interviewRepository.save(interview)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /** Entrevista não poderá ser excluida, pois uma vez realizada não haverá
         * atualização, nem exclusão da mesma.
         */
    async delete(req: Request, res: Response) {
        const { idInterview } = req.params

        try {
            const interview = await interviewRepository.findOneBy({
                id: Number(idInterview),
            })

            if (!interview) {
                return res.status(404).json({ message: 'Entrevista não foi encontrado.' })
            }

            const results = await interviewRepository.remove(interview)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }
}