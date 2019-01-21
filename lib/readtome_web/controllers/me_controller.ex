defmodule ReadtomeWeb.MeController do
  use ReadtomeWeb, :controller
  alias Readtome.{Accounts, Connector}

  def index(conn, _params), do: render(conn, "index.json", user: conn.private.guardian_default_resource)

  def inquiries(conn, _params) do
    user = conn.private.guardian_default_resource
    inquiries = Connector.list_inquries(user.id)
    requests = Connector.list_requests(user.id)
    render(conn, "inquiries.json", inquiries: inquiries, requests: requests)
  end

  def photos(conn, %{"file" => file}) do
    user = conn.private.guardian_default_resource
    user = Accounts.add_user_profile_photo(user, file)
    render(conn, "user.json", user: user)
  end
end
