/**
 * Major US Cities Coordinates Database
 * Comprehensive list of city coordinates for mapping kiosk locations
 */

export const usCitiesCoordinates: Record<string, { lat: number; lng: number }> = {
  // Note: Keys are in format "City, State" (both lowercase for case-insensitive matching)
  
  // Major cities across all states - this is a starter set
  // Add more cities as needed from your actual kiosk data
  
  // Alabama
  'birmingham, al': { lat: 33.5207, lng: -86.8025 },
  'montgomery, al': { lat: 32.3668, lng: -86.3000 },
  'mobile, al': { lat: 30.6954, lng: -88.0399 },
  
  // Arizona
  'phoenix, az': { lat: 33.4484, lng: -112.0740 },
  'tucson, az': { lat: 32.2226, lng: -110.9747 },
  'mesa, az': { lat: 33.4152, lng: -111.8315 },
  
  // Arkansas
  'little rock, ar': { lat: 34.7465, lng: -92.2896 },
  
  // California
  'los angeles, ca': { lat: 34.0522, lng: -118.2437 },
  'san diego, ca': { lat: 32.7157, lng: -117.1611 },
  'san francisco, ca': { lat: 37.7749, lng: -122.4194 },
  'sacramento, ca': { lat: 38.5816, lng: -121.4944 },
  'fresno, ca': { lat: 36.7378, lng: -119.7871 },
  'oakland, ca': { lat: 37.8044, lng: -122.2712 },
  'san jose, ca': { lat: 37.3382, lng: -121.8863 },
  
  // Colorado
  'denver, co': { lat: 39.7392, lng: -104.9903 },
  'colorado springs, co': { lat: 38.8339, lng: -104.8214 },
  
  // Connecticut
  'hartford, ct': { lat: 41.7658, lng: -72.6734 },
  
  // Delaware
  'wilmington, de': { lat: 39.7391, lng: -75.5398 },
  
  // Florida
  'miami, fl': { lat: 25.7617, lng: -80.1918 },
  'tampa, fl': { lat: 27.9506, lng: -82.4572 },
  'orlando, fl': { lat: 28.5383, lng: -81.3792 },
  'jacksonville, fl': { lat: 30.3322, lng: -81.6557 },
  'tallahassee, fl': { lat: 30.4383, lng: -84.2807 },
  
  // Georgia
  'atlanta, ga': { lat: 33.7490, lng: -84.3880 },
  'savannah, ga': { lat: 32.0809, lng: -81.0912 },
  
  // Illinois
  'chicago, il': { lat: 41.8781, lng: -87.6298 },
  'springfield, il': { lat: 39.7817, lng: -89.6501 },
  
  // Indiana
  'indianapolis, in': { lat: 39.7684, lng: -86.1581 },
  
  // Iowa
  'des moines, ia': { lat: 41.5868, lng: -93.6250 },
  
  // Kansas
  'wichita, ks': { lat: 37.6872, lng: -97.3301 },
  
  // Kentucky
  'louisville, ky': { lat: 38.2527, lng: -85.7585 },
  
  // Louisiana
  'new orleans, la': { lat: 29.9511, lng: -90.0715 },
  'baton rouge, la': { lat: 30.4515, lng: -91.1871 },
  
  // Maryland
  'baltimore, md': { lat: 39.2904, lng: -76.6122 },
  
  // Massachusetts
  'boston, ma': { lat: 42.3601, lng: -71.0589 },
  
  // Michigan
  'detroit, mi': { lat: 42.3314, lng: -83.0458 },
  
  // Minnesota
  'minneapolis, mn': { lat: 44.9778, lng: -93.2650 },
  
  // Mississippi
  'jackson, ms': { lat: 32.2988, lng: -90.1848 },
  
  // Missouri
  'kansas city, mo': { lat: 39.0997, lng: -94.5786 },
  'st louis, mo': { lat: 38.6270, lng: -90.1994 },
  
  // Nevada
  'las vegas, nv': { lat: 36.1699, lng: -115.1398 },
  
  // New Jersey
  'newark, nj': { lat: 40.7357, lng: -74.1724 },
  
  // New Mexico
  'albuquerque, nm': { lat: 35.0844, lng: -106.6504 },
  
  // New York
  'new york, ny': { lat: 40.7128, lng: -74.0060 },
  'buffalo, ny': { lat: 42.8864, lng: -78.8784 },
  'rochester, ny': { lat: 43.1566, lng: -77.6088 },
  
  // North Carolina
  'charlotte, nc': { lat: 35.2271, lng: -80.8431 },
  'raleigh, nc': { lat: 35.7796, lng: -78.6382 },
  
  // Ohio
  'columbus, oh': { lat: 39.9612, lng: -82.9988 },
  'cleveland, oh': { lat: 41.4993, lng: -81.6944 },
  'cincinnati, oh': { lat: 39.1031, lng: -84.5120 },
  
  // Oklahoma
  'oklahoma city, ok': { lat: 35.4676, lng: -97.5164 },
  
  // Oregon
  'portland, or': { lat: 45.5152, lng: -122.6784 },
  
  // Pennsylvania
  'philadelphia, pa': { lat: 39.9526, lng: -75.1652 },
  'pittsburgh, pa': { lat: 40.4406, lng: -79.9959 },
  
  // South Carolina
  'columbia, sc': { lat: 34.0007, lng: -81.0348 },
  
  // Tennessee
  'nashville, tn': { lat: 36.1627, lng: -86.7816 },
  'memphis, tn': { lat: 35.1495, lng: -90.0490 },
  
  // Texas
  'houston, tx': { lat: 29.7604, lng: -95.3698 },
  'dallas, tx': { lat: 32.7767, lng: -96.7970 },
  'austin, tx': { lat: 30.2672, lng: -97.7431 },
  'san antonio, tx': { lat: 29.4241, lng: -98.4936 },
  'fort worth, tx': { lat: 32.7555, lng: -97.3308 },
  
  // Utah
  'salt lake city, ut': { lat: 40.7608, lng: -111.8910 },
  
  // Virginia
  'richmond, va': { lat: 37.5407, lng: -77.4360 },
  'virginia beach, va': { lat: 36.8529, lng: -75.9780 },
  
  // Washington
  'seattle, wa': { lat: 47.6062, lng: -122.3321 },
  
  // Wisconsin
  'milwaukee, wi': { lat: 43.0389, lng: -87.9065 },
};
