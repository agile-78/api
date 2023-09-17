import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Model } from "mongoose";

export function generateGetAll<T>(
  model: Model<T>,
  populate?: string,
  srcFields?: string[]
) {
  return async function (req: Request, res: Response) {
    const query = req.query;
    const size = parseInt(query.size as string) || undefined;
    const page = parseInt(query.page as string) || 1;

    let data: any,
      totalPages: number = 1;

    if (query.src) {
      data = await generalGetSrc<T>(model, req, populate, srcFields);
      if (size && page) {
        totalPages = Math.ceil(data.length / size);
        data = data.slice(size * (page - 1), size * (page - 1) + size);
      }
    } else {
      data = await generalGetAll<T>(model, req, populate, size, page);
      const dataCount = await model.count();

      if (size) {
        totalPages = Math.ceil(dataCount / size);
      }
    }

    res.status(StatusCodes.OK).send({
      [model.modelName[0].toLowerCase() + model.modelName.slice(1) + "s"]: data,
      totalPages,
      currentPage: page,
      length: data.length,
    });
  };
}

export async function generalGetSrc<T>(
  model: Model<T>,
  req: Request,
  populate?: string,
  srcFields?: string[]
) {
  const { sort, fields, src, ...blogFields } = req.query;

  let result;

  let srcQuery = {};

  if (src && srcFields) {
    const tmp = srcFields.reduce(
      (accumulator: any[], current) => [
        ...accumulator,
        {
          [current]: {
            $regex: src,
            $options: "i",
          },
        },
      ],
      []
    );
    srcQuery = {
      $or: tmp,
    };
  }

  // @ts-ignore
  result = model.find({
    ...srcQuery,
    ...blogFields,
  });

  if (typeof sort === "string" && sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }

  if (typeof fields === "string" && fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  result = result;

  if (populate) {
    if (!fields || (fields as string)?.split(",").includes(populate)) {
      return result.populate(populate);
    }
  }

  return result;
}

export async function generalGetAll<T>(
  model: Model<T>,
  req: Request,
  populate?: string,
  size?: number,
  page?: number
) {
  const { sort, fields, ...blogFields } = req.query;

  let result;

  // @ts-ignore
  result = model.find({
    ...blogFields,
  });

  if (typeof sort === "string" && sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }

  if (typeof fields === "string" && fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  if (page && size) {
    const skip = (page - 1) * size;

    result = result.skip(skip).limit(size);
  }

  if (populate) {
    if (!fields || (fields as string)?.split(",").includes(populate)) {
      return result.populate(populate);
    }
  }

  return result;
}

export async function generalGet<T>(
  model: Model<T>,
  req: Request,
  id: any,
  populate?: string
) {
  const { sort, fields, ...modelFields } = req.query;

  let result: any = model.findById(id);

  if (typeof sort === "string" && sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  }

  if (typeof fields === "string" && fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  if (populate) {
    if (!fields || (fields as string)?.split(",").includes(populate)) {
      return result.populate(populate);
    }
  }

  return result;
}
