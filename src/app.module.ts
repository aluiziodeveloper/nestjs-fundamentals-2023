import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoursesModule } from './courses/courses.module'
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [CoursesModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
