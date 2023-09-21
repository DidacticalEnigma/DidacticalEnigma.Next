import {
  OperationParameter,
  OperationURLParameter,
  OperationQueryParameter
} from "@azure/core-client";
import {
  DataSourceParseRequest as DataSourceParseRequestMapper,
  ProgramConfigurationSetRequest as ProgramConfigurationSetRequestMapper,
  ReceiveInputRequest as ReceiveInputRequestMapper
} from "../models/mappers";

export const accept: OperationParameter = {
  parameterPath: "accept",
  mapper: {
    defaultValue: "application/json, text/json",
    isConstant: true,
    serializedName: "Accept",
    type: {
      name: "String"
    }
  }
};

export const $host: OperationURLParameter = {
  parameterPath: "$host",
  mapper: {
    serializedName: "$host",
    required: true,
    type: {
      name: "String"
    }
  },
  skipEncoding: true
};

export const input: OperationQueryParameter = {
  parameterPath: ["options", "input"],
  mapper: {
    serializedName: "input",
    type: {
      name: "String"
    }
  }
};

export const contentType: OperationParameter = {
  parameterPath: ["options", "contentType"],
  mapper: {
    defaultValue: "application/json",
    isConstant: true,
    serializedName: "Content-Type",
    type: {
      name: "String"
    }
  }
};

export const body: OperationParameter = {
  parameterPath: ["options", "body"],
  mapper: DataSourceParseRequestMapper
};

export const query: OperationQueryParameter = {
  parameterPath: ["options", "query"],
  mapper: {
    serializedName: "query",
    type: {
      name: "String"
    }
  }
};

export const sort: OperationQueryParameter = {
  parameterPath: ["options", "sort"],
  mapper: {
    serializedName: "sort",
    type: {
      name: "String"
    }
  }
};

export const select: OperationQueryParameter = {
  parameterPath: ["options", "select"],
  mapper: {
    serializedName: "select",
    type: {
      name: "String"
    }
  }
};

export const deselect: OperationQueryParameter = {
  parameterPath: ["options", "deselect"],
  mapper: {
    serializedName: "deselect",
    type: {
      name: "String"
    }
  }
};

export const body1: OperationParameter = {
  parameterPath: ["options", "body"],
  mapper: ProgramConfigurationSetRequestMapper
};

export const body2: OperationParameter = {
  parameterPath: ["options", "body"],
  mapper: ReceiveInputRequestMapper
};

export const fullText: OperationQueryParameter = {
  parameterPath: ["options", "fullText"],
  mapper: {
    serializedName: "fullText",
    type: {
      name: "String"
    }
  }
};
