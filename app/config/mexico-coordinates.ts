/**
 * Mexico city and state coordinates configuration
 * Used for displaying alerts on the Mexico map
 */

/**
 * Mexico State center coordinates
 */
export const mexicoStateCoordinates: Record<string, { lat: number; lng: number }> = {
  'Aguascalientes': { lat: 21.8853, lng: -102.2916 },
  'Baja California': { lat: 30.8406, lng: -115.2838 },
  'Baja California Sur': { lat: 26.0444, lng: -111.6660 },
  'Campeche': { lat: 19.8301, lng: -90.5349 },
  'Chiapas': { lat: 16.7569, lng: -93.1292 },
  'Chihuahua': { lat: 28.6330, lng: -106.0691 },
  'Coahuila': { lat: 27.0587, lng: -101.7068 },
  'Colima': { lat: 19.2452, lng: -103.7240 },
  'Durango': { lat: 24.5594, lng: -104.6591 },
  'Guanajuato': { lat: 21.0190, lng: -101.2574 },
  'Guerrero': { lat: 17.4392, lng: -99.5451 },
  'Hidalgo': { lat: 20.0911, lng: -98.7624 },
  'Jalisco': { lat: 20.6595, lng: -103.3494 },
  'México': { lat: 19.2464, lng: -99.1013 },
  'Michoacán': { lat: 19.5665, lng: -101.7068 },
  'Morelos': { lat: 18.6813, lng: -99.1013 },
  'Nayarit': { lat: 21.7514, lng: -104.8455 },
  'Nuevo León': { lat: 25.5922, lng: -99.9962 },
  'Oaxaca': { lat: 17.0732, lng: -96.7266 },
  'Puebla': { lat: 19.0414, lng: -98.2063 },
  'Querétaro': { lat: 20.5888, lng: -100.3899 },
  'Quintana Roo': { lat: 19.1817, lng: -88.4791 },
  'San Luis Potosí': { lat: 22.1565, lng: -100.9855 },
  'Sinaloa': { lat: 25.1721, lng: -107.4795 },
  'Sonora': { lat: 29.2972, lng: -110.3309 },
  'Tabasco': { lat: 17.8409, lng: -92.6189 },
  'Tamaulipas': { lat: 24.2669, lng: -98.8363 },
  'Tlaxcala': { lat: 19.3182, lng: -98.2375 },
  'Veracruz': { lat: 19.1738, lng: -96.1342 },
  'Yucatán': { lat: 20.7099, lng: -89.0943 },
  'Zacatecas': { lat: 22.7709, lng: -102.5832 },
  'Ciudad de México': { lat: 19.4326, lng: -99.1332 },
};

/**
 * Major Mexico cities coordinates
 */
