/**
 * Function to parse the raw string version of the provided item list and return structured JS arrays
 * This function will also remove any entries that are missing a qty
 * @param items
 */
export function splitItemIntoNameAndQty(items: string ): string[][] {
  let splitItems = items?.split('\n').map((line) => {
    line.replace('\r', '')
    return line.split(/[\s|\t]/);
  });

  // Setup variable to house delete positions
  let positionsToDelete = []

  // Loop through the split items and mark any with missing quantities for removal
  if (splitItems?.length > 1) {
    splitItems.forEach((item, index) => {
      if (!doesItemHaveQty(item)) {
        positionsToDelete.push(index)
      }
    });
  } else if (splitItems.length === 1) {
    if (!doesItemHaveQty(splitItems[0])) {
      positionsToDelete.push(0)
    }
  }

  // Remove the marked positions
  positionsToDelete.forEach(position => {
    delete splitItems[position]
  });


  return splitItems?.filter(element => {
    return element !== undefined
  });
}

/**
 * Helper function to determine if an item array has a valid quantity
 * @param item
 */
function doesItemHaveQty(item: string[]): boolean {
  const qty = item.slice(-1)

  if (qty !== undefined) {
    return !isNaN(parseInt(qty.join()))
  }

  return false
}

/**
 * Function to parse an array of arrays to gather provided Eve item names
 * @param splitItemsArray
 */
export function parsePropsAndCreateItemNameList(splitItemsArray: string[][]): string[] {
  let itemNameList: string[] = [];

  if (splitItemsArray.length > 1) {
    splitItemsArray.forEach((item) => {
      if (doesItemHaveQty(item)) {
        itemNameList.push(item.slice(0, -1).join(' '))
      }
    });
  } else if (splitItemsArray.length === 1 && splitItemsArray[0] !== undefined) {
    if (doesItemHaveQty(splitItemsArray[0])) {
      itemNameList.push(splitItemsArray[0][0])
    }
  }

  return itemNameList;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

