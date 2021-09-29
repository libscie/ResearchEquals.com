import { AuthenticationError, Link, useMutation, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import createModule from "../mutations/createModule"

type CreateModuleFormProps = {
  onSuccess?: (items) => any
}

export const CreateModuleForm = (props: CreateModuleFormProps) => {
  const [createModuleMutation] = useMutation(createModule)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Form
        className="m-0"
        submitText="Create module"
        initialValues={{
          title: "",
          description: "",
          license: "",
          type: "",
          main: "",
          authors: "",
          parents: "",
        }}
        onSubmit={async (values) => {
          // Ensure the authors is an array of integers identifying the workspaces
          // TODO: Need to update this when the selection is improved
          values.authors = [parseInt(values.authors)]
          try {
            await createModuleMutation(values)
            props.onSuccess?.(values)
          } catch (error) {
            return {
              [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
            }
          }
        }}
      >
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="title"
          placeholder="Title"
          label="Title"
        />
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="description"
          placeholder="Description"
          label="Description"
        />
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="license"
          placeholder="license"
          label="license"
        />
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="type"
          placeholder="type"
          label="type"
        />
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="main"
          placeholder="main"
          label="main"
        />
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="authors"
          placeholder="authors"
          label="authors"
        />
        <LabeledTextField
          className="w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          name="parents"
          placeholder="parents"
          label="parents"
        />
      </Form>
    </div>
  )
}

export default CreateModuleForm
