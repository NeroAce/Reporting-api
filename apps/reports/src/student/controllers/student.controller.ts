import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, query } from 'express';
import { JwtGuard, UserRepository } from 'libs';
import { Roles } from 'libs';
import { RolesGuard } from 'libs';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: UserRepository) {}

  @Get('/all')
  //@Roles('ADMIN', 'PARENT')
  //@UseGuards(JwtGuard) //, RolesGuard) //RolesGuard
  async getAllUserByQuery(@Query() query, @Res() res: Response) {
    const data = await this.studentService.getAllUserByQuery(query);
    if (query.downloadxl === 'Y') {
      return res.set({ 'Content-Type': 'text/xlsx' }).download(`${data}`);
    } else {
      return res.status(HttpStatus.OK).send(data);
    }
  }

  @Get('/nameEmail')
  //@UseGuards(JwtGuard)
  nameEmail() {
    return this.studentService.getAllNameAndEmail('STUDENT');
  }

  @Get('getOne/:id')
  getByID(@Param() id) {
    console.log('hit');
    return this.studentService.getUserById(id.id);
  }

  @Get('/delete/:id')
  delete(@Param() id) {
    return this.studentService.deleteUserById(id.id);
  }
  @Put()
  update(@Body() data) {
    return this.studentService.updateUserById(data);
  }

  @Get('orgainisation')
  async getPromo() {
    return await this.studentService.getAllOrganisationList();
  }
  // @Get('pacakes')
  // async getPackages() {
  //   return await this.studentService.getPackageList();
  // }

  // @Get('city')
  // async getCity() {
  //   return await this.studentService.getCityList();
  // }
}
