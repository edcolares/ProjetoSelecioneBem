import { Request, Response } from "express";
import { interviewRepository } from "../repositories/interviewRepository";
import { candidateRepository } from "../repositories/candidateRepository";
import { userRepository } from "../repositories/userRepository";
import { opportunityRepository } from "../repositories/opportunityRepository";
import { departmentRepository } from "../repositories/departmentRepository";

export class InterviewController {

    /** Cria uma nova entrevista */
    async create(req: Request, res: Response) {
        const { startDate, finishDate, delay, duration, totalScore, note, FK_candidateId, FK_userId, FK_opportunityId } = req.body

        if (!startDate || !finishDate || !duration || !totalScore || !note || !FK_candidateId || !FK_userId || !FK_opportunityId) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }

        const candidate = await candidateRepository.findOneBy({ id: Number(FK_candidateId) })
        const user = await userRepository.findOneBy({ id: Number(FK_userId) })
        const opportunity = await opportunityRepository.findOneBy({ id: Number(FK_opportunityId) })

        if (!candidate || !user || !opportunity) {
            return res.status(404).json({ message: 'Alguma chave estrangeira não existe' })
        }

        try {
            const newInterview = interviewRepository.create({ startDate, finishDate, delay, duration, totalScore, note, candidate, user, opportunity })
            await interviewRepository.save(newInterview)
            return res.status(201).json(newInterview)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }


    async listByUser(req: Request, res: Response) {
        const { idUser } = req.params
        const num = Number(idUser)
        const interviewAll = await interviewRepository
            .createQueryBuilder('interview')
            .leftJoinAndSelect('interview.user', 'user')
            .leftJoinAndSelect('interview.candidate', 'candidate')
            .leftJoinAndSelect('interview.opportunity', 'opportunity')
            .where('user.id = :id', { id: num })
            .getMany();

        const opportunityAll = await opportunityRepository
            .createQueryBuilder('opportunity')
            .leftJoinAndSelect('opportunity.user', 'user')
            .leftJoinAndSelect('opportunity.department', 'department')
            .where('user.id = :id', { id: num })
            .getMany();

        // res.json(interviewAll)
        res.json(opportunityAll)

    }


    /** Listar candidatos por email */
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

    /** Desenvolver */
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
}