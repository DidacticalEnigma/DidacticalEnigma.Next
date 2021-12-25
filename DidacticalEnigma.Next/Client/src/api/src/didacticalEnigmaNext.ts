import * as coreClient from "@azure/core-client";
import * as Parameters from "./models/parameters";
import * as Mappers from "./models/mappers";
import { DidacticalEnigmaNextContext } from "./didacticalEnigmaNextContext";
import {
  DidacticalEnigmaNextOptionalParams,
  RunAutomaticGlossOptionalParams,
  RunAutomaticGlossResponse,
  ListDataSourcesOptionalParams,
  ListDataSourcesResponse,
  RequestInformationFromDataSourcesOptionalParams,
  RequestInformationFromDataSourcesResponse,
  ListRadicalsOptionalParams,
  ListRadicalsResponse,
  SelectRadicalsOptionalParams,
  SelectRadicalsResponse,
  GetWordInformationOptionalParams,
  GetWordInformationResponse
} from "./models";

export class DidacticalEnigmaNext extends DidacticalEnigmaNextContext {
  /**
   * Initializes a new instance of the DidacticalEnigmaNext class.
   * @param $host server parameter
   * @param options The parameter options
   */
  constructor($host: string, options?: DidacticalEnigmaNextOptionalParams) {
    super($host, options);
  }

  /** @param options The options parameters. */
  runAutomaticGloss(
    options?: RunAutomaticGlossOptionalParams
  ): Promise<RunAutomaticGlossResponse> {
    return this.sendOperationRequest(
      { options },
      runAutomaticGlossOperationSpec
    );
  }

  /** @param options The options parameters. */
  listDataSources(
    options?: ListDataSourcesOptionalParams
  ): Promise<ListDataSourcesResponse> {
    return this.sendOperationRequest({ options }, listDataSourcesOperationSpec);
  }

  /** @param options The options parameters. */
  requestInformationFromDataSources(
    options?: RequestInformationFromDataSourcesOptionalParams
  ): Promise<RequestInformationFromDataSourcesResponse> {
    return this.sendOperationRequest(
      { options },
      requestInformationFromDataSourcesOperationSpec
    );
  }

  /** @param options The options parameters. */
  listRadicals(
    options?: ListRadicalsOptionalParams
  ): Promise<ListRadicalsResponse> {
    return this.sendOperationRequest({ options }, listRadicalsOperationSpec);
  }

  /** @param options The options parameters. */
  selectRadicals(
    options?: SelectRadicalsOptionalParams
  ): Promise<SelectRadicalsResponse> {
    return this.sendOperationRequest({ options }, selectRadicalsOperationSpec);
  }

  /** @param options The options parameters. */
  getWordInformation(
    options?: GetWordInformationOptionalParams
  ): Promise<GetWordInformationResponse> {
    return this.sendOperationRequest(
      { options },
      getWordInformationOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const runAutomaticGlossOperationSpec: coreClient.OperationSpec = {
  path: "/autoGloss",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.AutoGlossResult
    }
  },
  queryParameters: [Parameters.input],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const listDataSourcesOperationSpec: coreClient.OperationSpec = {
  path: "/dataSource/list",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: {
        type: {
          name: "Sequence",
          element: {
            type: { name: "Composite", className: "DataSourceInformation" }
          }
        }
      }
    }
  },
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const requestInformationFromDataSourcesOperationSpec: coreClient.OperationSpec = {
  path: "/dataSource/request",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: {
        type: {
          name: "Sequence",
          element: {
            type: { name: "Composite", className: "DataSourceParseResponse" }
          }
        }
      }
    }
  },
  requestBody: Parameters.body,
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
  serializer
};
const listRadicalsOperationSpec: coreClient.OperationSpec = {
  path: "/radicals/list",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ListRadicalsResult
    }
  },
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const selectRadicalsOperationSpec: coreClient.OperationSpec = {
  path: "/radicals/select",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KanjiLookupResult
    }
  },
  queryParameters: [
    Parameters.query,
    Parameters.sort,
    Parameters.select,
    Parameters.deselect
  ],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const getWordInformationOperationSpec: coreClient.OperationSpec = {
  path: "/wordInfo",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.WordInfoResponse
    }
  },
  queryParameters: [Parameters.fullText],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
