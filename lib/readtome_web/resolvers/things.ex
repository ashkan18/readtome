defmodule ReadtomeWeb.Resolvers.Things do
  alias Readtome.Things

  def unfurl(_parent, %{url: url}, _ctx) do
    Things.unfurl_link(url)
  end

  def find_by_isbn(_parent, %{isbn: isbn}, _ctx) do
    Readtome.Things.find_by_isbn(isbn)
  end
end
