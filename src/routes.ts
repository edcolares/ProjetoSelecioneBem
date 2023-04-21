import { Router } from "express";
import { CandidateController } from './controllers/CandidateController'
import { UserController } from "./controllers/UserController";
import { DepartmentController } from "./controllers/DepartmentController";
import { SkillController } from "./controllers/SkillController";
import { InterviewController } from "./controllers/InterviewController";
import { OpportunityController } from "./controllers/OpportunityController";

const routes = Router();
const candidate = new CandidateController();
const user = new UserController();
const department = new DepartmentController();
const skill = new SkillController();
const interview = new InterviewController();
const opportunity = new OpportunityController();


/* Rotas para CANDIDATE */
routes.post('/candidate', candidate.create);
routes.get('/candidate', candidate.findEmail);
routes.put('/candidate', candidate.update);

/* Rotas para USER */
routes.post('/user', user.create);
routes.get('/user', user.findEmail);
routes.put('/user', user.update);
routes.delete('/user/:idUser', user.delete);

/* Rotas para DEPARTMENT */
routes.post('/department', department.create);
routes.get('/department', department.find);
routes.put('/department', department.update);

/* Rotas para SKILL */
routes.post('/skill', skill.create);
routes.get('/skill', skill.find);
routes.put('/skill', skill.update);

/* Rotas para INTERVIEW */
routes.post('/interview', interview.create);
routes.get('/interview/:idUser', interview.listByUser);

/* Rotas para OPPORTUNITY */
routes.post('/opportunity', opportunity.create);
routes.get('/opportunity/:idUser', opportunity.listByUser);



export default routes;