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
  async uploadFile(data: CreateFolderDto, file) {
    const sourceFilePath = `uploads/${file.filename}`;
    const destinationFilePath = `${data.path}/${file.filename}`;

    fs.rename(sourceFilePath, destinationFilePath, async (err) => {
      if (err) {
        throw new InternalServerErrorException('unable to move file!');
      } else {
        data['type'] = 'File';
        data['filename'] = file.filename;
        data['filesize'] = `${file.size}`;
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
    });
  }

  async createFolder(data: CreateFolderDto) {
    const fullFolderPath = `${data.path}/${data.title}`;

    new Promise((resolve, reject) => {
      fs.mkdir(fullFolderPath, { recursive: true }, (err) => {
        if (err) {
          reject(new BadRequestException('Unable to create folder'));
        } else {
          resolve({
            status: 200,
            message: 'Folder created successfully',
            data: {},
          });
        }
      });
    }).then(async () => {
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
    });
  }
}

//create folder

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
