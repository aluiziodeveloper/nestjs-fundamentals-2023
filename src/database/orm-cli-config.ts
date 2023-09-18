import { DataSource } from 'typeorm'
import { dataSourceOptions } from './database.module'
import { CreateCoursesTable1694705312546 } from 'src/migrations/1694705312546-CreateCoursesTable'
import { CreateTagsTable1694706531026 } from 'src/migrations/1694706531026-CreateTagsTable'
import { CreateCoursesTagsTable1695042750118 } from 'src/migrations/1695042750118-CreateCoursesTagsTable'
import { AddCoursesIdToCoursesTagsTable1695043757120 } from 'src/migrations/1695043757120-AddCoursesIdToCoursesTagsTable'

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTable1694705312546,
    CreateTagsTable1694706531026,
    CreateCoursesTagsTable1695042750118,
    AddCoursesIdToCoursesTagsTable1695043757120,
  ],
})
