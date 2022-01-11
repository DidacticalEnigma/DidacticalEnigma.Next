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

export interface KanaResult {
  hiragana: KanaBoard;
  katakana: KanaBoard;
}

export interface KanaBoard {
  width: number;
  height: number;
  layout: "TopToBottomLeftToRight";
  characters: KanaCharacter[];
}

export interface KanaCharacter {
  kana: string;
  romaji: string;
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
  queryNames: string[];
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

export interface ProgramConfigurationGetResult {
  isDefault: boolean;
  aboutSection: string;
  version: string;
  dataSourceGridLayouts: any[];
}

export interface ProgramConfigurationSetRequest {
  dataSourceGridLayouts: any[];
}

export interface WordInfoResponse {
  wordInformation: WordInfo[];
  /** Dictionary of <components·14obqe6·schemas·wordinforesponse·properties·similarletters·additionalproperties> */
  similarLetters: { [propertyName: string]: SimilarLetter[] };
}

export interface WordInfo {
  text: string;
  dictionaryForm: string;
  reading: string;
  type: WordInfoType;
}

export interface SimilarLetter {
  letter: string;
  description: string;
  category: string;
}

/** Known values of {@link WordInfoType} that the service accepts. */
export enum KnownWordInfoType {
  Other = "Other",
  Noun = "Noun",
  Verb = "Verb",
  Particle = "Particle",
  Pronoun = "Pronoun"
}

/**
 * Defines values for WordInfoType. \
 * {@link KnownWordInfoType} can be used interchangeably with WordInfoType,
 *  this enum contains the known values that the service supports.
 * ### Known values supported by the service
 * **Other** \
 * **Noun** \
 * **Verb** \
 * **Particle** \
 * **Pronoun**
 */
export type WordInfoType = string;

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
export interface ListKanaOptionalParams extends coreClient.OperationOptions {}

/** Contains response data for the listKana operation. */
export type ListKanaResponse = KanaResult;

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
export interface LoadSessionOptionalParams
  extends coreClient.OperationOptions {}

/** Contains response data for the loadSession operation. */
export type LoadSessionResponse = ProgramConfigurationGetResult;

/** Optional parameters. */
export interface SaveSessionOptionalParams extends coreClient.OperationOptions {
  body?: ProgramConfigurationSetRequest;
}

/** Optional parameters. */
export interface GetWordInformationOptionalParams
  extends coreClient.OperationOptions {
  fullText?: string;
}

/** Contains response data for the getWordInformation operation. */
export type GetWordInformationResponse = WordInfoResponse;

/** Optional parameters. */
export interface DidacticalEnigmaNextOptionalParams
  extends coreClient.ServiceClientOptions {
  /** Overrides client endpoint. */
  endpoint?: string;
}
