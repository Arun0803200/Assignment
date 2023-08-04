import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateLogList1691072031528 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'log_list_file',
            columns: [
                {
                    name: 'id',
                    type: 'INTEGER',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'file_name',
                    type: 'VARCHAR',
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
                    name: 'modified_by',
                    type: 'int',
                    length: '11',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'modified_date',
                    type: 'TIMESTAMP',
                    default: 'CURRENT_TIMESTAMP',
                    isPrimary: false,
                    isNullable: true,
                }
            ]
        });
        const ifTable = await queryRunner.hasTable('log_list_file');
        if (!ifTable) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('log_list_file', true);
    }

}
