import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
	@JoinTable()
	@JoinColumn({name: "FK_opportunityId"})
	opportunity: Opportunity

	@ManyToOne(() => Skill, (skill) => skill.opportunitySkills)
	@JoinTable()
	@JoinColumn({name: "FK_skillId"})
	skill: Skill
}