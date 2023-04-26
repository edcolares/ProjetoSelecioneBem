import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";

export class UserController {

    /**
     * A função cria um novo usuário com as informações fornecidas no corpo da requisição. 
     * Ela verifica se todos os campos obrigatórios foram preenchidos corretamente e retorna 
     * uma mensagem de erro caso contrário. Em caso de sucesso, retorna o novo usuário criado 
     * com um status de resposta 201.
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body

        if (!name || !email || !password || name.trim() === '' || email.trim() === '' || password.trim() === '') {
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios corretamente.' })
        }

        const existUser = await userRepository.findOneBy({
            email: email,
        })

        if (existUser) {
            return res.status(200).json({ message: 'Este e-mail já está cadastrado em nossa base de dados.' })
        }

        try {
            const newUser = userRepository.create({ name, email, password })
            await userRepository.save(newUser)
            return res.status(201).json(newUser)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /**
     * Recebe uma requisição HTTP que contém um email, busca no banco de dados um usuário com
     * esse email e retorna os dados do usuário encontrado em formato JSON. Se o usuário não 
     * for encontrado, a função retorna uma mensagem de erro.
     * @param req Request
     * @param res response
     * @returns JSON
     */
    async findEmail(req: Request, res: Response) {
        const { email } = req.body

        try {
            const user = await userRepository.findOneBy({ email: email })
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            return res.status(200).json(user)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Essa função atualiza informações de um usuário no banco de dados e retorna o resultado. 
     * Em caso de erro, retorna uma mensagem de erro genérica.
     * @param req request
     * @param res response
     * @returns JSON
     */
    async update(req: Request, res: Response) {
        const { idUser } = req.params
        const { name, email } = req.body

        try {
            const user = await userRepository.findOneBy({ id: Number(idUser) })
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }

            userRepository.merge(user, req.body)
            const results = await userRepository.save(user)
            return res.status(200).json(results)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /**
     * Essa função exclui um usuário do banco de dados da aplicação. Ela verifica se o usuário 
     * existe e, em seguida, marca o registro como inativo ao invés de excluí-lo definitivamente. 
     * A função retorna um código de status 200 com uma mensagem indicando que a exclusão foi 
     * realizada com sucesso.
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async delete(req: Request, res: Response) {
        const { idUser } = req.params

        try {
            const user = await userRepository.findOneBy({
                id: Number(idUser),
            })

            if (!user) {
                return res.status(404).json({ message: 'Usuário não foi encontrado.' })
            }

            user.isActive = false;
            user.removeAt = new Date();
            await userRepository.save(user);
            return res.status(200).json({ message: 'Exclusão realizada com sucesso' })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }

}