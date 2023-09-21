import * as coreClient from "@azure/core-client";
import * as Parameters from "./models/parameters";
import * as Mappers from "./models/mappers";
import {
  DidacticalEnigmaNextOptionalParams,
  RunAutomaticGlossOptionalParams,
  RunAutomaticGlossResponse,
  ListDataSourcesOptionalParams,
  ListDataSourcesResponse,
  RequestInformationFromDataSourcesOptionalParams,
  RequestInformationFromDataSourcesResponse,
  ListKanaOptionalParams,
  ListKanaResponse,
  ListRadicalsOptionalParams,
  ListRadicalsResponse,
  SelectRadicalsOptionalParams,
  SelectRadicalsResponse,
  LoadSessionOptionalParams,
  LoadSessionResponse,
  SaveSessionOptionalParams,
  RestReceiveInputOptionalParams,
  RestReceiveInputResponse,
  GetWordInformationOptionalParams,
  GetWordInformationResponse
} from "./models";

export class DidacticalEnigmaNext extends coreClient.ServiceClient {
  $host: string;

  /**
   * Initializes a new instance of the DidacticalEnigmaNext class.
   * @param $host server parameter
   * @param options The parameter options
   */
  constructor($host: string, options?: DidacticalEnigmaNextOptionalParams) {
    if ($host === undefined) {
      throw new Error("'$host' cannot be null");
    }

    // Initializing default values for options
    if (!options) {
      options = {};
    }
    const defaults: DidacticalEnigmaNextOptionalParams = {
      requestContentType: "application/json; charset=utf-8"
    };

    const packageDetails = `azsdk-js-didacticalEnigmaNext/1.0.0-beta.1`;
    const userAgentPrefix =
      options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${packageDetails}`
        : `${packageDetails}`;

    const optionsWithDefaults = {
      ...defaults,
      ...options,
      userAgentOptions: {
        userAgentPrefix
      },
      endpoint: options.endpoint ?? options.baseUri ?? "{$host}"
    };
    super(optionsWithDefaults);
    // Parameter assignments
    this.$host = $host;
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
  listKana(options?: ListKanaOptionalParams): Promise<ListKanaResponse> {
    return this.sendOperationRequest({ options }, listKanaOperationSpec);
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
  loadSession(
    options?: LoadSessionOptionalParams
  ): Promise<LoadSessionResponse> {
    return this.sendOperationRequest({ options }, loadSessionOperationSpec);
  }

  /** @param options The options parameters. */
  saveSession(options?: SaveSessionOptionalParams): Promise<void> {
    return this.sendOperationRequest({ options }, saveSessionOperationSpec);
  }

  /** @param options The options parameters. */
  restReceiveInput(
    options?: RestReceiveInputOptionalParams
  ): Promise<RestReceiveInputResponse> {
    return this.sendOperationRequest(
      { options },
      restReceiveInputOperationSpec
    );
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
const listKanaOperationSpec: coreClient.OperationSpec = {
  path: "/kana/list",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.KanaResult
    }
  },
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
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
const loadSessionOperationSpec: coreClient.OperationSpec = {
  path: "/session",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ProgramConfigurationGetResult
    }
  },
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const saveSessionOperationSpec: coreClient.OperationSpec = {
  path: "/session",
  httpMethod: "POST",
  responses: { 200: {} },
  requestBody: Parameters.body1,
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.contentType],
  mediaType: "json",
  serializer
};
const restReceiveInputOperationSpec: coreClient.OperationSpec = {
  path: "/session/inputReceive",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: {
        type: { name: "Dictionary", value: { type: { name: "any" } } }
      }
    }
  },
  requestBody: Parameters.body2,
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept, Parameters.contentType],
  mediaType: "json",
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
