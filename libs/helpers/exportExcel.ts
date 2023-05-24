import { BadRequestException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';

export const exportToExcel = async (data = []) => {
  let row = [];
  data.forEach((e) => {
    row.push(Object.values(e));
  });
  let book = new Workbook();
  let sheet = book.addWorksheet('sheet1');
  row.unshift(Object.keys(data[0]));
  sheet.addRows(row);
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    bgColor: { argb: 'dddddd' },
    fgColor: { argb: 'dddddd' },
  };
  sheet.getRow(1).border = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  };

  let File = await new Promise((resolve, reject) => {
    tmp.file(
      {
        discardDescriptor: true,
        prefix: `MyExcelSheet`,
        postfix: '.xlsx',
        mode: parseInt('0600', 8),
      },
      async (err, file) => {
        if (err) throw new BadRequestException(err);

        book.xlsx
          .writeFile(file)
          .then((_) => {
            resolve(file);
          })
          .catch((err) => {
            throw new BadRequestException(err);
          });
      },
    );
  });
  return File;
};
