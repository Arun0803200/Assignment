import { table } from "console";
import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateLogTable1679451149576 implements MigrationInterface {
    private tableName = 'log_tbl'
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: this.tableName,
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
                    type: 'Varchar',
                    length: '225',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'role',
                    type: 'Varchar',
                    length: '225',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'action',
                    type: 'Varchar',
                    length: '225',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'action_by',
                    type: 'Varchar',
                    length: '225',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'action_by_role',
                    type: 'Varchar',
                    length: '225',
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
                    type: 'TIMESTAMP',
                    default: 'CURRENT_TIMESTAMP',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'modified_date',
                    type: 'TIMESTAMP',
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
            ],
        });
        const ifTable = await queryRunner.hasTable(this.tableName);
        if (!ifTable) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName, true);
    }
}
