import { Router } from "express";
import { CandidateController } from './controllers/CandidateController'
import { UserController } from "./controllers/UserController";

const routes = Router();
const candidate = new CandidateController();
const user = new UserController();

/* Rotas para CANDIDATE */
routes.post('/candidate', candidate.create);
routes.get('/candidate', candidate.findEmail);
routes.put('/candidate', candidate.update);

/* Rotas para USER */
routes.post('/user', user.create);
routes.get('/user', user.findEmail);
routes.put('/user', user.update);


export default routes;