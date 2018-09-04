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

  scope "/", ReadtomeWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api", ReadtomeWeb do
    pipe_through :api

    post "/signup", AccountController, :signup
    post "/login", AccountController, :login
  end

  scope "/api", ReadtomeWeb do
    pipe_through [:api, :auth]

    get "/find_in_the_wild", BookController, :find_in_the_wild
    resources "/books", BookController, except: [:new, :edit]
    resources "/book_instances", BookInstanceController
    resources "/authors", AuthorController
    resources "/inquiries", InquiryController, only: [:create]
  end
end
