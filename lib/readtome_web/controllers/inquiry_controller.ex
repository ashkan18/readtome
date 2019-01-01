defmodule ReadtomeWeb.InquiryController do
  use ReadtomeWeb, :controller

  alias Readtome.{Connector, Connector.Inquiry}

  action_fallback ReadtomeWeb.FallbackController

  def index(conn) do
    user = conn.private.guardian_default_resource
    inquiries = Connector.list_inquries(user.id)
    render(conn, "index.json", inquiries: inquiries)
  end

  def create(conn, %{"book_instance_id" => book_instance_id, "type" => type}) do
    user = conn.private.guardian_default_resource
    with {:ok, %Inquiry{} = inquiry} <- Connector.create_inquiry( %{book_instance_id: book_instance_id, type: type, user_id: user.id}) do
      conn
      |> put_status(:created)
      |> render("show.json", inquiry: inquiry)
    end
  end

  def update(conn, %{"id" => id, "book_instance" => book_instance_params}) do
  end
end
