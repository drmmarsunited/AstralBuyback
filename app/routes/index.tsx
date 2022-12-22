// Imports //
import ItemForm from "~/components/form";
import { splitItemIntoNameAndQty } from "~/utils";
import { badRequest, getMarketOrderPrices } from "~/models/items.server";
import type { ActionArgs } from "@remix-run/server-runtime";
import { useActionData } from "@remix-run/react";

// Functions //
/**
 * // Function handles the form post for Remix
 * @param request
 */
export async function action({request}: ActionArgs) {
  // Get the submitted form data
  const formData = await request.formData();
  const itemData = formData.get('items');

  // Basic validation
  if (typeof itemData !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly.'
    })
  }

  // Setup for parsing the items pasted into the form
  let splitItems: string[][];

  // Make sure the input we got is a string
  splitItems = splitItemIntoNameAndQty(itemData);

  // Get all the data we need to return to the user
  return await getMarketOrderPrices(splitItems);
}

// Main react code for the page
export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <div className=" min-h-full bg-slate-700">
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-4xl text-center font-bold text-gray-400">Astral Acquisitions Buyback</h1>
            <div className="grid grid-cols-2 gap-5 justify-evenly px-4 py-8 sm:px-0">
              <ItemForm
                textAreaHeader="Paste your ore here"
                placeholderText="Click on ore in your inventory and press Ctrl+A, Ctrl+C."
                rowCount={8}
                note="Note: only valid item names will be included for price calculation. Invalid items will be ignored."
              />

              <div className="mt-5">
                <dl className="">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-md font-medium text-white">Contract To:</dt>
                    <dd className="mt-1 flex text-sm text-gray-400 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow font-bold">
                          Astral Acquisitions Inc.
                          <button
                            className="px-2 focus:ring-indigo-500"
                            type="button"
                            title="Copy"
                            onClick={() => navigator.clipboard.writeText('Astral Acquisitions Inc.')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M13.887 3.182c.396.037.79.08 1.183.128C16.194 3.45 17 4.414 17 5.517V16.75A2.25 2.25 0 0114.75 19h-9.5A2.25 2.25 0 013 16.75V5.517c0-1.103.806-2.068 1.93-2.207.393-.048.787-.09 1.183-.128A3.001 3.001 0 019 1h2c1.373 0 2.531.923 2.887 2.182zM7.5 4A1.5 1.5 0 019 2.5h2A1.5 1.5 0 0112.5 4v.5h-5V4z" clipRule="evenodd" />
                            </svg>
                          </button>
                      </span>
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-md font-medium text-white">Buyback Value:</dt>
                    <dd className="mt-1 flex text-sm text-gray-400 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow font-bold" id="value">
                        {data ? `${data} ISK` : "Waiting for valid data..."}
                        <button
                          className="px-2 focus:ring-indigo-500"
                          type="button"
                          title="Copy"
                          onClick={() => navigator.clipboard.writeText(data?.toString() as string)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M13.887 3.182c.396.037.79.08 1.183.128C16.194 3.45 17 4.414 17 5.517V16.75A2.25 2.25 0 0114.75 19h-9.5A2.25 2.25 0 013 16.75V5.517c0-1.103.806-2.068 1.93-2.207.393-.048.787-.09 1.183-.128A3.001 3.001 0 019 1h2c1.373 0 2.531.923 2.887 2.182zM7.5 4A1.5 1.5 0 019 2.5h2A1.5 1.5 0 0112.5 4v.5h-5V4z" clipRule="evenodd" />
                            </svg>
                          </button>
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

