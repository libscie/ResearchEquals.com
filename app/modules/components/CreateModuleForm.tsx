import { useMutation } from "blitz"
import { useFormik } from "formik"

import createModule from "../mutations/createModule"

type CreateModuleFormProps = {
  workspace?: (items) => any
  onSuccess?: (items) => any
}

export const CreateModuleForm = (workspace, props: CreateModuleFormProps) => {
  const [createModuleMutation] = useMutation(createModule)
  const formik = useFormik({
    initialValues: {
      title: "",
      type: "",
      description: "",
      authors: [],
      main: "",
    },
    onSubmit: (values) => {
      createModuleMutation(values)
    },
  })

  return (
    <div className="flex">
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div className="max-w-lg flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 sm:text-sm">
              <label htmlFor="type" className="sr-only">
                Module type
              </label>
              <select
                id="type"
                name="type"
                onChange={formik.handleChange}
                value={formik.values.type}
              >
                <option className="text-gray-500" value="12">
                  Module type
                </option>
                <option className="text-black" value="1234">
                  Theory
                </option>
              </select>
            </span>
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              className="pl-2 border-2 border-gray-300 focus:outline-black w-full"
              id="title"
              name="title"
              type="title"
              placeholder="Title"
              onChange={formik.handleChange}
              value={formik.values.title}
            />
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Description
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.description}
              className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              defaultValue={""}
            />
            <p className="mt-2 text-sm text-gray-500">
              Write a few sentences about the research module.
            </p>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Authors
          </label>
          <div className="flex">
            <img src={workspace.workspace.avatar} />
          </div>
        </div>

        <div className="absolute bottom-0 mb-2">
          <button type="submit" className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-400">
            Save draft
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateModuleForm
