import { EmbeddedRestDatasource } from "entities/Datasource";
import { DynamicPath } from "utils/DynamicBindingUtils";
import _ from "lodash";
import { LayoutOnLoadActionErrors } from "constants/AppsmithActionConstants/ActionConstants";
import { Plugin } from "api/PluginApi";

export enum PluginType {
  API = "API",
  DB = "DB",
  SAAS = "SAAS",
  JS = "JS",
  REMOTE = "REMOTE",
}

// more can be added subsequently.
export enum PluginName {
  MONGO = "MongoDB",
}

export enum PaginationType {
  NONE = "NONE",
  PAGE_NO = "PAGE_NO",
  URL = "URL",
  CURSOR = "CURSOR",
}

export interface KeyValuePair {
  key?: string;
  value?: unknown;
}

export type LimitOffset = {
  limit: Record<string, unknown>;
  offset: Record<string, unknown>;
};
export interface SelfReferencingData {
  limitBased?: LimitOffset;
  curserBased?: {
    previous?: LimitOffset;
    next?: LimitOffset;
  };
}

export interface ActionConfig {
  timeoutInMillisecond?: number;
  paginationType?: PaginationType;
  formData?: Record<string, unknown>;
  pluginSpecifiedTemplates?: KeyValuePair[];
  path?: string;
  queryParameters?: KeyValuePair[];
  selfReferencingData?: SelfReferencingData;
}

export interface ActionProvider {
  name: string;
  imageUrl: string;
  url: string;
  description: string;
  credentialSteps: string;
}

export interface Property {
  key: string;
  value: string;
}

export interface BodyFormData {
  editable: boolean;
  mandatory: boolean;
  description: string;
  key: string;
  value?: string;
  type: string;
}

export interface ApiActionConfig extends Omit<ActionConfig, "formData"> {
  headers: Property[];
  httpMethod: string;
  path?: string;
  body?: JSON | string | Record<string, any> | null;
  encodeParamsToggle: boolean;
  queryParameters?: Property[];
  bodyFormData?: BodyFormData[];
  formData: Record<string, unknown>;
  query?: string | null;
  variable?: string | null;
}

export interface QueryActionConfig extends ActionConfig {
  body?: string;
}

export const isStoredDatasource = (val: any): val is StoredDatasource => {
  if (!_.isObject(val)) return false;
  if (!("id" in val)) return false;
  return true;
};
export interface StoredDatasource {
  id: string;
  pluginId?: string;
}

export interface BaseAction {
  id: string;
  name: string;
  workspaceId: string;
  pageId: string;
  collectionId?: string;
  pluginId: string;
  executeOnLoad: boolean;
  dynamicBindingPathList: DynamicPath[];
  isValid: boolean;
  invalids: string[];
  jsonPathKeys: string[];
  cacheResponse: string;
  confirmBeforeExecute?: boolean;
  eventData?: any;
  messages: string[];
  errorReports?: Array<LayoutOnLoadActionErrors>;
}

interface BaseApiAction extends BaseAction {
  pluginType: PluginType.API;
  actionConfiguration: ApiActionConfig;
}
export interface SaaSAction extends BaseAction {
  pluginType: PluginType.SAAS;
  actionConfiguration: any;
  datasource: StoredDatasource;
}
export interface RemoteAction extends BaseAction {
  pluginType: PluginType.REMOTE;
  actionConfiguration: any;
  datasource: StoredDatasource;
}

export interface EmbeddedApiAction extends BaseApiAction {
  datasource: EmbeddedRestDatasource;
}

export interface StoredDatasourceApiAction extends BaseApiAction {
  datasource: StoredDatasource;
}

export type ApiAction = EmbeddedApiAction | StoredDatasourceApiAction;

export type RapidApiAction = ApiAction & {
  templateId: string;
  proverId: string;
  provider: ActionProvider;
  pluginId: string;
  documentation: { text: string };
};

export interface QueryAction extends BaseAction {
  pluginType: PluginType.DB;
  pluginName?: PluginName;
  actionConfiguration: QueryActionConfig;
  datasource: StoredDatasource;
}

export type ActionViewMode = {
  id: string;
  name: string;
  pageId: string;
  jsonPathKeys: string[];
  confirmBeforeExecute?: boolean;
  timeoutInMillisecond?: number;
};

export type Action = ApiAction | QueryAction | SaaSAction | RemoteAction;

export enum SlashCommand {
  NEW_SNIPPET,
  NEW_API,
  NEW_QUERY,
  NEW_INTEGRATION,
}

export type SlashCommandPayload = {
  actionType: SlashCommand;
  callback?: (binding: string) => void;
  args: any;
};

export function isAPIAction(action: Action): action is ApiAction {
  return action.pluginType === PluginType.API;
}

export function isQueryAction(action: Action): action is QueryAction {
  return action.pluginType === PluginType.DB;
}

export function isSaaSAction(action: Action): action is SaaSAction {
  return action.pluginType === PluginType.SAAS;
}

export function getGraphQLPlugin(plugins: Plugin[]): Plugin | undefined {
  return plugins.find((p) => p.packageName === "graphql-plugin");
}

export function isGraphqlPlugin(plugin: Plugin | undefined) {
  return plugin?.packageName === "graphql-plugin";
}
