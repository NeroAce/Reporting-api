import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from '../services/documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { File } from 'multer'; // Import multer.File type from the multer package
import { PathDto } from '../models/path.dto';
import { CreateFolderDto, RequestInterceptor } from 'libs';

@UseInterceptors(RequestInterceptor)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getFiles(@Query() query: PathDto) {
    return await this.documentsService.getListOfFiles(query.path);
  }

  @Post('/createfolder')
  async createFolder(@Body() body: CreateFolderDto) {
    return await this.documentsService.createFolder(body);
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('document', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file format'), false);
        }
      },
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: File, @Body() body: CreateFolderDto) {
    console.log(file);
    return await this.documentsService.uploadFile(body, file);
  }
}
