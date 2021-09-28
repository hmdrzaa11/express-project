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
};
