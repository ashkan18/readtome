defmodule ReadtomeWeb.MeController do
  use ReadtomeWeb, :controller

  def index(conn, _params), do: render(conn, "index.json", user: conn.private.guardian_default_resource)
end
