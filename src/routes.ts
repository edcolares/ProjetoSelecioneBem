import { Router } from "express";
import { CandidateController } from './controllers/CandidateController'
import { UserController } from "./controllers/UserController";
import { DepartmentController } from "./controllers/DepartmentController";
import { SkillController } from "./controllers/SkillController";
import { InterviewController } from "./controllers/InterviewController";
import { JobOpportunityController } from "./controllers/JobOpportunityController";

const routes = Router();
const candidate = new CandidateController();
const user = new UserController();
const department = new DepartmentController();
const skill = new SkillController();
const interview = new InterviewController();
const jobopportunity = new JobOpportunityController();


/* Rotas para CANDIDATE */
routes.post('/candidate', candidate.create);
routes.get('/candidate', candidate.findEmail);
routes.put('/candidate', candidate.update);
routes.delete('/candidate/:idCandidate', candidate.delete);

/* Rotas para USER */
routes.post('/user', user.create);
routes.get('/user', user.findEmail);
routes.put('/user', user.update);
routes.delete('/user/:idUser', user.delete);

/* Rotas para DEPARTMENT */
routes.post('/department', department.create);
routes.get('/department', department.find);
routes.put('/department', department.update);
routes.delete('department/:idDepartment', department.delete);

/* Rotas para SKILL */
routes.post('/skill', skill.create);
routes.get('/skill', skill.find);
routes.put('/skill', skill.update);
routes.delete('/skill/:idSkill', skill.delete)

/* Rotas para INTERVIEW */
routes.post('/interview', interview.create);
routes.get('/interview/:idUser', interview.listByUser);
routes.get('/interview', interview.find);
routes.get('/interview/:initialDate/:finalDate', interview.getInterviewsBetweenDates);
routes.delete('/interview/:idInterview', interview.delete);

/* Rotas para OPPORTUNITY */
routes.post('/jobopportunity', jobopportunity.create);
routes.get('/jobopportunity/:idUser', jobopportunity.listByUser);
routes.get('/jobopportunity', jobopportunity.find);
routes.delete('/jobopportunity/:idJobOpportunity', jobopportunity.delete);

export default routes;