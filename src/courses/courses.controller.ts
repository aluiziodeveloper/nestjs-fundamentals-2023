import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common'
import { CoursesService } from './courses.service'

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Get()
  findAll(@Res() response) {
    return response.status(200).json({ message: 'Listagem de cursos' })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Curso com ID ${id}`
  }

  @Post()
  create(@Body() body) {
    return body
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    console.log(body)
    return `Update course with ID ${id}`
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Delete course with ID ${id}`
  }
}