export const mexicoCityCoordinates: Record<string, { lat: number; lng: number; state: string }> = {
  // Ciudad de México
  'Mexico City': { lat: 19.4326, lng: -99.1332, state: 'Ciudad de México' },
  'Ciudad de México': { lat: 19.4326, lng: -99.1332, state: 'Ciudad de México' },
  
  // Jalisco
  'Guadalajara': { lat: 20.6597, lng: -103.3496, state: 'Jalisco' },
  'Zapopan': { lat: 20.7214, lng: -103.3918, state: 'Jalisco' },
  'Tlaquepaque': { lat: 20.6406, lng: -103.3117, state: 'Jalisco' },
  
  // Nuevo León
  'Monterrey': { lat: 25.6866, lng: -100.3161, state: 'Nuevo León' },
  'San Pedro Garza García': { lat: 25.6667, lng: -100.4000, state: 'Nuevo León' },
  'Guadalupe': { lat: 25.6767, lng: -100.2597, state: 'Nuevo León' },
  
  // Puebla
  'Puebla': { lat: 19.0414, lng: -98.2063, state: 'Puebla' },
  
  // Guanajuato
  'León': { lat: 21.1236, lng: -101.6828, state: 'Guanajuato' },
  'Guanajuato': { lat: 21.0190, lng: -101.2574, state: 'Guanajuato' },
  
  // Querétaro
  'Querétaro': { lat: 20.5888, lng: -100.3899, state: 'Querétaro' },
  
  // Yucatán
  'Mérida': { lat: 20.9674, lng: -89.5926, state: 'Yucatán' },
  
  // Quintana Roo
  'Cancún': { lat: 21.1619, lng: -86.8515, state: 'Quintana Roo' },
  'Playa del Carmen': { lat: 20.6296, lng: -87.0739, state: 'Quintana Roo' },
  
  // Veracruz
  'Veracruz': { lat: 19.1738, lng: -96.1342, state: 'Veracruz' },
  
  // Chihuahua
  'Chihuahua': { lat: 28.6353, lng: -106.0889, state: 'Chihuahua' },
  'Ciudad Juárez': { lat: 31.6904, lng: -106.4245, state: 'Chihuahua' },
  
  // Baja California
  'Tijuana': { lat: 32.5149, lng: -117.0382, state: 'Baja California' },
  'Mexicali': { lat: 32.6245, lng: -115.4523, state: 'Baja California' },
  
  // Coahuila
  'Saltillo': { lat: 25.4260, lng: -101.0053, state: 'Coahuila' },
  'Torreón': { lat: 25.5428, lng: -103.4068, state: 'Coahuila' },
  
  // Sinaloa
  'Culiacán': { lat: 24.8091, lng: -107.3940, state: 'Sinaloa' },
  'Mazatlán': { lat: 23.2494, lng: -106.4111, state: 'Sinaloa' },
  
  // Tamaulipas
  'Reynosa': { lat: 26.0922, lng: -98.2777, state: 'Tamaulipas' },
  'Matamoros': { lat: 25.8796, lng: -97.5045, state: 'Tamaulipas' },
  
  // Sonora
  'Hermosillo': { lat: 29.0729, lng: -110.9559, state: 'Sonora' },
  
  // Aguascalientes
  'Aguascalientes': { lat: 21.8853, lng: -102.2916, state: 'Aguascalientes' },
  
  // Morelos
  'Cuernavaca': { lat: 18.9211, lng: -99.2364, state: 'Morelos' },
  
  // San Luis Potosí
  'San Luis Potosí': { lat: 22.1565, lng: -100.9855, state: 'San Luis Potosí' },
};

/**
 * Get coordinates for a Mexico city or state
 */
export function getMexicoCoordinates(city?: string, state?: string): { lat: number; lng: number } | null {
  // Try to find city first
  if (city) {
    const cityKey = Object.keys(mexicoCityCoordinates).find(
      key => key.toLowerCase() === city.toLowerCase()
    );
    if (cityKey) {
      const coords = mexicoCityCoordinates[cityKey];
      return { lat: coords.lat, lng: coords.lng };
    }
  }
  
  // Fall back to state
  if (state) {
    const stateKey = Object.keys(mexicoStateCoordinates).find(
      key => key.toLowerCase() === state.toLowerCase()
    );
    if (stateKey) {
      return mexicoStateCoordinates[stateKey];
    }
  }
  
  // Default to Mexico City
  return { lat: 19.4326, lng: -99.1332 };
}

/**
 * State name abbreviation mapping
 */
export const mexicoStateAbbr: Record<string, string> = {
  'AGS': 'Aguascalientes',
  'BC': 'Baja California',
  'BCS': 'Baja California Sur',
  'CAM': 'Campeche',
  'CHIS': 'Chiapas',
  'CHIH': 'Chihuahua',
  'COAH': 'Coahuila',
  'COL': 'Colima',
  'DGO': 'Durango',
  'GTO': 'Guanajuato',
  'GRO': 'Guerrero',
  'HGO': 'Hidalgo',
  'JAL': 'Jalisco',
  'MEX': 'México',
  'MICH': 'Michoacán',
  'MOR': 'Morelos',
  'NAY': 'Nayarit',
  'NL': 'Nuevo León',
  'OAX': 'Oaxaca',
  'PUE': 'Puebla',
  'QRO': 'Querétaro',
  'QROO': 'Quintana Roo',
  'SLP': 'San Luis Potosí',
  'SIN': 'Sinaloa',
  'SON': 'Sonora',
  'TAB': 'Tabasco',
  'TAMPS': 'Tamaulipas',
  'TLAX': 'Tlaxcala',
  'VER': 'Veracruz',
  'YUC': 'Yucatán',
  'ZAC': 'Zacatecas',
  'CDMX': 'Ciudad de México',
};
