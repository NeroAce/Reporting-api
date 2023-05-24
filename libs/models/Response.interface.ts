export class ResponseInterface {
  skip;
  search;
  orderBy = {};
  totalpage;
  currentPage;
  resPerPage;
  constructor(query) {
    //pagination
    this.resPerPage = parseInt(query.pagesize) || 10;
    this.currentPage = query.page || 1;
    this.skip = this.resPerPage * (this.currentPage - 1);
    this.search = query.search || '';

    try {
      if (query.name && query.type) {
        this.orderBy[query.name] = query.type;
      }
    } catch (err) {
      console.error(err);
    }
  }

  response(totalNoOfItem, code, message, status, data, orderBy, orderType) {
    const totalPages = Math.ceil(totalNoOfItem / this.resPerPage);
    const response = {
      code: code,
      message: message,
      status: status,
      data: {
        pageIndex: this.currentPage,
        totalPages: totalPages,
        data: data,
        orderBy: orderBy,
        orderType: orderType,
      },
    };

    return response;
  }
}
