import { Request, Response } from "express";
import { skillRepository } from "../repositories/skillRepository";

export class SkillController {

    /** Cria um novo skill */
    async create(req: Request, res: Response) {
        const { name, type } = req.body

        if (!name || !type || name.trim() === '' || type.trim() === '') {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
        }

        try {
            const newSkill = skillRepository.create({ name, type })
            await skillRepository.save(newSkill)
            return res.status(201).json(newSkill)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Listar candidatos por email */
    async find(req: Request, res: Response) {

        try {
            const skill = await skillRepository.find()
            if (!skill) {
                return res.status(404).json({ message: 'Não possui nenhum departamento cadastrado' })
            }
            res.json(skill)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Desenvolver */
    async update(req: Request, res: Response) {
        const { id } = req.body

        try {
            const skill = await skillRepository.findOneBy({ id: Number(id) })
            if (!skill) {
                return res.status(404).json({ message: 'Não foi encontrado nenhum candidato' })
            }
            skillRepository.merge(skill, req.body)
            const results = await skillRepository.save(skill)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }
}