defmodule ReadtomeWeb.Auth.GraphQLContextPlug do
  @behaviour Plug

  import Plug.Conn
  alias ReadtomeWeb.Auth.Guardian

  def init(opts), do: opts

  def call(conn, _) do
    case build_context(conn) do
      {:ok, context} ->
        put_private(conn, :absinthe, %{context: context})

      _ ->
        conn
    end
  end

  defp build_context(conn) do
    {:ok, %{current_user: Guardian.Plug.current_resource(conn)}}
  end

end
