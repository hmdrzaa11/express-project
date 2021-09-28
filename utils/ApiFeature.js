module.exports = class ApiFeatures {
  constructor(mongooseQuery, queryParams) {
    this.mongooseQuery = mongooseQuery;
    this.queryParams = queryParams;
  }
  filter() {
    let queyCopy = { ...this.queryParams };
    //remove invalid params
    let invalids = ["sort", "page", "limit", "fields"];
    for (let key of invalids) {
      delete queyCopy[key];
    }

    //turn them into "$gt"
    let filterString = JSON.stringify(queyCopy).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matched) => `$${matched}`
    );
    let filterObj = JSON.parse(filterString);
    this.mongooseQuery = this.mongooseQuery.find(filterObj);
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      let sortString = this.queryParams.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortString);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      let fields = this.queryParams.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  paginate() {
    let page = this.queryParams.page * 1 || 1;
    let limit = this.queryParams.limit * 1 || 10;
    let skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
};
