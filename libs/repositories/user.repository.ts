import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  ResponseInterface,
  exportToExcel,
  listQueryHandler,
  listQueryHandlerNested,
} from 'libs';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  //helper Function
  async pushValue(list, value, contains) {
    list.push({
      [value]: {
        contains: contains,
        mode: 'insensitive',
      },
    });
  }

  //////////////////////////////////////////GET ALL BY QUERY FILTER//////////////////////////////////////
  async getAllUserByQuery(query) {
    const value = new ResponseInterface(query);

    const search = query.search || '';

    console.log(query);
    let where = {};
    var totalNoOfItem: number;

    //filter by countryCode
    if (query.countryCode && query.countryCode.length > 0) {
      const passQuery = query.countryCode;
      const filter = listQueryHandler(passQuery, 'countrycode');
      where = { ...where, ...filter };
    }

    //filter by promo
    if (query.promo && query.promo.length > 0) {
      const passQuery = query.promo;
      const filter = listQueryHandler(passQuery, 'verificationcode');
      where = { ...where, ...filter };
    }

    //filter by platform
    // if (query.platform && query.platform.length > 0) {
    //   const passQuery = query.platform;
    //   const filter = listQueryHandler(passQuery, 'platform');
    //   where = { ...where, ...filter };
    // }

    //filter by campaign
    // if (query.campaign && query.campaign.length > 0) {
    //   const passQuery = query.campaign;
    //   const filter = listQueryHandler(passQuery, 'referalsource');
    //   where = { ...where, ...filter };
    // }

    //filter by subscription
    // if (query.subscription && query.subscription.length > 0) {
    //   let filter;
    //   if (Array.isArray(query.subscription)) {
    //     const value = [];
    //     for (var i of query.subscription) {
    //       if (i === 'Monthly') {
    //         value.push('M');
    //       } else if (i === 'Yearly') {
    //         value.push('Y');
    //       }
    //     }
    //     filter = { plan: { in: value } };
    //   } else {
    //     let value;
    //     if (query.subscription === 'Monthly') {
    //       value = 'M';
    //     } else if (query.subscription === 'Yearly') {
    //       value = 'Y';
    //     }
    //     filter = { plan: value };
    //   }
    //   where = { ...where, ...filter };
    // }

    //filter by dnd
    if (query.dnd && query.dnd.length > 0) {
      let filter;
      if (Array.isArray(query.dnd)) {
        let value;
        if (query.dnd[0] === 'SUBSCRIBED') {
          value = true;
        } else if (query.dnd[0] === 'NOT SUBSCRIBED') {
          value = false;
        }
        filter = { isdnd: value };
      } else {
        let value;
        if (query.dnd === 'SUBSCRIBED') {
          value = true;
        } else if (query.dnd === 'NOT SUBSCRIBED') {
          value = false;
        }

        filter = { isdnd: value };
      }
      where = { ...where, ...filter };
    }

    //filter by organisation
    if (query.organisation && query.organisation.length > 0) {
      const filter = listQueryHandlerNested(
        query.organisation,
        'organisations',
        'title',
      );
      where = { ...where, ...filter };
    }

    //filter by status
    // if (query.status && query.status.length > 0) {
    //   const filter = listQueryHandlerNested(query.status, 'packages', 'type');
    //   where = { ...where, ...filter };
    // }

    //filter by class
    if (query.class && query.class.length > 0) {
      const filter = listQueryHandlerNested(
        query.class,
        'categoryfield',
        'title',
      );
      if (query.role == 'Student') {
        where = { ...where, ...filter };
      } else {
        let docc;
        if (Array.isArray(query.class)) {
          docc = await this.prisma.profiles.findMany({
            where: {
              role: 'Student',
              isactive: true,
              // categoryfield: { title: { in: query.class } },
            },
          });
        } else {
          docc = await this.prisma.profiles.findMany({
            where: {
              role: 'Student',
              isactive: true,
              // categoryfield: { title: query.class },
            },
          });
        }
        const list = docc.map((element) => {
          return element.parentid;
        });
        console.log(list);

        const filter = { id: { in: list } };

        where = { ...where, ...filter };
      }
    }

    //filter by city
    // if (query.city && query.city.length > 0) {
    //   if (Array.isArray(query.city)) {
    //     const filter = {
    //       OR: [
    //         { city: { in: query.city } },
    //         { locationdetails: { city: { in: query.city } } },
    //       ],
    //     };
    //     where = { ...where, ...filter };
    //   } else {
    //     const filter = {
    //       OR: [{ city: query.city }, { locationdetails: { city: query.city } }],
    //     };
    //     where = { ...where, ...filter };
    //   }
    // }

    //filter by validuptodate
    if (
      query.startDate &&
      query.validUpToDate &&
      query.validUpToDate.length > 0 &&
      query.startDate.length > 0
    ) {
      const startDate = new Date(query.startDate);
      const validUpToDate = new Date(query.validUpToDate);
      const filter = {
        validupto: {
          gte: startDate.toISOString(),
          lte: validUpToDate.toISOString(),
        },
      };
      where = { ...where, ...filter };
    }

    //filter by date
    if (
      query.startDate &&
      query.endDate &&
      query.endDate.length > 0 &&
      query.startDate.length > 0
    ) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);
      const filter = {
        joindate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
      };
      where = { ...where, ...filter };
    }

    //role filter
    if (query.parentId) {
      const filter = {
        role: 'Student',
        parentid: parseInt(query.parentId),
        isactive: true,
      };

      where = { ...where, ...filter };
    } else if (query.role === 'Student') {
      const filter = {
        role: 'Student',
      };

      where = { ...where, ...filter };
    }

    if (query.role === 'Parent') {
      const filter = {
        role: 'Parent',
        // totalchild: {
        //   gt: 0,
        // },
      };

      where = { ...where, ...filter };
    }
    console.log(where);

    //find
    let data = await this.prisma.profiles.findMany({
      where: {
        OR: [
          { firstname: { contains: search, mode: 'insensitive' } },
          { emailid: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search, mode: 'insensitive' } },
          { verificationcode: { contains: search, mode: 'insensitive' } },
          { referby: { contains: search, mode: 'insensitive' } },
          { verificationcode: { contains: search, mode: 'insensitive' } },
        ],

        AND: {
          ...where,
        },
      },
      include: {
        // packages: { select: { type: true, grade: true } },
        // registrationsessionfield: { select: { title: true } },
        organisations: { select: { title: true } },
        categories: { select: { title: true } },
      },
      skip: value.skip,
      take: value.resPerPage,
      orderBy: value.orderBy,
    });

    totalNoOfItem = await this.prisma.profiles.count({
      where: { ...where },
    });

    if (query.downloadxl == 'Y') {
      if (data && data.length > 0) {
        console.log('download');
        return exportToExcel(data);
      } else {
        return exportToExcel([{ noData: 'Nothing to read' }]);
      }
    } else {
      return value.response(
        totalNoOfItem,
        200,
        '',
        'success',
        data,
        query.name,
        query.type,
      );
    }
  }

  //////////////////////////////////////////GET ONE BY ID//////////////////////////////////////
  async getUserById(id) {
    id = parseInt(id);
    return await this.prisma.profiles.findFirst({
      where: { id },
      include: {
        // packages: { select: { type: true, grade: true } },
        // registrationsessionfield: { select: { title: true } },
        organisations: { select: { title: true } },
        categories: { select: { title: true } },
      },
    });
  }

  //////////////////////////////////////////UPDATE USER//////////////////////////////////////
  async updateUserById(data) {
    const id = data.id;
    delete data.id;
    let userFielddata = {};

    if (data.name) {
      userFielddata = {
        ...userFielddata,
        name: data.name,
      };
    }
    const updatedData = await this.prisma.profiles.update({
      where: {
        id: id,
      },
      include: {
        // packages: { select: { type: true, grade: true } },
        // registrationsessionfield: { select: { title: true } },
        organisations: { select: { title: true } },
        categories: { select: { title: true } },
      },
      data: {
        ...data,
      },
    });

    const categoryfieldUpdate = {
      title: data.class,
    };
    console.log(updatedData);

    return updatedData;
  }

  //////////////////////////////////////////DELETE BY ID//////////////////////////////////////
  async deleteUserById(id) {
    console.log(id);
    id = parseInt(id);
    return await this.prisma.profiles.delete({ where: { id } });
  }

  //////////////////////////////////////////GET LIST OF Name and Email//////////////////////////////////////
  async getAllNameAndEmail(role) {
    const data = await this.prisma.profiles.findMany({
      where: { role: 'Parent' },
      select: { firstname: true, emailid: true },
    });
    let nameAndEmailArray = data.reduce(
      (acc, obj) => acc.concat(obj.firstname, obj.emailid),
      [],
    );
    nameAndEmailArray = Array.from(new Set(nameAndEmailArray));
    nameAndEmailArray = nameAndEmailArray.filter((element) => element !== null);

    return nameAndEmailArray;
  }

  //////////////////////////////////////////GET LIST OF ORGANISATION//////////////////////////////////////
  async getAllOrganisationList() {
    const data = await this.prisma.profiles.findMany({
      include: { organisations: { select: { title: true } } },
    });

    let nameAndEmailArray = data.reduce(
      (acc, obj) =>
        acc.concat(obj.organisations ? obj.organisations.title : []),
      [],
    );

    nameAndEmailArray = Array.from(new Set(nameAndEmailArray));
    nameAndEmailArray = nameAndEmailArray.filter(
      (element) => element !== null && element !== '',
    );

    return nameAndEmailArray;
  }

  //////////////////////////////////////////GET LIST OF PACKAGES////////////////////////////////////////
  // async getPackageList() {
  //   const data = await this.prisma.profiles.findMany({
  //     include: { packages: { select: { type: true } } },
  //   });
  //   let nameAndEmailArray = data.reduce(
  //     (acc, obj) => acc.concat(obj.packages ? obj.packages.type : ''),
  //     [],
  //   );
  //   nameAndEmailArray = Array.from(new Set(nameAndEmailArray));
  //   nameAndEmailArray = nameAndEmailArray.filter((element) => element !== null);
  //   nameAndEmailArray = nameAndEmailArray.filter((str) => str !== '');
  //   return nameAndEmailArray;
  // }

  //////////////////////////////////////////GET LIST OF CITY////////////////////////////////////////
  // async getCityList() {
  //   const data = await this.prisma.profiles.findMany({
  //     select: { locationdetails: true },
  //   });
  //   let nameAndEmailArray = data.reduce(
  //     (acc, obj) => acc.concat(obj.locationdetails ? obj.locationdetails : ''),
  //     [],
  //   );
  //   nameAndEmailArray = Array.from(new Set(nameAndEmailArray));
  //   nameAndEmailArray = nameAndEmailArray.filter((element) => element !== null);
  //   nameAndEmailArray = nameAndEmailArray.filter((str) => str !== '');
  //   return nameAndEmailArray;
  // }
}
