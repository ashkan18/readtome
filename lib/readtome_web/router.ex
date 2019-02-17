defmodule ReadtomeWeb.Router do
  use ReadtomeWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :auth do
    plug ReadtomeWeb.Auth.Pipeline
  end

  pipeline :api do
    plug :accepts, ["json"]
  end
  scope "/api", ReadtomeWeb do
    pipe_through :api

    post "/signup", AccountController, :signup
    post "/login", AccountController, :login
  end

  scope "/api" do
    pipe_through [:api, :auth]

    get "/find_in_the_wild", ReadtomeWeb.BookController, :find_in_the_wild
    resources "/books", ReadtomeWeb.BookController, except: [:new, :edit]
    resources "/book_instances", ReadtomeWeb.BookInstanceController
    resources "/authors", ReadtomeWeb.AuthorController
    resources "/inquiries", ReadtomeWeb.InquiryController, only: [:create]
    resources "/me", ReadtomeWeb.MeController, only: [:index]
    get "/me/inquiries", ReadtomeWeb.MeController, :inquiries
    post "/me/photos", ReadtomeWeb.MeController, :photos
  end

  scope "/api" do
    pipe_through [:api]

    forward "/graphiql", Absinthe.Plug.GraphiQL, schema: ReadtomeWeb.Schema
    forward "/", Absinthe.Plug, schema: ReadtomeWeb.Schema
  end
  scope "/", ReadtomeWeb do
    pipe_through :browser # Use the default browser stack

    get "/*path", HomeController, :index
  end
end
