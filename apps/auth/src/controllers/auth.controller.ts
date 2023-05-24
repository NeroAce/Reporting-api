import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../models/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
   }

  
  // @Post('register')
  // register(@Body() user: User): Observable<User> {
  //   return this.authService.registerAccount(user);
  // }

}
