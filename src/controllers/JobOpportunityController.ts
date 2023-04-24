import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { jobopportunityRepository } from "../repositories/jobopportunityRepository";
import { departmentRepository } from "../repositories/departmentRepository";
import { interviewRepository } from "../repositories/interviewRepository";

export class JobOpportunityController {

    /** Cria uma nova entrevista */
    async create(req: Request, res: Response) {
        const { title, level, openingDate, expectedDate, FK_departmentId, FK_userId } = req.body

        if (!title || !level || !openingDate || !expectedDate || !FK_departmentId || !FK_userId) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }

        const department = await departmentRepository.findOneBy({ id: Number(FK_departmentId) })
        const user = await userRepository.findOneBy({ id: Number(FK_userId) })

        if (!department || !user) {
            return res.status(404).json({ message: 'Alguma chave estrangeira não existe' })
        }

        if (user.isActive == false) {
            return res.status(404).json({ message: 'O usuário está inativo, a transação foi cancelada' })
        }

        try {
            const newJobOpportunity = jobopportunityRepository.create({ title, level, openingDate, expectedDate, department, user })
            await jobopportunityRepository.save(newJobOpportunity)
            return res.status(201).json(newJobOpportunity)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }


    async listByUser(req: Request, res: Response) {
        const { idUser } = req.params
        const num = Number(idUser)

        const jobopportunityAll = await jobopportunityRepository
            .createQueryBuilder('jobopportunity')
            .leftJoinAndSelect('jobopportunity.user', 'user')
            .leftJoinAndSelect('jobopportunity.department', 'department')
            .where('user.id = :id', { id: num })
            .getMany();

        res.json(jobopportunityAll)

    }

    /** Buscar todas INTERVIEWS de uma determinada JOBOPPORTUNITY
     *  Parametros:     idJobOpportunity = Identifica o Id da JOBOPPORTUNITY
     */
    async getInterviewsByJobOpportunity(req: Request, res: Response) {
        const { idJobOpportunity } = req.params
        try {
            const interviews = await interviewRepository
                .createQueryBuilder('interview')
                .leftJoinAndSelect('interview.jobopportunity', 'jobopportunity')
                .leftJoinAndSelect('interview.candidate', 'candidate')
                .where('jobopportunity.id = :id', { id: idJobOpportunity })
                .getMany();

            res.json(interviews)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }

    }

    /** Listar candidatos por email */
    async find(req: Request, res: Response) {

        try {
            const jobopportunity = await jobopportunityRepository.find()
            if (!jobopportunity) {
                return res.status(404).json({ message: 'Não existe oportunidades cadastradas' })
            }
            res.json(jobopportunity)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }


    /** Desenvolver */
    async update(req: Request, res: Response) {
        const { id } = req.body

        try {
            const jobopportunity = await jobopportunityRepository.findOneBy({ id: Number(id) })
            if (!jobopportunity) {
                return res.status(404).json({ message: 'Não existe oportunidades cadastradas' })
            }
            jobopportunityRepository.merge(jobopportunity, req.body)
            const results = await jobopportunityRepository.save(jobopportunity)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /******************************* DELETAR *******************************/
    async delete(req: Request, res: Response) {
        const { idJobOpportunity } = req.params

        try {
            const jobopportunity = await jobopportunityRepository.findOneBy({
                id: Number(idJobOpportunity),
            })

            if (!jobopportunity) {
                return res.status(404).json({ message: 'Oportunidade não foi encontrada.' })
            }

            const results = await jobopportunityRepository.remove(jobopportunity)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }

}