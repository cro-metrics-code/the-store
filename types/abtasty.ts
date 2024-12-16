type ABTastyBaseEventData = Record<string, unknown>;

// Event tracking types
interface ABTastyEventData extends ABTastyBaseEventData {
  ec: string; // Event Category
  ea: string; // Event Action
  el?: string; // Event Label (optional)
  ev?: number; // Event Value (optional)
}

// Segment tracking types
interface ABTastySegmentData extends ABTastyBaseEventData {
  s: Record<string, string>;
}

// Transaction tracking types
interface ABTastyTransactionData extends ABTastyBaseEventData {
  tid: string; // Transaction ID
  ta: string; // Transaction Affiliation
  tr: number; // Transaction Revenue
  ts?: number; // Transaction Shipping
  tt?: number; // Transaction Tax
  tc?: string; // Transaction Currency
  tcc?: string; // Transaction Coupon Code
  pm?: string; // Payment Method
  sm?: string; // Shipping Method
  icn?: number; // Item Count
}

// Item tracking types
interface ABTastyItemData extends ABTastyBaseEventData {
  tid: string; // Transaction ID
  in: string; // Item Name
  ic: string; // Item Code
  ip?: number; // Item Price
  iq?: number; // Item Quantity
  iv?: string; // Item Category
}

// NPS tracking types
interface ABTastyNPSData extends ABTastyBaseEventData {
  nid: string; // NPS ID
  ns: number; // NPS Score
  nf?: string; // NPS Feedback
}

// Product tracking types
type ABTastyProductInteractionType = 'CART_ITEM' | 'CART_TOTAL' | 'VIEW';

interface ABTastyProductData extends ABTastyBaseEventData {
  pit: ABTastyProductInteractionType; // Product Interaction Type
  pcid?: string; // Product Cart ID
  pq?: number; // Product Quantity
  pp?: number; // Product Price
  ps?: string; // Product SKU
  pn?: string; // Product Name
}

// Function types for ABTasty global methods
export type ABTastyClickTrackingFn = (
  tracking_name: string,
  deprecated: null,
  campaign_id?: number,
) => void;

export type ABTastyStartTestFn = (
  campaign_id: number,
  variation_id?: number,
) => void;

export type ABTastyReloadFn = () => void;

export type UnlockABTastyFn = () => void;

export type ABTastyPush = {
  (type: 'event', data: ABTastyEventData): void;
  (type: 'segment', data: ABTastySegmentData): void;
  (type: 'transaction', data: ABTastyTransactionData): void;
  (type: 'item', data: ABTastyItemData): void;
  (type: 'nps', data: ABTastyNPSData): void;
  (type: 'product', data: ABTastyProductData): void;
};

// Account Settings Types
export interface AccountSettings {
  accountIframeException?: boolean;
  accountName: string;
  addJquery: boolean;
  ajaxAutoReload: boolean;
  apiTokenWeborama: string | null;
  cedexisRadar: number;
  customCookieDomain: string | null;
  customCookiePath: string;
  datalayerMaxToSend: number;
  datalayerVariable?: string;
  eulerianPixelURL: string | null;
  excludeIE: boolean;
  frameworkVersion: string;
  getAlwaysWeborama: boolean | null;
  globalCode: string;
  globalCodeOnDocReady: boolean;
  hashMrasnAllowed: boolean;
  heatmapRight: boolean;
  id: number;
  identifier: string;
  isSecureCookie: boolean;
  jqueryVarName: string | null;
  kruxNamespace: string | null;
  omnitureIntegration?: number;
  oneVisitorOneTest: boolean;
  pack: 'premium' | 'quota';
  quota: number;
  runAsThread: number;
  sessionRecordingRights: boolean;
  storageMode: 'cookies' | 'local';
  tealiumAccountName: string | null;
  tealiumProfileName: string | null;
  toleranceParams: string[];
  toleranceRegex: string | null;
  waitForConsent: {
    data: string | object | null;
    isStrict: boolean;
    campaignRestrictions: {
      test: boolean;
      perso: boolean;
      redirection: boolean;
      aa: boolean;
      patch: boolean;
    };
    mode:
      | 'disabled'
      | 'custom_js'
      | 'specific_cookie'
      | 'any_cookie'
      | 'user_action'
      | 'third_party'
      | 'didomi';
  };
}

// Geolocation Response Type
export interface GeolocResponse {
  accuracy_radius: number;
  city: string;
  city_confidence: number;
  city_id: number;
  country_iso_code: string;
  country_name: string;
  ip_address: string;
  latitude: number;
  least_specific_subdivision: {
    name: string;
    iso_code: string;
  };
  longitude: number;
  most_specific_subdivision: {
    name: string;
    iso_code: string;
  };
  postal_code: string;
  state: string;
  state_iso_code: string;
  time_zone: string;
  weather?: {
    temperature: number;
    main: string;
    description: string;
  };
}

