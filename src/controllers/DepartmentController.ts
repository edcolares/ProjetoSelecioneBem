import { Request, Response } from "express";
import { departmentRepository } from "../repositories/departmentRepository";

export class DepartmentController {

    /** Cria um novo DEPARTMENT */
    async create(req: Request, res: Response) {
        const { name, manager, email } = req.body

        if (!name || !email || !manager || name.trim() === '' || email.trim() === '' || manager.trim() === '') {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
        }

        try {
            const newDepartment = departmentRepository.create({ name, manager, email })
            await departmentRepository.save(newDepartment)
            return res.status(201).json(newDepartment)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /** Listar candidatos por email */
    async find(req: Request, res: Response) {

        try {
            const department = await departmentRepository.find()
            if (!department) {
                return res.status(404).json({ message: 'Não possui nenhum departamento cadastrado' })
            }
            res.json(department)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Desenvolver */
    async update(req: Request, res: Response) {
        const { id } = req.body
        
        try {
            const department = await departmentRepository.findOneBy({ id: Number(id) })
            if (!department) {
                return res.status(404).json({ message: 'Não foi encontrado nenhum candidato' })
            }
            departmentRepository.merge(department, req.body)
            const results = await departmentRepository.save(department)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }
}