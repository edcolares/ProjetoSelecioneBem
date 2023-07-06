import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Rating } from "./Rating";
import { User } from "./User";
import { JobOpportunity } from "./JobOpportunity";

@Entity('interview')
@Index('jobopportunity_candidate_UNIQUE', ['jobopportunity', 'candidate'], { unique: true })
export class Interview {
    @PrimaryGeneratedColumn('increment', {
        comment: "Identificador único e sequencial, atribuído pelo banco de dados.",
        primaryKeyConstraintName: "PK_Interview_Id"
    })
    id: number;

    @Column({
        type: 'timestamp without time zone',
        comment: "Data e hora de início da entrevista."
    })
    startDate: Date;

    @Column({
        type: 'timestamp without time zone',
        comment: "Data e hora de término da entrevista."
    })
    finishDate: Date;

    @Column({
        type: 'boolean',
        comment: "Indicador se o candidato chegou em atraso."
    })
    isDelayed: boolean;

    @Column({
        type: 'time',
        comment: "Duração total da entrevista."
    })
    duration: Timestamp;

    @Column({
        type: 'int',
        default: 0,
        comment: "Pontuação total da entrevista, originária da soma através de média ponderada entre a pontuação na entrevista e o peso da competência."
    })
    totalScore: number;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: true,
        comment: "Reservado para que o entrevistador insira observações adicionais sobre a entrevista."
    })
    note: string;

    @CreateDateColumn({
        name: 'create_At',
        select: false,
        comment: "Data de criação do registro."
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'update_At',
        select: false,
        comment: "Data de atualização do registro."
    })
    updateAt: Date;

    @ManyToOne(() => Candidate, candidate => candidate.interviews)
    @JoinTable()
    @JoinColumn({
        name: 'FK_candidateId',
        foreignKeyConstraintName: "FK_constraint_candidateId_interviews"
    })
    candidate: Candidate

    @ManyToOne(() => User, user => user.interviews)
    @JoinTable()
    @JoinColumn({
        name: 'FK_userId',
        foreignKeyConstraintName: "FK_constraint_userId_interviews"
    })
    user: User

    @ManyToOne(() => JobOpportunity, jobopportunity => jobopportunity.interviews)
    @JoinTable()
    @JoinColumn({
        name: 'FK_jobopportunityId',
        foreignKeyConstraintName: "FK_constraint_jobOpportunityId_interviews"
    })
    jobopportunity: JobOpportunity

    @OneToMany(() => Rating, rating => rating.interview)
    ratings: Rating[]
    
}