defmodule ReadtomeWeb.Router do
  use ReadtomeWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :auth do
    plug(ReadtomeWeb.Auth.Pipeline)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :graphql_auth do
    plug(ReadtomeWeb.Auth.GraphQLContextPlug)
  end

  scope "/api" do
    pipe_through([:api, :auth, :graphql_auth])

    forward("/graphiql", Absinthe.Plug.GraphiQL, schema: ReadtomeWeb.Schema)
    forward("/graph", Absinthe.Plug, schema: ReadtomeWeb.Schema)
  end

  scope "/", ReadtomeWeb do
    # Use the default browser stack
    pipe_through(:browser)

    get("/*path", HomeController, :index)
  end
end
