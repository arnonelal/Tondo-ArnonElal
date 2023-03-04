const cssColors = ['red', 'blue', 'blueviolet', 'orange', 'gray', 'black'];

export function getColorById(labelId: number) {
  return cssColors[labelId % cssColors.length]
}