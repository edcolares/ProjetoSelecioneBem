import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Rating } from "./Rating";
import { User } from "./User";
import { JobOpportunity } from "./JobOpportunity";

@Entity('interview')
@Index('jobopportunity_candidate_UNIQUE', ['jobopportunity', 'candidate'], { unique: true })
export class Interview {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'timestamp without time zone' })
    startDate: Date

    @Column({ type: 'timestamp without time zone' })
    finishDate: Date

    @Column({ type: 'boolean' })
    isDelayed: boolean

    @Column({ type: 'time' })
    duration: Timestamp

    @Column({ type: 'int', default: 0 })
    totalScore: number

    @Column({ type: 'varchar', length: 1024, nullable: true })
    note: string

    @CreateDateColumn({ name: 'create_At', select: false })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At', select: false })
    updateAt: Date

    @ManyToOne(() => Candidate, candidate => candidate.interviews/*, { eager: true }*/)
    @JoinTable()
    @JoinColumn({ name: 'FK_candidateId' })
    candidate: Candidate

    @OneToMany(() => Rating, rating => rating.interview/*, { eager: true }*/)
    ratings: Rating[]

    @ManyToOne(() => User, user => user.interviews)
    @JoinTable()
    @JoinColumn({ name: 'FK_userId' })
    user: User

    @ManyToOne(() => JobOpportunity, jobopportunity => jobopportunity.interviews)
    @JoinTable()
    @JoinColumn({ name: 'FK_jobopportunityId' })
    jobopportunity: JobOpportunity
}