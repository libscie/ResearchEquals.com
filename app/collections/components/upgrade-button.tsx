import { Upgrade } from "@carbon/icons-react"

const UpgradeButton = () => {
  return (
    <button
      type="button"
      className="mx-4 flex rounded-md bg-indigo-50 py-2 px-4 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border dark:border-gray-600 dark:bg-gray-800 dark:text-indigo-500 dark:hover:border-gray-400 dark:hover:bg-gray-700"
      // onClick={() => {
      //   setCreateOpen(false)
      //   formikReset()
      // }}
    >
      <Upgrade size={32} className="h-4 w-4 fill-current pt-1 text-indigo-500" aria-hidden="true" />
      Upgrade
    </button>
  )
}

export default UpgradeButton
