defmodule ReadtomeWeb.MeController do
  use ReadtomeWeb, :controller

  def index(conn, _params), do: render(conn, "index.json", user: conn.private.guardian_default_resource)

  def inquiries(conn, _params) do
    user = conn.private.guardian_default_resource
    inquiries = Connector.list_inquries(user.id)
    requests = Connector.list_requests(user.id)
    render(conn, "inquiries.json", inquiries: inquiries, requests: requests)
  end

  def update(conn, params) do
  end
end
