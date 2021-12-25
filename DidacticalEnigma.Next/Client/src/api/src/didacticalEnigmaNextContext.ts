import * as coreClient from "@azure/core-client";
import { DidacticalEnigmaNextOptionalParams } from "./models";

export class DidacticalEnigmaNextContext extends coreClient.ServiceClient {
  $host: string;

  /**
   * Initializes a new instance of the DidacticalEnigmaNextContext class.
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
      baseUri: options.endpoint || "{$host}"
    };
    super(optionsWithDefaults);
    // Parameter assignments
    this.$host = $host;
  }
}