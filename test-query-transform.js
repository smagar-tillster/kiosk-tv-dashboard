// Test how the query transformation works

const queries = {
  lastFailedOrder: `
      FROM KioskAlertEvent 
      select latest(timestamp), latest(storeName)
      where store_online = 1 and alert_category_name in ('Order', 'CalcTotal') 
      WITH TIMEZONE 'America/Los_Angeles'
      since today until now limit max
    `,
  
  disconnectedKiosks: `
      from SystemSample 
      select uniqueCount(fullHostname) 
      since 1 DAY AGO 
      COMPARE WITH 1 WEEK AGO
    `,
};

function buildNerdGraphQuery(accountId, nrqlQuery) {
  console.log('=== RAW NRQL QUERY ===');
  console.log(nrqlQuery);
  console.log('\n=== ESCAPED QUERY ===');
  
  const escapedQuery = nrqlQuery.replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(escapedQuery);
  
  console.log('\n=== FINAL GRAPHQL ===');
  const graphql = `
    {
      actor {
        account(id: ${accountId}) {
          nrql(query: "${escapedQuery}") {
            results
          }
        }
      }
    }
  `;
  console.log(graphql);
  
  return graphql;
}

console.log('TEST 1: lastFailedOrder');
console.log('========================');
buildNerdGraphQuery('4502664', queries.lastFailedOrder);

console.log('\n\nTEST 2: disconnectedKiosks');
console.log('============================');
buildNerdGraphQuery('4502664', queries.disconnectedKiosks);
