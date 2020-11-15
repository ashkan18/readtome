defmodule ReadtomeWeb.Resolvers.Book do
  def find_book_instances(_parent, args, _resolution) do
    %{lat: lat, lng: lng, term: term} = args |> IO.inspect(label: "====>")
    {:ok, Readtome.Books.list_book_instance(%{lat: lat, lng: lng, term: term, offerings: args[:offerings]})}
  end
end
