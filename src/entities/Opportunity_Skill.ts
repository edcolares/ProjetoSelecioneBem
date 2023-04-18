import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Opportunity } from "./Opportunity";
import { Skill } from "./Skill";

@Entity('opportunity_skill')
export class Opportunity_Skill {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column({ type: 'int', comment: "" })
	weightingFactor: number

	@CreateDateColumn({ name: 'create_At' })
    createAt: Date

	@ManyToOne(() => Opportunity, (opportunity) => opportunity.opportunitySkills, { onDelete: "CASCADE" })
	opportunity: Opportunity

	@ManyToOne(() => Skill, (skill) => skill.opportunitySkills)
	skill: Skill
}