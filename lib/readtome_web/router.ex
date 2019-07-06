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

  pipeline :graphql do
    plug ReadtomeWeb.GraphQLContextPlug
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  pipeline :graphql_auth do
    plug(ReadtomeWeb.Auth.GraphQLContextPlug)
  end

  scope "/api", ReadtomeWeb do
    pipe_through(:api)

    post("/signup", AccountController, :signup)
    post("/login", AccountController, :login)
  end

  scope "/api" do
    pipe_through([:api, :auth])

    resources("/inquiries", ReadtomeWeb.InquiryController, only: [:create])
    resources("/me", ReadtomeWeb.MeController, only: [:index])
    get("/me/inquiries", ReadtomeWeb.MeController, :inquiries)
    post("/me/photos", ReadtomeWeb.MeController, :photos)
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
