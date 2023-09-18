import 'dotenv/config'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { Course } from './entities/courses.entity'
import { DataSource, DataSourceOptions } from 'typeorm'
import { Tag } from './entities/tags.entity'
import { CoursesModule } from './courses.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import request from 'supertest'

describe('CoursesController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let data: any
  let courses: Course[]

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Course, Tag],
    synchronize: true,
  }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest
          },
        }),
      ],
    }).compile()
    app = module.createNestApplication()
    await app.init()

    data = {
      name: 'Node.js',
      description: 'Node.js',
      tags: ['nodejs', 'nestjs'],
    }
  })

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize()
    const repository = dataSource.getRepository(Course)
    courses = await repository.find()
    await dataSource.destroy()
  })

  afterAll(async () => {
    await module.close()
  })

  describe('POST /courses', () => {
    it('should create a course', async () => {
      const res = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201)
      expect(res.body.id).toBeDefined()
      expect(res.body.name).toEqual(data.name)
      expect(res.body.description).toEqual(data.description)
      expect(res.body.created_at).toBeDefined()
      expect(res.body.tags[0].name).toEqual(data.tags[0])
      expect(res.body.tags[1].name).toEqual(data.tags[1])
    })
  })

  describe('GET /courses', () => {
    it('should list all courses', async () => {
      const res = await request(app.getHttpServer()).get('/courses').expect(200)
      expect(res.body[0].id).toBeDefined()
      expect(res.body[0].name).toEqual(data.name)
      expect(res.body[0].description).toEqual(data.description)
      expect(res.body[0].created_at).toBeDefined()
      res.body.map(item =>
        expect(item).toEqual({
          id: item.id,
          name: item.name,
          description: item.description,
          created_at: item.created_at,
          tags: [...item.tags],
        }),
      )
    })
  })

  describe('GET /courses/:id', () => {
    it('should gets a course by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/courses/${courses[0].id}`)
        .expect(200)
      expect(res.body.id).toEqual(courses[0].id)
      expect(res.body.name).toEqual(courses[0].name)
      expect(res.body.description).toEqual(courses[0].description)
    })
  })

  describe('PUT /courses/:id', () => {
    it('should update a course', async () => {
      const updateData = {
        name: 'new name',
        description: 'new description',
        tags: ['one', 'two'],
      }

      const res = await request(app.getHttpServer())
        .put(`/courses/${courses[0].id}`)
        .send(updateData)
        .expect(200)
      expect(res.body.id).toEqual(courses[0].id)
      expect(res.body.name).toEqual('new name')
      expect(res.body.description).toEqual('new description')
      expect(res.body.tags).toHaveLength(2)
      expect(res.body.tags[0].name).toEqual('one')
      expect(res.body.tags[1].name).toEqual('two')
    })
  })

  describe('DELETE /courses/:id', () => {
    it('should delete a course', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/courses/${courses[0].id}`)
        .expect(204)
        .expect({})
    })
  })
})
