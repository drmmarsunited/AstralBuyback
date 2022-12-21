// Imports //
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'

// Globals //
const colorClassMap = {
  success: {
    background: 'bg-green-50',
    text: 'text-green-800',
    button: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
  },
  failure: {
    background: 'bg-red-50',
    text: 'text-red-800',
    button: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
  }
}

// Interfaces //
interface closableAlertProps {
  isSuccess: boolean
  alertText: string
}


export default function closableAlert(props: closableAlertProps) {
  return (
    <div className={`rounded-md ${props.isSuccess ? colorClassMap.success.background : colorClassMap.failure.background} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {props.isSuccess ? <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" /> : <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${props.isSuccess ? colorClassMap.success.text : colorClassMap.failure.text}`}>{props.alertText}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${props.isSuccess ? colorClassMap.success.button : colorClassMap.failure.button}`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}