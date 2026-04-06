/**
 * Guatemala city and department coordinates configuration
 * Used for displaying alerts on the Guatemala map
 */

/**
 * Guatemala Department (state) center coordinates
 */
export const guatemalaDepartmentCoordinates: Record<string, { lat: number; lng: number }> = {
  'Guatemala': { lat: 14.6349, lng: -90.5069 },
  'Alta Verapaz': { lat: 15.4667, lng: -90.3667 },
  'Baja Verapaz': { lat: 15.1167, lng: -90.3167 },
  'Chimaltenango': { lat: 14.6667, lng: -90.8167 },
  'Chiquimula': { lat: 14.8000, lng: -89.5450 },
  'El Progreso': { lat: 14.8667, lng: -90.0667 },
  'Escuintla': { lat: 14.3050, lng: -90.7850 },
  'Huehuetenango': { lat: 15.3197, lng: -91.4714 },
  'Izabal': { lat: 15.4667, lng: -88.7333 },
  'Jalapa': { lat: 14.6333, lng: -89.9889 },
  'Jutiapa': { lat: 14.2914, lng: -89.8956 },
  'Petén': { lat: 16.9167, lng: -90.0833 },
  'Quetzaltenango': { lat: 14.8333, lng: -91.5167 },
  'Quiché': { lat: 15.0317, lng: -90.9681 },
  'Retalhuleu': { lat: 14.5381, lng: -91.6731 },
  'Sacatepéquez': { lat: 14.5586, lng: -90.7350 },
  'San Marcos': { lat: 14.9644, lng: -91.7992 },
  'Santa Rosa': { lat: 14.3333, lng: -90.2833 },
  'Sololá': { lat: 14.7719, lng: -91.1878 },
  'Suchitepéquez': { lat: 14.4167, lng: -91.4167 },
  'Totonicapán': { lat: 14.9117, lng: -91.3608 },
  'Zacapa': { lat: 14.9667, lng: -89.5333 },
};

/**
 * Major Guatemala cities coordinates
 */
export const guatemalaCityCoordinates: Record<string, { lat: number; lng: number; department: string }> = {
  // Guatemala Department
  'Guatemala City': { lat: 14.6349, lng: -90.5069, department: 'Guatemala' },
  'Mixco': { lat: 14.6333, lng: -90.6067, department: 'Guatemala' },
  'Villa Nueva': { lat: 14.5258, lng: -90.5878, department: 'Guatemala' },
  'San Miguel Petapa': { lat: 14.5119, lng: -90.5564, department: 'Guatemala' },
  
  // Escuintla
  'Escuintla': { lat: 14.3050, lng: -90.7850, department: 'Escuintla' },
  
  // Quetzaltenango
  'Quetzaltenango': { lat: 14.8333, lng: -91.5167, department: 'Quetzaltenango' },
  
  // Sacatepéquez
  'Antigua Guatemala': { lat: 14.5586, lng: -90.7350, department: 'Sacatepéquez' },
  
  // Chimaltenango
  'Chimaltenango': { lat: 14.6656, lng: -90.8194, department: 'Chimaltenango' },
  
  // Huehuetenango
  'Huehuetenango': { lat: 15.3197, lng: -91.4714, department: 'Huehuetenango' },
  
  // Alta Verapaz
  'Cobán': { lat: 15.4667, lng: -90.3667, department: 'Alta Verapaz' },
  
  // Petén
  'Flores': { lat: 16.9281, lng: -89.8922, department: 'Petén' },
  
  // Izabal
  'Puerto Barrios': { lat: 15.7167, lng: -88.5833, department: 'Izabal' },
  
  // Jalapa
  'Jalapa': { lat: 14.6333, lng: -89.9889, department: 'Jalapa' },
  
  // Jutiapa
  'Jutiapa': { lat: 14.2914, lng: -89.8956, department: 'Jutiapa' },
  
  // Retalhuleu
  'Retalhuleu': { lat: 14.5381, lng: -91.6731, department: 'Retalhuleu' },
  
  // San Marcos
  'San Marcos': { lat: 14.9644, lng: -91.7992, department: 'San Marcos' },
  
  // Sololá
  'Sololá': { lat: 14.7719, lng: -91.1878, department: 'Sololá' },
};

/**
 * Get coordinates for a Guatemala city or department
 */
export function getGuatemalaCoordinates(city?: string, department?: string): { lat: number; lng: number } | null {
  // Try to find city first
  if (city) {
    const cityKey = Object.keys(guatemalaCityCoordinates).find(
      key => key.toLowerCase() === city.toLowerCase()
    );
    if (cityKey) {
      const coords = guatemalaCityCoordinates[cityKey];
      return { lat: coords.lat, lng: coords.lng };
    }
  }
  
  // Fall back to department
  if (department) {
    const deptKey = Object.keys(guatemalaDepartmentCoordinates).find(
      key => key.toLowerCase() === department.toLowerCase()
    );
    if (deptKey) {
      return guatemalaDepartmentCoordinates[deptKey];
    }
  }
  
  // Default to Guatemala City
  return { lat: 14.6349, lng: -90.5069 };
}

/**
 * Department name abbreviation mapping (if needed)
 */
export const guatemalaDepartmentAbbr: Record<string, string> = {
  'GT': 'Guatemala',
  'AV': 'Alta Verapaz',
  'BV': 'Baja Verapaz',
  'CM': 'Chimaltenango',
  'CQ': 'Chiquimula',
  'PR': 'El Progreso',
  'ES': 'Escuintla',
  'HU': 'Huehuetenango',
  'IZ': 'Izabal',
  'JA': 'Jalapa',
  'JU': 'Jutiapa',
  'PE': 'Petén',
  'QZ': 'Quetzaltenango',
  'QC': 'Quiché',
  'RE': 'Retalhuleu',
  'SA': 'Sacatepéquez',
  'SM': 'San Marcos',
  'SR': 'Santa Rosa',
  'SO': 'Sololá',
  'SU': 'Suchitepéquez',
  'TO': 'Totonicapán',
  'ZA': 'Zacapa',
};
