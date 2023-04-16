import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('opportunity_skill')
export class Opportunity_Skill {
	@PrimaryGeneratedColumn()
	idOpportunity_Skill: number

	@Column({ type: 'int', comment: "" })
	weightingFactor: number	
}