defmodule ReadtomeWeb.PageController do
  use ReadtomeWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
