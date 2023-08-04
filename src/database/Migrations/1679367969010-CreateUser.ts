import { MigrationInterface, QueryRunner, Table, Tree } from "typeorm"

const tableName = 'user';
export class CreateUser1679367969010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: tableName,
            columns: [
                {
                    name: 'id',
                    type: 'INT',
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: 'VARCHAR',
                    length: '225',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'role',
                    type: 'INTEGER',
                    length: '11',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'email',
                    type: 'VARCHAR',
                    length: '225',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'VARCHAR',
                    length: '225',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'delete_flag',
                    type: 'INT',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'created_by',
                    type: 'int',
                    length: '11',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'created_date',
                    type: 'date',
                    default: 'CURRENT_TIMESTAMP',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'modified_by',
                    type: 'int',
                    length: '11',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'modified_date',
                    type: 'date',
                    default: 'CURRENT_TIMESTAMP',
                    isPrimary: false,
                    isNullable: true,
                }
            ]
        });
        const ifTable = await queryRunner.hasTable(tableName);
        if (!ifTable) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName, true);
    }

}
