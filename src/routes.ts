import { Router } from "express";
import { CandidateController } from './controllers/CandidateController'

const routes = Router();
const candidate = new CandidateController();


routes.post('/candidate', candidate.create);
routes.get('/candidate', candidate.findEmail);


export default routes;