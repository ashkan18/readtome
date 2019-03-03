defmodule ReadtomeWeb.InquiryController do
  use ReadtomeWeb, :controller

  alias Readtome.{Connector, Connector.Inquiry}

  action_fallback ReadtomeWeb.FallbackController

  def index(conn) do
    user = conn.private.guardian_default_resource
    inquiries = Connector.list_inquiries(user.id)
    render(conn, "index.json", inquiries: inquiries)
  end

  def create(conn, %{"book_instance_id" => book_instance_id, "type" => type}) do
    user = conn.private.guardian_default_resource
    with {:ok, %Inquiry{} = inquiry} <- Connector.create_inquiry( %{book_instance_id: book_instance_id, type: type, user_id: user.id}) do
      conn
      |> put_status(:created)
      |> render("show_lite.json", inquiry: inquiry)
    end
  end
end
