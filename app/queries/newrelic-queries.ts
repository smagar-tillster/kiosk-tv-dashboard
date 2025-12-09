/**
 * NewRelic Query Definitions
 * All NRQL queries for the dashboard in one place
 */

export const NEWRELIC_QUERIES = {
  // BK-US Queries
  BKUS: {
    // Total Stores Count
    totalStores: `
      from SystemSample 
      select uniqueCount(substring(fullHostname, 1, length(fullHostname) - 2)) as 'stores' 
      since 1 month ago
    `,
    
    // Total Kiosks Count
    totalKiosks: `
      from SystemSample 
      select uniqueCount(fullHostname) as 'kiosks' 
      since 1 month ago
    `,
    
    // Online and Offline Stores
    storeStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineStores,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineStores
      FROM (
        SELECT latest(status) AS latestStatus 
        FROM KioskStatusEvent 
        FACET storeName limit max 
      ) since 1 hour ago limit max
    `,
    
    // Online and Offline Kiosks
    kioskStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineKiosks,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineKiosks
      FROM (
        SELECT latest(status) AS latestStatus 
        FROM KioskStatusEvent 
        FACET storeName, kioskName limit max 
      ) since 1 hour ago limit max
    `,

    // Order Failure Trend (Line Chart)
    // Use timeseries with UNTIL NOW to get consistent daily buckets aligned to midnight UTC
    orderFailureTrend: `
      FROM KioskAlertEvent 
      select count(*) 
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      timeseries 1 day since 7 days ago until now limit max
    `,

    // Type of Issues (Heatmap/Bubble Map)
    typeOfIssues: `
      FROM KioskAlertEvent 
      select count(*) 
      where alert_level = '1' and store_online = 1 
      facet alert_category_name 
      since 1 day ago
    `,

    // Order Failure Types (Bar Chart)
    orderFailureTypes: `
      FROM KioskAlertEvent 
      select count(*) 
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      facet cases(
        where alert_message like '%INSERT%' as 'POS Error', 
        alert_message like '%TERMINAL UPDATE IN PROGRESS%' as 'POS Error',
        alert_message like '%TERMINAL IS NOT CONFIGURED%' as 'POS Error',  
        alert_message like '%Employee is not logged in%' as 'POS Error',
        alert_message like '%SOAPFaultException error was: Server was unable to process request%' as 'POS Error',  
        alert_message like '%ErrorCode: 1 Description: Internal result code: 117%' as 'POS Error', 
        alert_message like '%ErrorCode: 2 Description: Internal Service Error%' as 'POS Error',
        alert_message like '%Property is not available%' as 'POS Error',
        alert_message like '%Employee Object Number % is in training mode, operation not allowed%' as 'POS Error',
        alert_message like '%Menu item definition not found for MenuItem%' as 'POS Error',
        alert_message like '%Service Timeout Detail: The service timed out waiting for the request to be processed%' as 'POS Error',
        alert_message like '%SubtotalMismatchException%' as 'Total mismatch',
        alert_message like '%ORDER SUBTOTAL DOES MATCH SICOM%' as 'Total mismatch',  
        alert_message like '%SocketTimeoutException%' as 'Network Connection Timeout', 
        alert_message like '%ErrorCode: 101%' as 'Network Connection Timeout', 
        alert_message like '%encountered Read timed out%' as 'Network Connection Timeout', 
        alert_message like '%Connection timed out%' as 'Network Connection Timeout', 
        alert_message like '%Place order failed - 0%' as 'Network Connection Timeout', 
        alert_message like '%java.net.SocketException: Connection%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%ConnectException: Connection %' as 'Network Issues (Connection refused/reset)',
        alert_message like '%java.net.UnknownHostException%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%No route to host%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%Connection reset%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%PLU IS INACTIVE Expected: 30000026%' as 'Donation-plu exception',
        alert_message like '%SKUMapException%' as 'Skumap Error', 
        alert_message like '%NullPointerException error was: null -> Triggered at com.tillster.kiosk.skumapper.SkuNode.<init>%' as 'Skumap Error', 
        alert_message like '%ErrorCode: 109%' as 'Item out of stock or inactive', 
        alert_message like '%Failed to get modifier group id of modifier%' as 'Item out of stock or inactive', 
        alert_message like '%Failed to get component id%' as 'Item out of stock or inactive', 
        alert_message like '%INVALID ORDER ITEM - PLU IS INACTIVE%' as 'Item out of stock or inactive',
        alert_message like '%Item unavailable%' as 'Item out of stock or inactive',
        alert_message like '%Cannot be ordered : Out of MenuItem%' as 'Item out of stock or inactive',
        alert_message like '%menu_item_availability_insufficient%' as 'Item out of stock or inactive',
        alert_message like '%INVALID COUPON - AMOUNT%' as 'Coupon configuration error',
        alert_message like '%Attribute name "amount"%' as 'Coupon configuration error',
        alert_message like '%INVALID COUPON%' as 'Coupon configuration error',
        alert_message like '%INVALID ORDER VALUE MEAL%' as 'Bad Order Payload',
        alert_message like '%Modifier requirements not met%' as 'Bad Order Payload',
        alert_message like '%check_calculator_internal_error, message=Value cannot be null%' as 'Bad Order Payload',
        alert_message like '%Order number is invalid%' as 'Bad Order Payload',
        alert_message like '%INVALID ORDER TAX%' as 'Bad Order Payload',
        alert_message like '%ORDER SUBTOTAL DOES MATCH%' as 'Bad Order Payload',
        alert_message like '%After apply payments, there is a pending balance%' as 'Bad Order Payload',
        alert_message like '%' as 'Other'
      ) 
      since 1 week ago limit max
    `,

    // US Map Alert Heatmap
    alertHeatmap: `
      FROM KioskAlertEvent 
      select count(*) as 'Alerts' 
      where store_online = 1 
      and alert_category_name in ('Order', 'CalcTotal') 
      and alert_level = '1' 
      SINCE 1 day ago 
      FACET city, state 
      LIMIT MAX
    `,

    // Individual Kiosk Locations with Status
    kioskLocations: `
      SELECT latest(status) as status, latest(city) as city, latest(state) as state
      FROM KioskStatusEvent
      FACET storeName, kioskName
      SINCE 1 hours ago 
      LIMIT MAX
    `,
  },

  // PLK-US Queries
  PLKUS: {
    // Total Stores Count
    totalStores: `
      from SystemSample 
      select uniqueCount(substring(fullHostname, 1, length(fullHostname) - 2)) as 'stores' 
      since 1 month ago
    `,
    
    // Total Kiosks Count
    totalKiosks: `
      from SystemSample 
      select uniqueCount(fullHostname) as 'kiosks' 
      since 1 month ago
    `,
    
    // Online and Offline Stores
    storeStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineStores,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineStores
      FROM (
        SELECT latest(status) AS latestStatus 
        FROM KioskStatusEvent 
        FACET storeName limit max 
      ) since 1 hour ago limit max
    `,
    
    // Online and Offline Kiosks
    kioskStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineKiosks,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineKiosks
      FROM (
        SELECT latest(status) AS latestStatus 
        FROM KioskStatusEvent 
        FACET storeName, kioskName limit max 
      ) since 1 hour ago limit max
    `,

    // Order Failure Trend (Line Chart)
    // Use timeseries with UNTIL NOW to get consistent daily buckets aligned to midnight UTC
    orderFailureTrend: `
      FROM KioskAlertEvent 
      select count(*) 
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      timeseries 1 day since 7 days ago until now limit max
    `,

    // Type of Issues (Heatmap/Bubble Map)
    typeOfIssues: `
      FROM KioskAlertEvent 
      select count(*) 
      where alert_level = '1' and store_online = 1 
      facet alert_category_name 
      since 1 day ago
    `,

    // Order Failure Types (Bar Chart)
    orderFailureTypes: `
      FROM KioskAlertEvent 
      select count(*) 
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      facet cases(
        where alert_message like '%INSERT%' as 'POS Error', 
        alert_message like '%TERMINAL UPDATE IN PROGRESS%' as 'POS Error',
        alert_message like '%TERMINAL IS NOT CONFIGURED%' as 'POS Error',  
        alert_message like '%Employee is not logged in%' as 'POS Error',
        alert_message like '%SOAPFaultException error was: Server was unable to process request%' as 'POS Error',  
        alert_message like '%ErrorCode: 1 Description: Internal result code: 117%' as 'POS Error', 
        alert_message like '%ErrorCode: 2 Description: Internal Service Error%' as 'POS Error',
        alert_message like '%Property is not available%' as 'POS Error',
        alert_message like '%Employee Object Number % is in training mode, operation not allowed%' as 'POS Error',
        alert_message like '%Menu item definition not found for MenuItem%' as 'POS Error',
        alert_message like '%Service Timeout Detail: The service timed out waiting for the request to be processed%' as 'POS Error',
        alert_message like '%SubtotalMismatchException%' as 'Total mismatch',
        alert_message like '%ORDER SUBTOTAL DOES MATCH SICOM%' as 'Total mismatch',  
        alert_message like '%SocketTimeoutException%' as 'Network Connection Timeout', 
        alert_message like '%ErrorCode: 101%' as 'Network Connection Timeout', 
        alert_message like '%encountered Read timed out%' as 'Network Connection Timeout', 
        alert_message like '%Connection timed out%' as 'Network Connection Timeout', 
        alert_message like '%Place order failed - 0%' as 'Network Connection Timeout', 
        alert_message like '%java.net.SocketException: Connection%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%ConnectException: Connection %' as 'Network Issues (Connection refused/reset)',
        alert_message like '%java.net.UnknownHostException%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%No route to host%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%Connection reset%' as 'Network Issues (Connection refused/reset)',
        alert_message like '%PLU IS INACTIVE Expected: 30000026%' as 'Donation-plu exception',
        alert_message like '%SKUMapException%' as 'Skumap Error', 
        alert_message like '%NullPointerException error was: null -> Triggered at com.tillster.kiosk.skumapper.SkuNode.<init>%' as 'Skumap Error', 
        alert_message like '%ErrorCode: 109%' as 'Item out of stock or inactive', 
        alert_message like '%Failed to get modifier group id of modifier%' as 'Item out of stock or inactive', 
        alert_message like '%Failed to get component id%' as 'Item out of stock or inactive', 
        alert_message like '%INVALID ORDER ITEM - PLU IS INACTIVE%' as 'Item out of stock or inactive',
        alert_message like '%Item unavailable%' as 'Item out of stock or inactive',
        alert_message like '%Cannot be ordered : Out of MenuItem%' as 'Item out of stock or inactive',
        alert_message like '%menu_item_availability_insufficient%' as 'Item out of stock or inactive',
        alert_message like '%INVALID COUPON - AMOUNT%' as 'Coupon configuration error',
        alert_message like '%Attribute name "amount"%' as 'Coupon configuration error',
        alert_message like '%INVALID COUPON%' as 'Coupon configuration error',
        alert_message like '%INVALID ORDER VALUE MEAL%' as 'Bad Order Payload',
        alert_message like '%Modifier requirements not met%' as 'Bad Order Payload',
        alert_message like '%check_calculator_internal_error, message=Value cannot be null%' as 'Bad Order Payload',
        alert_message like '%Order number is invalid%' as 'Bad Order Payload',
        alert_message like '%INVALID ORDER TAX%' as 'Bad Order Payload',
        alert_message like '%ORDER SUBTOTAL DOES MATCH%' as 'Bad Order Payload',
        alert_message like '%After apply payments, there is a pending balance%' as 'Bad Order Payload',
        alert_message like '%' as 'Other'
      ) 
      since 1 week ago limit max
    `,

    // US Map Alert Heatmap
    alertHeatmap: `
      FROM KioskAlertEvent 
      select count(*) as 'Alerts' 
      where store_online = 1 
      and alert_category_name in ('Order', 'CalcTotal') 
      and alert_level = '1' 
      SINCE 1 day ago 
      FACET city, state 
      LIMIT MAX
    `,

    // Individual Kiosk Locations with Status
    kioskLocations: `
      SELECT latest(status) as status, latest(city) as city, latest(state) as state
      FROM KioskStatusEvent
      FACET storeName, kioskName
      SINCE 1 hours ago 
      LIMIT MAX
    `,
  },
};

/**
 * Build GraphQL query for NewRelic NerdGraph API
 */
export function buildNerdGraphQuery(accountId: string, nrqlQuery: string): string {
  return `
    {
      actor {
        account(id: ${accountId}) {
          nrql(query: "${nrqlQuery.replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}") {
            results
          }
        }
      }
    }
  `;
}
