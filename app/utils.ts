/**
 * Function to parse the raw string version of the provided item list and return structured JS arrays
 * This function will also remove any entries that are missing a qty
 * @param items
 */
export function splitItemIntoNameAndQty(items: string ): string[][] {
  let splitItems = items?.split('\n').map((line) => {
    line.replace('\r', '')
    return line.split('\t');
  });

  // Setup variable to house delete positions
  let positionsToDelete = []

  // Loop through the split items and mark any with missing quantities for removal
  if (splitItems?.length > 1) {
    splitItems.forEach((item, index) => {
      if (item.length > 1) {
        if (item.length <= 1) {
          positionsToDelete.push(index)
        }
      }
    });
  } else if (splitItems.length === 1) {
    if (splitItems[0].length <= 1) {
      positionsToDelete.push(0)
    }
  }

  // Remove the marked positions
  positionsToDelete.forEach(position => {
    delete splitItems[position]
  });

  return splitItems;
}

export function parsePropsAndCreateItemNameList(splitItemsArray: string[][]) {
  let itemNameList: string[] = [];

  if (splitItemsArray.length > 1) {
    splitItemsArray.forEach((item) => {
      if (item.length > 1) {
        itemNameList.push(item[0])
      }
    });
  } else if (splitItemsArray.length === 1 && splitItemsArray[0] !== undefined) {
    if (splitItemsArray[0].length > 1) {
      itemNameList.push(splitItemsArray[0][0])
    }
  }

  return itemNameList;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

