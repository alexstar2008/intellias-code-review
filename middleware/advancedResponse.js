const buildQuery = (model, queryParams) => {
  let query;
  query = model.find().populate("company", "name address avatar");
  if (queryParams.staff) {
    const staffQuery = queryParams.staff.split(",");
    if (staffQuery[0] === "0") {
      query
        .where("staff")
        .or([{ staff: { $eq: null } }, { staff: { $lte: staffQuery[1] } }]);
    } else {
      query.where("staff").gte(staffQuery[0]).lte(staffQuery[1]);
    }
  }
  if (queryParams.salary) {
    const salaries = queryParams.salary.split(",");
    if (salaries[0] === "0") {
      query
        .where("salary")
        .or([{ salary: { $eq: null } }, { salary: { $lte: salaries[1] } }]);
    } else {
      query.where("salary").gte(salaries[0]).lte(salaries[1]);
    }
  }
  if (queryParams.followers) {
    query = query.sort({ followersCount: queryParams.followers });
  } else if (queryParams.sort) {
    const sortBy = queryParams.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  let positions = [];
  if (queryParams.position) {
    let posArr;
    if (queryParams.position.includes(",")) {
      posArr = queryParams.position.split(",");
      posArr.map(pos => {
        positions.push({ position: pos });
        return pos;
      });
    } else positions.push({ position: queryParams.position });
    query.where("position").in(posArr || [queryParams.position]);
  }

  return query;
};

const advancedResponse = model => async (req, res, next) => {
  let queryTotal = buildQuery(model, req.query);
  let queryData = buildQuery(model, req.query);

  //Pagination
  const total = await queryTotal.countDocuments();
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  queryData = queryData.skip(startIndex).limit(limit);
  const results = await queryData;

  const pagination = {
    total: Math.ceil(total / limit),
  };

  pagination.current = page;

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResponse;
