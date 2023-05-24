// import {
//     Controller,
//     Post,
//     UploadedFile,
//     UseGuards,
//     UseInterceptors,
//     Request,
//     Get,
//     Res,
//     Param,
//     Put,
//     Body,
//   } from '@nestjs/common';
//   import { FileInterceptor } from '@nestjs/platform-express';
//   import { join } from 'path';
//   import { Observable, of } from 'rxjs';
//   import { map, switchMap } from 'rxjs/operators';
//   import { UpdateResult } from 'typeorm';
//   import { JwtGuard } from '../guards/jwt.guard';
//   import {
//     isFileExtensionSafe,
//     saveImageToStorage,
//     removeFile,
//   } from '../helpers/image-storage';
//   import {
//     FriendRequest,
//     FriendRequestStatus,
//   } from '../models/friend-request.interface';
//   import { User } from '../models/user.class';
//   import { UserService } from '../services/user.service';
  
//   @Controller('user')
//   export class UserController {
//     constructor(private userService: UserService) {}
  
//     @UseGuards(JwtGuard)
//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file', saveImageToStorage))
//     uploadImage(
//       @UploadedFile() file: Express.Multer.File,
//       @Request() req,
//     ): Observable<{ modifiedFileName: string } | { error: string }> {
//       const fileName = file?.filename;
  
//       if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });
  
//       const imagesFolderPath = join(process.cwd(), 'images');
//       const fullImagePath = join(imagesFolderPath + '/' + file.filename);
  
//       return isFileExtensionSafe(fullImagePath).pipe(
//         switchMap((isFileLegit: boolean) => {
//           if (isFileLegit) {
//             const userId = req.user.id;
//             return this.userService.updateUserImageById(userId, fileName).pipe(
//               map(() => ({
//                 modifiedFileName: file.filename,
//               })),
//             );
//           }
//           removeFile(fullImagePath);
//           return of({ error: 'File content does not match extension!' });
//         }),
//       );
//     }
  
//     @UseGuards(JwtGuard)
//     @Get('image')
//     findImage(@Request() req, @Res() res): Observable<Object> {
//       const userId = req.user.id;
//       return this.userService.findImageNameByUserId(userId).pipe(
//         switchMap((imageName: string) => {
//           return of(res.sendFile(imageName, { root: './images' }));
//         }),
//       );
//     }
  
  
//     @UseGuards(JwtGuard)
//     @Get(':userId')
//     findUserById(@Param('userId') userStringId: string): Observable<User> {
//       const userId = parseInt(userStringId);
//       return this.userService.findUserById(userId);
//     }
  
//   }
  