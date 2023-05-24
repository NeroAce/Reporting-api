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
import { ParentService } from '../services/parent.service';
import { Response, query } from 'express';
import { JwtGuard } from 'libs';
import { Roles } from 'libs';
import { RolesGuard, UserRepository } from 'libs';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: UserRepository) {}

  @Get()
  // @Roles('ADMIN', 'PARENT')
  // @UseGuards(JwtGuard) //, RolesGuard) //RolesGuard
  async getAllUserByQuery(@Query() query, @Res() res: Response) {
    const data = await this.parentService.getAllUserByQuery(query);
    if (query.downloadxl === 'Y') {
      return res.set({ 'Content-Type': 'text/xlsx' }).download(`${data}`);
    } else {
      return res.status(HttpStatus.OK).send(data);
    }
  }

  @Get('/nameEmail')
  //@UseGuards(JwtGuard)
  nameEmail() {
    return this.parentService.getAllNameAndEmail('PARENT');
  }

  @Get('getOne/:id')
  getByID(@Param() id) {
    return this.parentService.getUserById(id.id);
  }

  @Get('/delete/:id')
  delete(@Param() id) {
    return this.parentService.deleteUserById(id.id);
  }
  @Put()
  update(@Body() data) {
    return this.parentService.updateUserById(data);
  }

  @Get('orgainisation')
  async getPromo() {
    return await this.parentService.getAllOrganisationList();
  }

  // @Get('pacakes')
  // async getPackages() {
  //   return await this.parentService.getPackageList();
  // }
}
