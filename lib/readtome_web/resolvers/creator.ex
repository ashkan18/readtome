defmodule ReadtomeWeb.Resolvers.Creator do
  alias Readtome.{Accounts, Helper, Creators}

  def find_by_id(_parent, %{id: id}, _context) do
    {:ok, Creators.get_creator(id)}
  end
end
