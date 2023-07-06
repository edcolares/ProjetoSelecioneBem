import { Router } from "express";
import { CandidateController } from './controllers/CandidateController'
import { UserController } from "./controllers/UserController";
import { DepartmentController } from "./controllers/DepartmentController";
import { SkillController } from "./controllers/SkillController";
import { InterviewController } from "./controllers/InterviewController";
import { JobOpportunityController } from "./controllers/JobOpportunityController";
import { JobOpportunity_SkillController } from "./controllers/JobOpportunity_SkillController";
import { RatingController } from "./controllers/RatingController";
import { authMiddleware } from "./middlewares/authMiddleware";

const routes = Router();
const candidate = new CandidateController();
const user = new UserController();
const department = new DepartmentController();
const skill = new SkillController();
const interview = new InterviewController();
const jobopportunity = new JobOpportunityController();
const jobopportunity_skill = new JobOpportunity_SkillController();
const rating = new RatingController();

/* Rotas liberadas */
routes.post("/login", user.login);
routes.post('/signup', user.create);
routes.get("/profile", user.getProfile);

// Rotas abaixo estão protegidas
routes.use(authMiddleware);

/* Rotas para CANDIDATE */
routes.post('/candidate', candidate.create);
routes.get('/candidate/:email', candidate.findByEmail);
routes.get('/candidate/interview/:email', candidate.findByEmailWithInterviews);
routes.put('/candidate/:idCandidate', candidate.update);
routes.delete('/candidate/:idCandidate', candidate.delete);

/* Rotas para USER */
routes.get('/user', user.findEmail);
routes.put('/user/:idUser', user.update);
routes.delete('/user/:idUser', user.delete);

/* Rotas para DEPARTMENT */
routes.post('/department', department.create);
routes.get('/department', department.find);
routes.get('/department/statistics/:idUser', department.getDepartmentStatistics);
routes.get('/department/opportunities/statistics', department.getDepartmentWithOpportunitiesOpenCloseStatistics);
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
routes.get('/interview/total/:idJobOpportunity', interview.getTotalInterviewByJobOpportunity)
// routes.delete('/interview/:idInterview', interview.delete);

/* Rotas para JOBOPPORTUNITY */
routes.post('/jobopportunity', jobopportunity.create);
routes.get('/jobopportunity/:idJobOpportunity', jobopportunity.getJobOpportunityById);
routes.get('/jobopportunity/user/:idUser', jobopportunity.listByUser);
routes.get('/jobopportunity/report/:idJobOpportunity', jobopportunity.getInterviewsByJobOpportunity)
routes.get('/jobopportunity/find/:idUser', jobopportunity.getJobOpportunityByClosingDateOpen);
routes.get('/jobopportunity/statistics/vacancybyopportunity', jobopportunity.getVagasAbertasPorDepartamento);
routes.get('/jobopportunity/statistics/allOpportunitiesByUser/:idUser', jobopportunity.getJobOpportunitiesAllData);
routes.get('/jobopportunity/statistics/globaljobopportunities', jobopportunity.getJobOpportunitiesGlobal);
routes.put('/jobopportunity/:idJobOpportunity', jobopportunity.setJobOpportunityClosed);
routes.delete('/jobopportunity/:idJobOpportunity', jobopportunity.delete);

// Gera gráfico de oportunidades criadas por mês (Op Abertas e Op Fechadas por mês)
routes.get('/jobopportunity/statistics/getJobOpportunitiesMonthByUser/:idUser', jobopportunity.getJobOpportunitiesMonthByUser);


/* Rotas para JOBOPPORTUNITY_SKILL*/
routes.post('/jobopportunity_skill/:idJobOpportunity', jobopportunity_skill.create);
routes.delete('/jobopportunity_skill/:idJobOpportunity_Skill', jobopportunity_skill.delete);
routes.put('/jobopportunity_skill/:idJobOpportunity_Skill', jobopportunity_skill.update);
routes.get('/jobopportunity_skill/:idJobOpportunity', jobopportunity_skill.findByIdofJobOpportunitySkill);
routes.get('/jobopportunity_skill', jobopportunity_skill.getTop10);
routes.get('/jobopportunity_skill/softvsHard', jobopportunity_skill.getSoftVSHard);

/* Rotas para RATING*/
routes.post('/rating', rating.create);
routes.get('/rating/:idInterview', rating.findByInterview);
// routes.put('/rating/:idRating', rating.update);

export default routes;