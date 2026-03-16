/**
 * NewRelic Query Definitions
 * All NRQL queries for the dashboard in one place
 */
import { logger } from '@/app/utils';

export const NEWRELIC_QUERIES = (() => {
  // Shared Kiosk-based queries (KioskStatusEvent / KioskAlertEvent)
  const KIOSK = {
    totalStores: `
      from KioskStatusEvent select uniqueCount(storeName) where status in ('OFFLINE','ONLINE') WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    totalKiosks: `
      from KioskStatusEvent select uniqueCount(concat(storeName, kioskName)) where status in ('OFFLINE','ONLINE') WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    storeStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineStores,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineStores
      FROM (
        SELECT latest(status) AS latestStatus 
        FROM KioskStatusEvent 
        FACET storeName limit max 
      ) WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    kioskStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineKiosks,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineKiosks
      FROM (
        SELECT latest(status) AS latestStatus 
        FROM KioskStatusEvent 
        FACET storeName, kioskName limit max 
      ) WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    orderFailureTrend: `
      FROM KioskAlertEvent 
      select count(*) 
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal')
      WITH TIMEZONE 'America/Los_Angeles'
      facet dateOf(timestamp)
      SINCE last week UNTIL now limit max
    `,

    typeOfIssues: `
      FROM KioskAlertEvent 
      select count(*) 
      where alert_level = '1' and store_online = 1 
      facet alert_category_name 
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now limit max
    `,

    orderFailureTypes: `
      FROM KioskAlertEvent select count(*)
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal')
      facet cases(
      where alert_message like '%INSERT%' as 'POS Error', 
      alert_message like '%Could not calculate order due to critical error%' as 'POS Error',
      alert_message like '%ErrorCode: 101%' as 'POS Error', 
      alert_message like '%TERMINAL UPDATE IN PROGRESS%' as 'POS Error',
      alert_message like '%TERMINAL IS NOT CONFIGURED TO SERVE KIOSK%' as 'POS Error',  
      alert_message like '%SOAPFaultException error was: Server was unable to process request%' as 'POS Error',  
      alert_message like '%ErrorCode: 1 Description: Internal result code: 117%' as 'POS Error', 
      alert_message like '%ErrorCode: 2 Description: Internal Service Error%' as 'POS Error',
      alert_message like '%SubtotalMismatchException%' as 'Total mismatch', 
      alert_message like '%SocketTimeoutException%' as 'Network Connection Timeout', 
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
      alert_message like '%INVALID COUPON - AMOUNT%' as 'Coupon configuration error',
      alert_message like '%Attribute name "amount"%' as 'Coupon configuration error',
      alert_message like '%INVALID COUPON%' as 'Coupon configuration error',
      alert_message like '%' as 'Unclassified')
      WITH TIMEZONE 'America/Los_Angeles'
      since last week until now limit max
    `,

    orderFailureTypesToday: `
      FROM KioskAlertEvent select count(*)
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal')
      facet cases(
      alert_message like '%INSERT%' as 'POS Error', 
      alert_message like '%Could not calculate order due to critical error%' as 'POS Error',
      alert_message like '%ErrorCode: 101%' as 'POS Error', 
      alert_message like '%TERMINAL UPDATE IN PROGRESS%' as 'POS Error',
      alert_message like '%TERMINAL IS NOT CONFIGURED TO SERVE KIOSK%' as 'POS Error',  
      alert_message like '%SOAPFaultException error was: Server was unable to process request%' as 'POS Error',  
      alert_message like '%ErrorCode: 1 Description: Internal result code: 117%' as 'POS Error', 
      alert_message like '%ErrorCode: 2 Description: Internal Service Error%' as 'POS Error',
      alert_message like '%SubtotalMismatchException%' as 'Total mismatch', 
      alert_message like '%SocketTimeoutException%' as 'Network Connection Timeout', 
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
      alert_message like '%INVALID COUPON - AMOUNT%' as 'Coupon configuration error',
      alert_message like '%Attribute name "amount"%' as 'Coupon configuration error',
      alert_message like '%INVALID COUPON%' as 'Coupon configuration error',
      alert_message like '%' as 'Unclassified')
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now limit max
    `,

    alertHeatmap: `
      FROM KioskAlertEvent 
      select count(*) as 'Alerts' 
      where store_online = 1 
      and alert_category_name in ('Order', 'CalcTotal') 
      and alert_level = '1' 
      WITH TIMEZONE 'America/Los_Angeles'
      SINCE today until now
      FACET city, state 
      LIMIT MAX
    `,

    kioskLocations: `
      SELECT latest(status) as status, latest(city) as city, latest(state) as state
      FROM KioskStatusEvent
      FACET storeName, kioskName
      WITH TIMEZONE 'America/Los_Angeles'
      SINCE 1 hour ago 
      LIMIT MAX
    `,

    orderFailureByPOS: `
      FROM KioskAlertEvent 
      select count(*) 
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      facet pos_make 
      WITH TIMEZONE 'America/Los_Angeles'
      since last week until now
      limit max
    `,

    disconnectedKiosks: `
      from SystemSample 
      select uniqueCount(fullHostname) 
      since 1 DAY AGO 
      COMPARE WITH 1 WEEK AGO
    `,

    lastFailedOrder: `
      FROM KioskAlertEvent 
      select latest(timestamp), latest(storeName)
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now limit max
    `,
  };

  // Shared Log-based queries (Log events for KFC tenants)
  const LOG = {
    totalStores: `
      from Log select uniqueCount(ks.StoreName) WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    totalKiosks: `
      from Log select uniqueCount(concat(ks.StoreName,ks.KioskName))  WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    storeStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineStores,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineStores
      FROM (
        SELECT latest(ks.KioskStatus) AS latestStatus 
        FROM Log 
        FACET ks.StoreName limit max 
      ) WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max 
    `,

    kioskStatus: `
      SELECT 
        filter(count(*), WHERE latestStatus = 'ONLINE') AS onlineKiosks,
        filter(count(*), WHERE latestStatus = 'OFFLINE') AS offlineKiosks
      FROM (
        SELECT latest(ks.KioskStatus) AS latestStatus 
        FROM Log 
        FACET ks.StoreName, ks.KioskName limit max 
      ) WITH TIMEZONE 'America/Los_Angeles' since 1 hour ago limit max
    `,

    orderFailureTrend: `
      FROM Log 
      select count(*) 
      where (ks.AlertCategoryName in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') or ks.AlertCategory in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL')) and
      (ks.AlertLevelName = 'Error' or ks.AlertLevel = 'Error')
      WITH TIMEZONE 'America/Los_Angeles'
      facet dateOf(timestamp)
      SINCE last week UNTIL now limit max
    `,

    typeOfIssues: `
      FROM Log 
      select count(*) 
      where ks.AlertLevelName = 'Error'  or ks.AlertLevel = 'Error'
      facet ks.AlertCategoryName OR ks.AlertCategory 
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now limit max
    `,

    orderFailureTypes: `
      FROM Log 
      select count(*) 
      where ks.AlertCategoryName in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') or ks.AlertCategory in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL')
      facet cases(
        ks.AlertMessage like '%INSERT%' as 'POS Error', 
        ks.AlertMessage like '%TERMINAL UPDATE IN PROGRESS%' as 'POS Error',
        ks.AlertMessage like '%TERMINAL IS NOT CONFIGURED%' as 'POS Error',  
        ks.AlertMessage like '%Employee is not logged in%' as 'POS Error',
        ks.AlertMessage like '%SOAPFaultException error was: Server was unable to process request%' as 'POS Error',  
        ks.AlertMessage like '%ErrorCode: 1 Description: Internal result code: 117%' as 'POS Error', 
        ks.AlertMessage like '%ErrorCode: 2 Description: Internal Service Error%' as 'POS Error',
        ks.AlertMessage like '%Property is not available%' as 'POS Error',
        ks.AlertMessage like '%Employee Object Number % is in training mode, operation not allowed%' as 'POS Error',
        ks.AlertMessage like '%Menu item definition not found for MenuItem%' as 'POS Error',
        ks.AlertMessage like '%Service Timeout Detail: The service timed out waiting for the request to be processed%' as 'POS Error',
        ks.AlertMessage like '%SubtotalMismatchException%' as 'Total mismatch',
        ks.AlertMessage like '%ORDER SUBTOTAL DOES MATCH SICOM%' as 'Total mismatch',  
        ks.AlertMessage like '%SocketTimeoutException%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%ErrorCode: 101%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%encountered Read timed out%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%Connection timed out%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%Place order failed - 0%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%java.net.SocketException: Connection%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%ConnectException: Connection %' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%java.net.UnknownHostException%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%No route to host%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%Connection reset%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%PLU IS INACTIVE Expected: 30000026%' as 'Donation-plu exception',
        ks.AlertMessage like '%SKUMapException%' as 'Skumap Error', 
        ks.AlertMessage like '%NullPointerException error was: null -> Triggered at com.tillster.kiosk.skumapper.SkuNode.<init>%' as 'Skumap Error', 
        ks.AlertMessage like '%ErrorCode: 109%' as 'Item out of stock or inactive', 
        ks.AlertMessage like '%Failed to get modifier group id of modifier%' as 'Item out of stock or inactive', 
        ks.AlertMessage like '%Failed to get component id%' as 'Item out of stock or inactive', 
        ks.AlertMessage like '%INVALID ORDER ITEM - PLU IS INACTIVE%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%Item unavailable%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%Cannot be ordered : Out of MenuItem%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%menu_item_availability_insufficient%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%INVALID COUPON - AMOUNT%' as 'Coupon configuration error',
        ks.AlertMessage like '%Attribute name "amount"%' as 'Coupon configuration error',
        ks.AlertMessage like '%INVALID COUPON%' as 'Coupon configuration error',
        ks.AlertMessage like '%INVALID ORDER VALUE MEAL%' as 'Bad Order Payload',
        ks.AlertMessage like '%Modifier requirements not met%' as 'Bad Order Payload',
        ks.AlertMessage like '%check_calculator_internal_error, message=Value cannot be null%' as 'Bad Order Payload',
        ks.AlertMessage like '%Order number is invalid%' as 'Bad Order Payload',
        ks.AlertMessage like '%INVALID ORDER TAX%' as 'Bad Order Payload',
        ks.AlertMessage like '%ORDER SUBTOTAL DOES MATCH%' as 'Bad Order Payload',
        ks.AlertMessage like '%After apply payments, there is a pending balance%' as 'Bad Order Payload',
        ks.AlertMessage like '%' as 'Other'
      ) 
      WITH TIMEZONE 'America/Los_Angeles'
      since last week until now 
      limit max
    `,

    alertHeatmap: `
      FROM Log 
      select count(*) as 'Alerts' 
      where (ks.AlertCategoryName in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') or ks.AlertCategory in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL')) and 
      (ks.AlertLevelName = 'Error' or ks.AlertLevel = 'Error')
      WITH TIMEZONE 'America/Los_Angeles'
      SINCE today until now 
      FACET city, state 
      LIMIT MAX
    `,

    kioskLocations: `
      SELECT latest(status) as status, latest(city) as city, latest(state) as state
      FROM KioskStatusEvent
      FACET storeName, kioskName
      WITH TIMEZONE 'America/Los_Angeles'
      SINCE 1 hour ago 
      LIMIT MAX
    `,

    orderFailureByPOS: `
      FROM Log 
      select count(*) 
      where ks.AlertCategoryName in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') or ks.AlertCategory in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL')
      facet pos 
      WITH TIMEZONE 'America/Los_Angeles'
      SINCE last week until now
      limit max
    `,

    orderFailureTypesToday: `
      FROM Log 
      select count(*) 
      where ks.AlertCategoryName in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') or ks.AlertCategory in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL')
      facet cases(
        ks.AlertMessage like '%INSERT%' as 'POS Error', 
        ks.AlertMessage like '%TERMINAL UPDATE IN PROGRESS%' as 'POS Error',
        ks.AlertMessage like '%TERMINAL IS NOT CONFIGURED%' as 'POS Error',  
        ks.AlertMessage like '%Employee is not logged in%' as 'POS Error',
        ks.AlertMessage like '%SOAPFaultException error was: Server was unable to process request%' as 'POS Error',  
        ks.AlertMessage like '%ErrorCode: 1 Description: Internal result code: 117%' as 'POS Error', 
        ks.AlertMessage like '%ErrorCode: 2 Description: Internal Service Error%' as 'POS Error',
        ks.AlertMessage like '%Property is not available%' as 'POS Error',
        ks.AlertMessage like '%Employee Object Number % is in training mode, operation not allowed%' as 'POS Error',
        ks.AlertMessage like '%Menu item definition not found for MenuItem%' as 'POS Error',
        ks.AlertMessage like '%Service Timeout Detail: The service timed out waiting for the request to be processed%' as 'POS Error',
        ks.AlertMessage like '%SubtotalMismatchException%' as 'Total mismatch',
        ks.AlertMessage like '%ORDER SUBTOTAL DOES MATCH SICOM%' as 'Total mismatch',  
        ks.AlertMessage like '%SocketTimeoutException%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%ErrorCode: 101%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%encountered Read timed out%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%Connection timed out%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%Place order failed - 0%' as 'Network Connection Timeout', 
        ks.AlertMessage like '%java.net.SocketException: Connection%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%ConnectException: Connection %' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%java.net.UnknownHostException%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%No route to host%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%Connection reset%' as 'Network Issues (Connection refused/reset)',
        ks.AlertMessage like '%PLU IS INACTIVE Expected: 30000026%' as 'Donation-plu exception',
        ks.AlertMessage like '%SKUMapException%' as 'Skumap Error', 
        ks.AlertMessage like '%NullPointerException error was: null -> Triggered at com.tillster.kiosk.skumapper.SkuNode.<init>%' as 'Skumap Error', 
        ks.AlertMessage like '%ErrorCode: 109%' as 'Item out of stock or inactive', 
        ks.AlertMessage like '%Failed to get modifier group id of modifier%' as 'Item out of stock or inactive', 
        ks.AlertMessage like '%Failed to get component id%' as 'Item out of stock or inactive', 
        ks.AlertMessage like '%INVALID ORDER ITEM - PLU IS INACTIVE%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%Item unavailable%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%Cannot be ordered : Out of MenuItem%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%menu_item_availability_insufficient%' as 'Item out of stock or inactive',
        ks.AlertMessage like '%INVALID COUPON - AMOUNT%' as 'Coupon configuration error',
        ks.AlertMessage like '%Attribute name "amount"%' as 'Coupon configuration error',
        ks.AlertMessage like '%INVALID COUPON%' as 'Coupon configuration error',
        ks.AlertMessage like '%INVALID ORDER VALUE MEAL%' as 'Bad Order Payload',
        ks.AlertMessage like '%Modifier requirements not met%' as 'Bad Order Payload',
        ks.AlertMessage like '%check_calculator_internal_error, message=Value cannot be null%' as 'Bad Order Payload',
        ks.AlertMessage like '%Order number is invalid%' as 'Bad Order Payload',
        ks.AlertMessage like '%INVALID ORDER TAX%' as 'Bad Order Payload',
        ks.AlertMessage like '%ORDER SUBTOTAL DOES MATCH%' as 'Bad Order Payload',
        ks.AlertMessage like '%After apply payments, there is a pending balance%' as 'Bad Order Payload',
        ks.AlertMessage like '%' as 'Other'
      ) 
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now 
      limit max
    `,

    disconnectedKiosks: `
      from SystemSample 
      select uniqueCount(fullHostname) 
      since 1 DAY AGO 
      COMPARE WITH 1 WEEK AGO
    `,

    lastFailedOrder: `
      FROM Log 
      select latest(timestamp), latest(ks.StoreName)
      where ks.AlertCategoryName in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') or ks.AlertCategory in ('Order', 'CalcTotal', 'ORDER', 'CALCULATE_TOTAL') 
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now limit max
    `,
  };

  // Map tenants to the shared query sets, with per-tenant overrides if needed
  return {
    BKUS: { ...KIOSK },
    PLKUS: { ...KIOSK },
    KFCGT: { ...LOG },
    KFCMX: { ...LOG },
  };
})();

/**
 * Build GraphQL query for NewRelic NerdGraph API
 */
export function buildNerdGraphQuery(accountId: string, nrqlQuery: string, tenant?: 'BKUS' | 'PLKUS' | 'KFCGT' | 'KFCMX'): string {
  // Hardcode account IDs if empty (fallback for environment variable issues)
  // BKUS: 4502664, PLKUS: 4817770
  let finalAccountId = accountId;
  if (!accountId || accountId === '') {
    if (tenant === 'PLKUS') {
      finalAccountId = '4817770';
      logger.warn('[buildNerdGraphQuery] Empty accountId, using PLKUS: 4817770');
    } else {
      finalAccountId = '4502664';
      logger.warn('[buildNerdGraphQuery] Empty accountId, using BKUS: 4502664');
    }
  }
  
  logger.debug('[buildNerdGraphQuery] Using Account ID:', finalAccountId, 'for tenant:', tenant || 'unknown');
  
  const escapedQuery = nrqlQuery.replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  const graphqlQuery = `
    {
      actor {
        account(id: ${finalAccountId}) {
          nrql(query: "${escapedQuery}") {
            results
          }
        }
      }
    }
  `;
  
  return graphqlQuery;
}
