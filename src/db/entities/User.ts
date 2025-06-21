import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum RoleEnum {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum
    
    @Column({ type: 'varchar' })
    login_provider?: string

    @Column({ type: 'date', default: new Date() })
    created_at?: Date;

    @Column({ type: 'date' })
    updated_at?: Date;

    @Column({ type: 'date' })
    last_login?: Date
}
