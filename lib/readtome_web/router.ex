defmodule ReadtomeWeb.Router do
  use ReadtomeWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
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

    resources "/books", BookController, except: [:new, :edit]
    resources "/book_instances", BookInstanceController
  end
end
