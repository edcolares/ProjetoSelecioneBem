import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('department')
export class Department {
    @PrimaryGeneratedColumn()
    idDepartment: number

    @Column({ type: 'varchar', length: 80 })
    name: string

    @Column({ type: 'varchar', length: 150 })
    manager: string

    @Column({ type: 'varchar', length: 254, unique: true })
    email: string
}