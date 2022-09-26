import React from "react"
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"
import { QueryClient, QueryClientProvider } from "react-query"

import LoginForm from "./LoginForm"

const queryClient = new QueryClient()

let container = document.createElement("div") as HTMLDivElement
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
})

test("renders the login form", () => {
  act(() => {
    render(
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <LoginForm />
      </QueryClientProvider>,
      container
    )
  })
})
