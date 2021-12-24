import * as coreClient from "@azure/core-client";

export interface AutoGlossResult {
  entries: AutoGlossEntry[];
}

export interface AutoGlossEntry {
  word: string;
  definitions: string[];
}

export interface DataSourceInformation {
  identifier: string;
  friendlyName: string;
}

export interface DataSourceParseRequest {
  requestedDataSources?: string[];
  text?: string;
  positions?: DataSourceParseRequestPosition[];
}

export interface DataSourceParseRequestPosition {
  position: number;
  positionEnd?: number;
}

export interface DataSourceParseResponse {
  position: number;
  positionEnd?: number;
  dataSource: string;
  context?: string;
  error?: string;
}

export interface ListRadicalsResult {
  possibleRadicals: string[];
  radicalInformation: ExtendedRadicalInformation[];
  sortingCriteria: string[];
}

export interface ExtendedRadicalInformation {
  radical: string;
  strokeCount: number;
  alternativeDisplay: string;
}

export interface KanjiLookupResult {
  newQuery: string;
  kanji: string[];
  radicals: RadicalState[];
}

export interface RadicalState {
  radical: string;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface WordInfoResponse {
  wordInformation: WordInfo[][];
  /** Dictionary of <components·14obqe6·schemas·wordinforesponse·properties·similarletters·additionalproperties> */
  similarLetters: { [propertyName: string]: SimilarLetter[] };
}

export interface WordInfo {
  text: string;
  dictionaryForm: string;
  reading: string;
}

export interface SimilarLetter {
  letter: string;
  description: string;
  category: string;
}

/** Optional parameters. */
export interface RunAutomaticGlossOptionalParams
  extends coreClient.OperationOptions {
  input?: string;
}

/** Contains response data for the runAutomaticGloss operation. */
export type RunAutomaticGlossResponse = AutoGlossResult;

/** Optional parameters. */
export interface ListDataSourcesOptionalParams
  extends coreClient.OperationOptions {}

/** Contains response data for the listDataSources operation. */
export type ListDataSourcesResponse = DataSourceInformation[];

/** Optional parameters. */
export interface RequestInformationFromDataSourcesOptionalParams
  extends coreClient.OperationOptions {
  body?: DataSourceParseRequest;
}

/** Contains response data for the requestInformationFromDataSources operation. */
export type RequestInformationFromDataSourcesResponse = DataSourceParseResponse[];

/** Optional parameters. */
export interface ListRadicalsOptionalParams
  extends coreClient.OperationOptions {}

/** Contains response data for the listRadicals operation. */
export type ListRadicalsResponse = ListRadicalsResult;

/** Optional parameters. */
export interface SelectRadicalsOptionalParams
  extends coreClient.OperationOptions {
  query?: string;
  sort?: string;
  select?: string;
  deselect?: string;
}

/** Contains response data for the selectRadicals operation. */
export type SelectRadicalsResponse = KanjiLookupResult;

/** Optional parameters. */
export interface GetWordInformationOptionalParams
  extends coreClient.OperationOptions {
  fullText?: string;
}

/** Contains response data for the getWordInformation operation. */
export type GetWordInformationResponse = WordInfoResponse;

/** Optional parameters. */
export interface DidacticalEnigmaRestApiOptionalParams
  extends coreClient.ServiceClientOptions {
  /** Overrides client endpoint. */
  endpoint?: string;
}
