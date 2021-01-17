defmodule Readtome.Things do
  def unfurl_link(url) do
    case Furlex.unfurl(url) do
      {:ok, %Furlex{oembed: data}} when not is_nil(data) ->
        IO.inspect(data, label: :omebed)
        unfurl_oembed(data)

      {:ok, %Furlex{json_ld: data}} when data !== [] ->
        IO.inspect(data, label: :json_ld)
        unfurl_json_ld(data)

      {:ok, a = %Furlex{twitter: data}} when not is_nil(data) ->
        IO.inspect(a, label: :twitter)
        unfurl_twitter(data)

      error ->
        IO.inspect(error)
        {:error, "Could not unfurl"}
    end
  end

  defp unfurl_oembed(data) do
    {:ok, %{creator_names: [cleanup_author_name(data["author_name"])], image: data["thumbnail_url"], type: map_types(data["type"]), title: data["title"]}}
  end

  defp unfurl_twitter(data) do
    {:ok, %{image: data["twitter:image"], type: map_types(data["twitter:creator"] || data["twitter:site"]), title: data["twitter:title"]}}
  end

  defp map_types("MusicRecording"), do: :listened
  defp map_types("@Criterion"), do: :watched
  defp map_types("@criterionchannl"), do: :watched
  defp map_types("@goodreads"), do: :read
  defp map_types("Product"), do: :read
  defp map_types("Movie"), do: :watched
  defp map_types("rich"), do: :read
  defp map_types("CreativeWork"), do: :saw
  defp map_types(something), do: something

  defp unfurl_json_ld([data = %{"@type" => "Movie"} | _]) do
    {:ok, %{type: :watched, title: data["name"], image: data["image"], creator_names: [fetch_json_ld_person(data["director"])]}}
  end

  defp unfurl_json_ld([data | _]) do
    {:ok, %{type: map_types(data["@type"]), title: data["name"], image: data["image"], creator_names: [fetch_json_ld_person(data["author"])]}}
  end

  defp fetch_json_ld_person(authors) when is_list(authors) do
    authors
    |> Enum.map(fn data ->
      case data do
        %{"@type" => "Person", "name" => name} -> name
        _ -> nil
      end
    end)
    |> Enum.reject(&is_nil/1)
    |> Enum.join(",")
  end

  defp fetch_json_ld_person(_), do: ""

  defp cleanup_author_name(name) do
    name
    |> String.trim()
    |> String.trim_leading("By ")
  end

  def find_by_isbn(isbn) do
    case google_books(isbn) do
      {:found, book} -> {:ok, book}
      _ -> {:not_found}
    end
  end

  defp google_books(isbn) do
    case Readtome.GoogleBook.get_book(isbn) do
      {:ok, book} ->
        {:found,
         %{
           type: :read,
           title: book["volumeInfo"]["title"],
           creator_names: book["volumeInfo"]["authors"],
           tags: book["volumeInfo"]["categories"],
           image: book["volumeInfo"]["imageLinks"]["large"] || book["volumeInfo"]["imageLinks"]["thumbnail"],
           description: book["volumeInfo"]["description"]
         }}

      _ ->
        {:not_found}
    end
  end
end
