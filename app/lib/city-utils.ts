/**
 * Utility functions for city-related styling and formatting
 */

export const getCityBadgeColor = (city: string): string => {
  // Define a color palette for cities
  const cityColors: { [key: string]: string } = {
    'Yangon': 'blue',
    'Mandalay': 'purple',
    'Naypyidaw': 'green',
    'Bago': 'orange',
    'Mawlamyine': 'teal',
    'Pathein': 'cyan',
    'Meiktila': 'pink',
    'Myitkyina': 'red',
    'Lashio': 'yellow',
    'Taunggyi': 'indigo',
  };
  
  // Return the assigned color or a default based on city name hash
  if (cityColors[city]) {
    return cityColors[city];
  }
  
  // For cities not in the predefined list, assign colors based on string hash
  const colorOptions = ['blue', 'green', 'orange', 'purple', 'teal', 'cyan', 'pink', 'red', 'yellow', 'indigo'];
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorOptions[hash % colorOptions.length];
};

/**
 * Get city badge styling props
 */
export const getCityBadgeProps = (city: string) => ({
  variant: 'outline' as const,
  colorScheme: getCityBadgeColor(city),
  fontSize: 'xs' as const,
  px: 2,
  py: 1,
  borderRadius: 'full' as const,
});
