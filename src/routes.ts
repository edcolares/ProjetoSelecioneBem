import { Router } from "express";
import { CandidateController } from './controllers/CandidateController'
import { UserController } from "./controllers/UserController";
import { DepartmentController } from "./controllers/DepartmentController";
import { SkillController } from "./controllers/SkillController";
import { InterviewController } from "./controllers/InterviewController";
import { JobOpportunityController } from "./controllers/JobOpportunityController";
import { JobOpportunity_SkillController } from "./controllers/JobOpportunity_SkillController";
import { RatingController } from "./controllers/RatingController";

const routes = Router();
const candidate = new CandidateController();
const user = new UserController();
const department = new DepartmentController();
const skill = new SkillController();
const interview = new InterviewController();
const jobopportunity = new JobOpportunityController();
const jobopportunity_skill = new JobOpportunity_SkillController();
const rating = new RatingController();


/* Rotas para CANDIDATE */
routes.post('/candidate', candidate.create);
routes.get('/candidate', candidate.findByEmail);
routes.get('/candidate/:email', candidate.findByEmailWithInterviews);
routes.put('/candidate/:idCandidate', candidate.update);
routes.delete('/candidate/:idCandidate', candidate.delete);

/* Rotas para USER */
routes.post('/user', user.create);
routes.get('/user', user.findEmail);
routes.put('/user/:idUser', user.update);
routes.delete('/user/:idUser', user.delete);

/* Rotas para DEPARTMENT */
routes.post('/department', department.create);
routes.get('/department', department.find);
routes.put('/department/:idDepartment', department.update);
routes.delete('department/:idDepartment', department.delete);

/* Rotas para SKILL */
routes.post('/skill', skill.create);
routes.get('/skill', skill.find);
routes.put('/skill/:idSkill', skill.update);
routes.delete('/skill/:idSkill', skill.delete)

/* Rotas para INTERVIEW */
routes.post('/interview', interview.create);
routes.get('/interview/:idUser', interview.listByUser);
routes.get('/interview', interview.find);
routes.get('/interview/:idUser', interview.getInterviewsBetweenDates);
// routes.delete('/interview/:idInterview', interview.delete);

/* Rotas para JOBOPPORTUNITY */
routes.post('/jobopportunity', jobopportunity.create);
routes.get('/jobopportunity/:idUser', jobopportunity.listByUser);
routes.get('/jobopportunities/:idJobOpportunity', jobopportunity.getInterviewsByJobOpportunity)
routes.get('/jobopportunity', jobopportunity.find);
routes.put('/jobopportunity/:idJobOpportunity', jobopportunity.update);
routes.delete('/jobopportunity/:idJobOpportunity', jobopportunity.delete);


/* Rotas para JOBOPPORTUNITY_SKILL*/
routes.post('/jobopportunity_skill/:idJobOpportunity', jobopportunity_skill.create);
routes.delete('/jobopportunity_skill/:idJobOpportunity_Skill', jobopportunity_skill.delete);
routes.put('/jobopportunity_skill/:idJobOpportunity_Skill', jobopportunity_skill.update);

/* Rotas para RATING*/
routes.post('/rating', rating.create);
routes.get('/rating/:idInterview', rating.findByInterview);
// routes.put('/rating/:idRating', rating.update);

export default routes;