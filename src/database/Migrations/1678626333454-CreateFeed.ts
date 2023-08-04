import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateFeed1678626333454 implements MigrationInterface {
    private tableName = 'feed';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: this.tableName,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '225',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'url',
                    type: 'VARCHAR',
                    length: '225',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '225',
                    isPrimary: false,
                    isNullable: false,
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
        const ifHasTable = await queryRunner.hasTable(this.tableName);
        if (!ifHasTable) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName, true)
    }

}
