// Imports //
import { parsePropsAndCreateItemNameList, sleep } from "~/utils";
import { fetch } from "@remix-run/web-fetch";
import { json } from "@remix-run/node";

// Globals //
const esiURL = "https://esi.evetech.net/latest"

const esiRegionAndSystemIds = {
  regions: {
    'the forge': 10000002
  },
  systems: {
    'jita': 30000142
  }
}

// Interfaces //
interface esiInventoryItem {
  id: number,
  name: string
}

interface esiInventoryLookup {
  "inventory_types": esiInventoryItem[]
}

export interface esiMarketOrderData {
  duration: number,
  is_buy_order: boolean,
  issued: Date,
  location_id: number,
  min_volume: number,
  order_id: number,
  price: number,
  range: string,
  system_id: number,
  type_id: number,
  volume_remain: number,
  volume_total: number
}

interface finalMarketOrderData {
  [key: string]: esiMarketOrderData[]
}

// Functions //
/**
 * This helper function helps us returning the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const badRequest = <T>(data: T) =>
  json<T>(data, { status: 400 });

/**
 * Function to take the final data model as input and calculate the final buyback value
 * @param orderData - Order data that has been retrieved from ESI
 * @param items - Data about the items that a user has pasted into the original form
 */
function calculateTotalValueOfItems(orderData: finalMarketOrderData, items: string[][]): number {
  // Create holder for final value that we can update
  let finalValue: number = 0;

  // Loop through the keys of passed in items and find the highest prices
  for (const order of Object.keys(orderData)) {
    items.forEach((item) => {
      if (item[0] === order) {
        finalValue += (orderData[order][orderData[order].length - 1].price * parseInt(item[1]));
      }
    });
  }

  // Multiply the final value by 90% to get what we'll pay
  finalValue = finalValue * 0.90
  finalValue = Math.round((finalValue + Number.EPSILON) * 100) / 100;

  return finalValue;
}

/**
 * Custom sort function to support our data model and sorting by order price
 * @param o1 - Market order 1
 * @param o2 - Market order 2
 */
function sortByHighestPrice(o1: esiMarketOrderData, o2: esiMarketOrderData): number {
  if (o1.price < o2.price) {
    return -1;
  }

  if (o1.price > o2.price) {
    return 1;
  }

  return 0
}

/**
 * Function that gets market order data by item type ID from the Eve Online ESI API explicitly for The Forge region
 * @param itemId
 * @returns Promise<esiMarketOrderData[]>
 */
export async function getMarketOrdersFromJitaByItemId(itemId: number): Promise<esiMarketOrderData[]> {
  // Set up a Do While loop to handle potential paginated results
  let maxPageCount: number = 1;
  let page: number = 1;
  let resp: Response;

  do {
    // Setup for API call
    const qs = `?datasource=tranquility&language=en&order_type=buy&type_id=${itemId}&page=${page}`
    const finalUrl = `${esiURL}/markets/${esiRegionAndSystemIds.regions["the forge"]}/orders/${qs}`
    const httpMethod = 'GET'
    const httpHeaders = {
      accept: 'application/json',
      'Cache-Control': 'no-cache'
    }

    console.log(`Calling the URL: ${finalUrl}`)

    // Make the API call
    resp = await fetch(finalUrl, {
      method: httpMethod,
      headers: httpHeaders
    });

    // Check response headers for max pages in return data
    if (resp.headers.has('x-pages')) {
      maxPageCount = parseInt(resp.headers.get('x-pages') || "1");

      if (maxPageCount > 1) {
        console.log('Found x-pages in headers was greater than 1')
        page++
      }
    }

    await sleep(2);

  } while (page !== maxPageCount)

  // Return final response
  return resp.json();
}

/**
 * Function that takes one or more item type names and searches the Eve Online ESI API for their type IDs
 * @param items
 * @returns Promise<esiInventoryLookup>
 */
export async function getItemIdsByNameFromEsi(items: string[][]): Promise<esiInventoryLookup> {
  // Get item names from the inbound
  const itemNameList = parsePropsAndCreateItemNameList(items)

  // Setup for API call
  const finalUrl = `${esiURL}/universe/ids/?datasource=tranquility&language=en`
  const httpMethod = 'POST'
  const httpHeaders = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
    'Cache-Control': 'no-cache'
  }

  // Check if there is anything in the items arrays to work with
  if (itemNameList.length >= 1) {
    // Make the API call
    const resp = await fetch(finalUrl, {
      method: httpMethod,
      headers: httpHeaders,
      body: JSON.stringify(itemNameList)
    })

    // Return final response
    return resp.json();
  } else {
    return Promise.resolve({'inventory_types': []})
  }
}

/**
 * Main entrypoint into the backend from the front end to get market order data
 * @param items
 */
export async function getMarketOrderPrices(items: string[][]) {
  // Create empty objects to house final and temp price data
  let finalData: finalMarketOrderData = {}

  // First we have to get the item's type ID from ESI
  const itemIds = await getItemIdsByNameFromEsi(items);

  // Call ESI to get market order data from The Forge for each item that was requested
  // We will narrow this data down to Buy Orders only from Jita
  if (itemIds.inventory_types !== undefined) {
    for (const item of itemIds.inventory_types) {
      if (!finalData[item.name]) {
        finalData[item.name] = []
      }

      const itemMarketOrderData = await getMarketOrdersFromJitaByItemId(item.id)

      itemMarketOrderData.forEach((order) => {
        if (order.system_id === esiRegionAndSystemIds.systems.jita) {
          finalData[item.name].push(order)
        }
      });
    }
  }

  // Sort the final by order data from Jita we have by price
  for (const finalDataKey in finalData) {
    finalData[finalDataKey].sort(sortByHighestPrice);
  }

  // Send final data structure into value calculation and return it
  return calculateTotalValueOfItems(finalData, items);
}
