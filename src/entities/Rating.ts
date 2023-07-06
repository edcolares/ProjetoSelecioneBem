import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "./Skill";
import { Interview } from "./Interview";

@Entity('rating')
@Index('interview_skill_UNIQUE', ['interview', 'skill'], { unique: true })
export class Rating {
    @PrimaryGeneratedColumn('increment', {
        comment: "Identificador único e sequencial, atribuído pelo banco de dados.",
        primaryKeyConstraintName: "PK_Rating_Id"
    })
    id: number

    @Column({
        type: 'int',
        comment: "Pontuação definida para a Competência no momento da entrevista."
    })
    score: number

    @CreateDateColumn({
        name: 'create_At',
        select: false,
        comment: 'Data de criação do registro'
    })
    createAt: Date

    @ManyToOne(() => Interview, (interview) => interview.ratings, { onDelete: "CASCADE" })
    @JoinColumn({
        name: "FK_interviewId",
        foreignKeyConstraintName: "FK_constraint_interviewId_ratings"
    })
    interview: Interview

    @ManyToOne(() => Skill, (skill) => skill.ratings)
    @JoinColumn({
        name: "FK_skillId",
        foreignKeyConstraintName: "FK_constraint_skillId_ratings"
    })
    skill: Skill
}