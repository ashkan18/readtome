defmodule ReadtomeWeb.Auth.GraphQLContextPlug do
  @behaviour Plug

  import Plug.Conn
  alias ReadtomeWeb.Auth.Guardian

  def init(opts), do: opts

  def call(conn, _) do
    put_private(conn, :absinthe, %{context: %{current_user: Guardian.Plug.current_resource(conn)}})
  end

end
