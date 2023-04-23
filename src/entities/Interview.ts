import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Rating } from "./Rating";
import { User } from "./User";
import { JobOpportunity } from "./JobOpportunity";

@Entity('interview')
export class Interview {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'timestamp without time zone' })
    startDate: Date

    @Column({ type: 'timestamp without time zone' })
    finishDate: Date

    @Column({ type: 'boolean' })
    delay: boolean

    @Column({ type: 'time' })
    duration: Timestamp

    @Column({ type: 'int' })
    totalScore: number

    @Column({ type: 'varchar', length: 1024, nullable: true })
    note: string

    @CreateDateColumn({ name: 'create_At' })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At' })
    updateAt: Date

    @ManyToOne(() => Candidate, candidate => candidate.interviews)
    @JoinTable()
    @JoinColumn({ name: 'FK_candidateId' })
    candidate: Candidate

    @OneToMany(() => Rating, rating => rating.interview)
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