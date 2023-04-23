import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { opportunityRepository } from "../repositories/opportunityRepository";
import { departmentRepository } from "../repositories/departmentRepository";

export class OpportunityController {

    /** Cria uma nova entrevista */
    async create(req: Request, res: Response) {
        const { title, level, openingDate, expectedDate, FK_departmentId, FK_userId } = req.body

        if (!title || !level || !openingDate || !expectedDate || !FK_departmentId || !FK_userId ) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }

        const department = await departmentRepository.findOneBy({ id: Number(FK_departmentId) })
        const user = await userRepository.findOneBy({ id: Number(FK_userId) })

        if (!department || !user ) {
            return res.status(404).json({ message: 'Alguma chave estrangeira não existe' })
        }

        try {
            const newOpportunity = opportunityRepository.create({ title, level, openingDate, expectedDate, department, user })
            await opportunityRepository.save(newOpportunity)
            return res.status(201).json(newOpportunity)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    
    async listByUser(req: Request, res: Response) {
        const { idUser } = req.params
        const num = Number(idUser)

        const opportunityAll = await opportunityRepository
            .createQueryBuilder('opportunity')
            .leftJoinAndSelect('opportunity.user', 'user')
            .leftJoinAndSelect('opportunity.department', 'department')
            .where('user.id = :id', { id: num })
            .getMany();

        res.json(opportunityAll)

    }


    /** Listar candidatos por email */
    async find(req: Request, res: Response) {

        try {
            const opportunity = await opportunityRepository.find()
            if (!opportunity) {
                return res.status(404).json({ message: 'Não existe oportunidades cadastradas' })
            }
            res.json(opportunity)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

        /** To do: delete modelo: user* OK/
        /** To do: update */
        /** To do: listarPorDatas */
        /** To do: listarPorDepartamentos */
        /** To do: listarPorDatas */
        /** To do: listarOportunidadesAbertas(sem data de encerramento) */

    /** Desenvolver */
    async update(req: Request, res: Response) {
        const { id } = req.body

        try {
            const opportunity = await opportunityRepository.findOneBy({ id: Number(id) })
            if (!opportunity) {
                return res.status(404).json({ message: 'Não existe oportunidades cadastradas' })
            }
            opportunityRepository.merge(opportunity, req.body)
            const results = await opportunityRepository.save(opportunity)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

 /******************************* DELETAR *******************************/
 async delete(req: Request, res: Response) {
    const { idOpportunity } = req.params

    try {
        const opportunity = await opportunityRepository.findOneBy({
            id: Number(idOpportunity),
        })

        if (!opportunity) {
            return res.status(404).json({ message: 'Oportunidade não foi encontrada.' })
        }

        const results = await opportunityRepository.remove(opportunity)
        return res.send(results)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Sever Error' })
    }
}


}