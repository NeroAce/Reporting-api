import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { PathDto } from '../models/path.dto';
import { CreateFolderDto } from 'libs';
import { FileFolderRepository } from 'libs/repositories/file-folder.repository';

@Injectable()
export class DocumentsService {
  constructor(private filesystem: FileFolderRepository) {}

  async getListOfFiles(folderPath: string) {
    const data = await this.filesystem.getAllFilesAndFolder(folderPath);
    return {
      status: 200,
      message: '',
      data: data,
    };
  }
  async uploadFile(data: CreateFolderDto) {}

  async createFolder(
    data: CreateFolderDto,
  ): Promise<{ status: number; message: string; data: any }> {
    data['type'] = 'Folder';

    const created = await this.filesystem.createFolder(data);

    if (created) {
      return {
        status: 200,
        message: 'Folder created successfully',
        data: created,
      };
    } else {
      throw new InternalServerErrorException('unable to create folder');
    }
  }
}

//create folder
// const fullFolderPath = `${folderPath}/${folderName}`;

// return new Promise((resolve, reject) => {
//   fs.mkdir(fullFolderPath, { recursive: true }, (err) => {
//     if (err) {
//       reject(new BadRequestException('Unable to create folder'));
//     } else {
//       resolve({
//         status: 200,
//         message: 'Folder created successfully',
//         data: {},
//       });
//     }
//   });
// });

//getfilefolder
// try {
//   const items = fs.readdirSync(folderPath);
//   const data = {
//     file: [],
//     folders: [],
//   };

//   items.forEach((item) => {
//     const itemPath = `${folderPath}/${item}`;
//     const stats = fs.statSync(itemPath);

//     if (stats.isFile()) {
//       data.file.push(item);
//     } else if (stats.isDirectory()) {
//       data.folders.push(item);
//     }
//   });

//   return {
//     status: 200,
//     message: 'Folder created successfully',
//     data: data,
//   };
// } catch (err) {
//   throw new BadRequestException(err);
// }
