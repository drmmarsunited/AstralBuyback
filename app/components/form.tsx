import React from "react";
import { Form } from "@remix-run/react";
import { splitItemIntoNameAndQty } from "~/utils";

// Interfaces //
interface ItemProps {
  textAreaHeader: string,
  placeholderText: string,
  rowCount: number,
  note: string
}

// Functions //


// Main //
export default function ItemForm(props: ItemProps) {
  return(
    <div>
      <Form method="post" id="item-form">
        <label htmlFor="comment" className="block text-md font-medium text-white">
          {props.textAreaHeader}:
        </label>

        <div className="mt-1 mb-2">
          <textarea
            placeholder={props.placeholderText}
            rows={props.rowCount}
            name="items"
            id="items"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black-500 focus:ring-black-500 sm:text-sm"
          />
          <p className="text-white text-sm italic">{props.note}</p>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          type="submit"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}