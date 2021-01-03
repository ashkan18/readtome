defmodule ReadtomeWeb.Resolvers.Creator do
  alias Readtome.{Creators, Things}

  def find_by_id(_parent, %{id: id}, _context) do
    {:ok, Creators.get_creator(id)}
  end

  def unfurl(_parent, %{url: url}, _ctx) do
    Things.unfurl_link(url)
  end
end
