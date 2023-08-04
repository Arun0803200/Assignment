import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateUserFeedTable1679448906331 implements MigrationInterface {

    private tableName = 'user_feed_table';
    private columnName = 'user_id';
    private foreignKeys = new TableForeignKey({
        name: 'fk_seat_table',
        columnNames: [this.columnName],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
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
                    name: this.columnName,
                    type: 'INT',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'feed_id',
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
        const ifTable = await queryRunner.hasTable(this.tableName);
        if (!ifTable) {
            await queryRunner.createTable(table);
        }
        const getTable = await queryRunner.getTable(this.tableName);
        const ifForeignKey = getTable.foreignKeys.find(fk => fk.columnNames.indexOf(this.columnName)!==-1);
        if (!ifForeignKey) {
            await queryRunner.createForeignKey(getTable, this.foreignKeys);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
        const getTable = await queryRunner.getTable(this.tableName);
        const ifForeignKey = getTable.foreignKeys.find(fk => fk.columnNames.indexOf(this.columnName)!==-1);
        if (!ifForeignKey) {
            await queryRunner.createForeignKey(getTable, this.foreignKeys);
        }
    }

}
