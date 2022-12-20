export function splitItemIntoNameAndQty(items: string ): string[][] {
  return items?.split('\n').map((line) => {
    line.replace('\r', '');
    return line.split('\t');
  });
}

export function parsePropsAndCreateItemNameList(splitItemsArray: string[][]) {
  let itemNameList = [];

  if (splitItemsArray.length > 1) {
    splitItemsArray.forEach(item => {
      itemNameList.push(item[0])
    });
  } else if (splitItemsArray.length === 1) {
    itemNameList.push(splitItemsArray[0][0])
  }

  return itemNameList;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

