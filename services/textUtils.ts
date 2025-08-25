interface ListItem {
  number: number;
  content: string;
}

/**
 * Parses a string that may contain a numbered list into an array of list items.
 * Handles multi-line list items.
 * @param text The input string.
 * @returns An array of ListItem objects.
 */
export const parseTextIntoList = (text: string | null | undefined): ListItem[] => {
  if (typeof text !== 'string' || !text.trim()) {
    return [];
  }

  const lines = text.split('\n');
  const items: ListItem[] = [];
  let currentItem: ListItem | null = null;

  const listRegex = /^(\d+)\.\s*(.*)/;

  lines.forEach(line => {
    const match = line.match(listRegex);
    if (match) {
      // It's a new list item
      if (currentItem) {
        items.push(currentItem);
      }
      currentItem = {
        number: parseInt(match[1], 10),
        content: match[2].trim(),
      };
    } else if (currentItem) {
      // It's a continuation of the previous list item
      currentItem.content += `\n${line.trim()}`;
    } else {
        // Line before any list item or not part of a list
        // If it's the first line and not a list, treat it as a single paragraph.
        if (items.length === 0 && !currentItem) {
             currentItem = { number: 0, content: line.trim() }; // Use 0 to indicate not a real list item
        }
    }
  });

  if (currentItem) {
    items.push(currentItem);
  }
  
  // If only one item was found and its number is 0, it's not a list.
  if (items.length === 1 && items[0].number === 0) {
      return [];
  }

  return items;
};