// Campaign Results Type
export interface CampaignResultsType {
  name: string;
  status: string;
  targetings: {
    qaParamaters?: {
      cookie_scope?: {
        conditions: object;
        success: boolean;
      };
      ip_scope?: {
        conditions: object;
        success: boolean;
      };
    };
    segment?: Array<{
      audiencePosition: number;
      audienceName: string;
      conditions: object;
      group: number;
      name: string;
      operator: string;
      success: boolean;
      targeting_type: number;
    }>;
    targetPages?: {
      code_scope?: {
        conditions: object;
        success: boolean;
      };
      selector_scope?: {
        conditions: object;
        success: boolean;
      };
      url_scope?: {
        conditions: object;
        success: boolean;
      };
    };
    trigger?: Array<{
      audiencePosition: number;
      audienceName: string;
      conditions: object;
      group: number;
      name: string;
      operator: string;
      success: boolean;
      targeting_type: number;
    }>;
  };
  type: 'ab' | 'multipage' | 'multivariate' | 'mastersegment' | 'subsegment';
  sub_type?: 'ab' | 'patch' | 'mpt' | 'mvt' | 'sp' | 'mpp' | 'mep';
  additionalType?: 'aa' | 'patch' | 'redirection';
  variationID?: number;
  variationName: string | null;
}

// Campaign Public Type
export interface CampaignPublicType {
  name: string;
  status: 'accepted' | 'accepted_by_redirection';
  targetings: {
    qaParamaters: {
      cookie_scope: {
        conditions: object;
        success: boolean;
      };
      ip_scope: {
        conditions: object;
        success: boolean;
      };
    };
    segment: Array<{
      audiencePosition: number;
      audienceName: string;
      conditions: object;
      group: number;
      name: string;
      operator: string;
      success: boolean;
      targeting_type: number;
    }>;
  };
  testDatas: object;
  type: 'ab' | 'subsegment';
  variationID: number;
  variationName: string;
}

// User Agent Response Type
export interface UAResponse {
  browser: {
    name: string;
    version: string;
  };
  is_bot?: boolean;
  os: {
    name: string;
    version: string;
  };
  type: string;
}

export interface AbandonedCartResponse {
  customerId: string;
  sessionStart: number;
  cartId: string;
  totalProducts: number;
  totalPrice: number;
}

// Main ABTasty Interface
export interface ABTasty {
  // Properties
  accountData: {
    accountSettings: AccountSettings;
    crossDomainSettings: Array<{
      url: string;
      method: 'substring' | 'regex' | 'exact';
      includeOrExeclude: 'include' | 'exclude';
    }>;
    customVariables: Array<{
      action: string;
      category: string;
      method: 'substring' | 'regex' | 'exact';
      url: string;
    }>;
    obsoletes: number[];
    tests: object;
    widgets: object;
  };
  ADBlockEnabled: boolean;
  AdBlockDetectionFailed: boolean;
  appliedPlugins: string[];
  cnilReady: boolean;
  consentReady: boolean;
  datalayerEnabled: boolean;
  eventState: {
    [key: string]: {
      status: 'complete' | 'loading';
      detail?: Record<string, unknown>[];
    };
  };
  pendingRedirection: boolean;
  pendingUAParser: boolean;
  redirectedFrom: {
    testID: number;
    variationID: number;
    previousLogicalView: string;
  };
  results: Record<string, CampaignResultsType>;
  started: boolean;
  temporaryCookieValues: {
    ABTasty: string;
    ABTastySession: string;
  };
  urlHistory: {
    current: string;
    previous: string;
  };
  visitor: {
    id: string;
  };

  // Methods
  clearAllCookies(): void;
  clearCookie(): void;
  clearSessionCookie(): void;
  getAbandonedCart(
    identifier?: string,
    visitorId?: string,
    reset?: boolean,
  ): Promise<AbandonedCartResponse | undefined>;
  getAccountSettings(): AccountSettings;
  getCampaignHistory(): Record<string, number>;
  getGeoloc(): GeolocResponse | null;
  getParsedUserAgent(): UAResponse | undefined;
  getParsedUserAgentAsync(): Promise<UAResponse | undefined>;
  getTestsOnPage(campaign_id?: number): Record<string, CampaignPublicType>;
  hitServiceNotifierSubscribe(
    fn_callback: (eventData: object, eventSettings: object) => void,
    event_type?: string,
    settings?: object,
  ): void;
  hitServiceNotifierUnSubscribe(observerId: number): void;
  TealiumCallback(data: object): void;
  WeboramaCallback(data: object): void;
}
