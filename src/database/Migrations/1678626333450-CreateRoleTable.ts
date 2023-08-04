import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRoleTable1690916114233 implements MigrationInterface {

    private tableName = 'role'
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
                    name: 'role_name',
                    type: 'TEXT',
                    isPrimary: false,
                    isNullable: true,
                }
            ],
        });
        const ifHasTable = await queryRunner.hasTable(this.tableName);
        if (!ifHasTable) {
            await queryRunner.createTable(table);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName)
    }

}
